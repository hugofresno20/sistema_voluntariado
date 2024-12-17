#blueprint nos permite crear modulos
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from app import mongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from datetime import timedelta

api = Blueprint('api', __name__)


# Ruta para registrar un usuario
# Metodo request metodo de flask que se enlaza con lo que recibe 
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return {"error": "Email y contraseña son obligatorios"}, 400

    if mongo.db.usuarios.find_one({"email": data["email"]}):
        return {"error": "El usuario ya está registrado"}, 400

    nuevo_usuario = {
        "email": data["email"],
        "password": generate_password_hash(data["password"])
    }
    result = mongo.db.usuarios.insert_one(nuevo_usuario)
    
    # Obtener el _id del usuario recién creado
    nuevo_usuario["_id"] = str(result.inserted_id)

    return {"message": "Usuario registrado exitosamente", "id": nuevo_usuario["_id"]}, 201

# Ruta para login de usuario
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return {"error": "Email y contraseña son obligatorios"}, 400

    usuario = mongo.db.usuarios.find_one({"email": data["email"]})
    if not usuario or not check_password_hash(usuario["password"], data["password"]):
        return {"error": "Credenciales incorrectas"}, 401

    # Crear token JWT con una duración de 30 días
    access_token = create_access_token(identity=data["email"], expires_delta=timedelta(days=30))
    return {"access_token": access_token}, 200

# Ruta para listar todos los usuarios
@api.route('/list_users', methods=['GET'])
@jwt_required()
def list_users():

    usuarios = mongo.db.usuarios.find()
    result = []
    
    for usuario in usuarios:
        result.append({
            "id": str(usuario["_id"]),
            "email": usuario["email"],
            "password": usuario["password"]  
        })
    
    return jsonify(result), 200

# Ruta protegida de ejemplo
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return {"message": f"Acceso autorizado para {current_user}"}, 200


# Ruta para obtener los detalles de un usuario por su ID 
@api.route('/user/<id>', methods=['GET'])
@jwt_required()
def get_user(id):
    try:
        user_id = ObjectId(id)
    except Exception:
        return {"error": "ID de usuario no válido"}, 400

    usuario = mongo.db.usuarios.find_one({"_id": user_id})
    if not usuario:
        return {"error": "Usuario no encontrado"}, 404

    return jsonify({
        "email": usuario["email"],
        "id": str(usuario["_id"])
    }), 200

# Ruta para actualizar un usuario por su ID 
@api.route('/update_user/<id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    current_user = get_jwt_identity()

    try:
        user_id = ObjectId(id)
    except Exception:
        return {"error": "ID de usuario no válido"}, 400

    usuario = mongo.db.usuarios.find_one({"_id": user_id})
    if not usuario:
        return {"error": "Usuario no encontrado"}, 404

    # Actualizar los datos del usuario
    data = request.get_json()
    update_data = {}
    
    if "email" in data:
        update_data["email"] = data["email"]
    if "password" in data:
        update_data["password"] = generate_password_hash(data["password"]) 
    
    # Actualizar el usuario en la base de datos
    mongo.db.usuarios.update_one({"_id": user_id}, {"$set": update_data})

    return {"message": "Usuario actualizado exitosamente"}, 200

# Ruta para eliminar un usuario por su ID
@api.route('/delete_user/<id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    current_user = get_jwt_identity()

    try:
        user_id = ObjectId(id)
    except Exception:
        return {"error": "ID de usuario no válido"}, 400

    result = mongo.db.usuarios.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        return {"error": "Usuario no encontrado"}, 404

    return {"message": "Usuario eliminado exitosamente"}, 200



# Gestión de proyectos


# Ruta para crear un proyecto
@api.route('/create_project', methods=['POST'])
@jwt_required()
def create_project():
    current_user = get_jwt_identity()

    # Obtener datos del proyecto
    data = request.get_json()
    if not data or not data.get("nombre") or not data.get("descripcion") or not data.get("pais"):
        return {"error": "El nombre, la descripción y el país son obligatorios"}, 400

    # Crear proyecto
    nuevo_proyecto = {
        "nombre": data["nombre"],
        "descripcion": data["descripcion"],
        "estado": "activo", 
        "voluntarios": [], 
        "fecha_creacion": (datetime.now() - timedelta(hours=1)).isoformat(),  
        "pais": data["pais"]
    }
    mongo.db.proyectos.insert_one(nuevo_proyecto)
    return {"message": "Proyecto creado exitosamente"}, 201


# Ruta para listar todos los proyectos
@api.route('/list_projects', methods=['GET'])
@jwt_required()
def list_projects():
    proyectos = mongo.db.proyectos.find()
    result = []
    for proyecto in proyectos:
        result.append({
            "id": str(proyecto["_id"]),
            "nombre": proyecto["nombre"],
            "descripcion": proyecto["descripcion"],
            "estado": proyecto["estado"],
            "voluntarios": proyecto["voluntarios"],
            "fecha_creacion": proyecto["fecha_creacion"],
            "pais": proyecto.get("pais", "No especificado") 
        })
    return jsonify(result), 200

# Ruta para actualizar un proyecto
@api.route('/update_project/<id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    current_user = get_jwt_identity()

    # Verificar si el ID es válido
    try:
        proyecto_id = ObjectId(id)
    except Exception:
        return {"error": "ID de proyecto no válido"}, 400

    data = request.get_json()
    update_data = {}
    if "nombre" in data:
        update_data["nombre"] = data["nombre"]
    if "descripcion" in data:
        update_data["descripcion"] = data["descripcion"]
    if "pais" in data:
        update_data["pais"] = data["pais"]
    if "estado" in data:
        update_data["estado"] = data["estado"]

    # Actualizar proyecto
    result = mongo.db.proyectos.update_one({"_id": proyecto_id}, {"$set": update_data})
    if result.matched_count == 0:
        return {"error": "Proyecto no encontrado"}, 404

    return {"message": "Proyecto actualizado exitosamente"}, 200

# Ruta para eliminar un proyecto
@api.route('/delete_project/<id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):
    current_user = get_jwt_identity()

    # Verificar si el ID es válido
    try:
        proyecto_id = ObjectId(id)
    except Exception:
        return {"error": "ID de proyecto no válido"}, 400

    result = mongo.db.proyectos.delete_one({"_id": proyecto_id})
    if result.deleted_count == 0:
        return {"error": "Proyecto no encontrado"}, 404

    return {"message": "Proyecto eliminado exitosamente"}, 200

# Ruta para que un usuario se una a un proyecto como voluntario
@api.route('/join_project/<project_id>', methods=['POST'])
@jwt_required()
def join_project(project_id):
    current_user = get_jwt_identity()
    proyecto = mongo.db.proyectos.find_one({"_id": ObjectId(project_id)})

    if not proyecto:
        return jsonify({"error": "El proyecto no existe"}), 404

    if current_user in proyecto.get("voluntarios", []):
        return jsonify({"message": "Ya estás inscrito en este proyecto"}), 200

    mongo.db.proyectos.update_one(
        {"_id": ObjectId(project_id)},
        {"$push": {"voluntarios": current_user}}
    )
    return jsonify({"message": "Te has unido al proyecto exitosamente"}), 200


# Ruta para listar los proyectos de un usuario
@api.route('/my_projects', methods=['GET'])
@jwt_required()
def my_projects():
    current_user = get_jwt_identity()  # Obtener el usuario autenticado

    # Buscar proyectos donde el usuario esté en la lista de voluntarios
    proyectos = mongo.db.proyectos.find({"voluntarios": current_user})
    result = []
    for proyecto in proyectos:
        result.append({
            "id": str(proyecto["_id"]),
            "nombre": proyecto["nombre"],
            "descripcion": proyecto["descripcion"],
            "estado": proyecto["estado"],
            "fecha_creacion": proyecto["fecha_creacion"],
            "pais": proyecto.get("pais", "No especificado")
        })

    return jsonify(result), 200


# Ruta para que un usuario se elimine de un proyecto como voluntario
@api.route('/leave_project/<id>', methods=['POST'])
@jwt_required()
def leave_project(id):
    current_user = get_jwt_identity()  # Obtener el usuario autenticado

    # Verificar si el ID del proyecto es válido
    try:
        proyecto_id = ObjectId(id)
    except Exception:
        return {"error": "ID de proyecto no válido"}, 400

    # Buscar el proyecto
    proyecto = mongo.db.proyectos.find_one({"_id": proyecto_id})
    if not proyecto:
        return {"error": "Proyecto no encontrado"}, 404

    if current_user not in proyecto.get("voluntarios", []):
        return {"error": "El usuario no está registrado como voluntario en este proyecto"}, 400

    mongo.db.proyectos.update_one(
        {"_id": proyecto_id},
        {"$pull": {"voluntarios": current_user}}
    )

    return {"message": "Usuario eliminado como voluntario del proyecto"}, 200

# Ruta para listar los voluntarios de un proyecto
@api.route('/project_volunteers/<id>', methods=['GET'])
@jwt_required()
def project_volunteers(id):
    # Verificar si el ID del proyecto es válido
    try:
        proyecto_id = ObjectId(id)
    except Exception:
        return {"error": "ID de proyecto no válido"}, 400

    proyecto = mongo.db.proyectos.find_one({"_id": proyecto_id})
    if not proyecto:
        return {"error": "Proyecto no encontrado"}, 404

    # Devolver la lista de voluntarios
    return jsonify({"voluntarios": proyecto.get("voluntarios", [])}), 200


# Ruta para buscar proyectos con filtros
from datetime import datetime

@api.route('/search_projects', methods=['GET'])
@jwt_required()
def search_projects():
    nombre = request.args.get('nombre')
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    pais = request.args.get('pais')  

    if fecha_inicio:
        fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
    if fecha_fin:
        fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d')

    filtros = {}

    if nombre:
        filtros["nombre"] = {"$regex": nombre, "$options": "i"} 
    if fecha_inicio and fecha_fin:
        filtros["fecha_creacion"] = {"$gte": fecha_inicio, "$lte": fecha_fin}
    elif fecha_inicio:
        filtros["fecha_creacion"] = {"$gte": fecha_inicio}
    elif fecha_fin:
        filtros["fecha_creacion"] = {"$lte": fecha_fin}
    if pais:
        filtros["pais"] = {"$regex": pais, "$options": "i"}  

    # Buscar los proyectos que coincidan con los filtros
    proyectos = mongo.db.proyectos.find(filtros)
    
    result = []
    for proyecto in proyectos:
        result.append({
            "id": str(proyecto["_id"]),
            "nombre": proyecto["nombre"],
            "descripcion": proyecto["descripcion"],
            "estado": proyecto["estado"],
            "voluntarios": proyecto["voluntarios"],
            "fecha_creacion": proyecto["fecha_creacion"],
            "pais": proyecto["pais"], 
        })

    return jsonify(result), 200

#Importa la inicializacion de mongo previa
from app import mongo
from bson.objectid import ObjectId
from datetime import datetime

# Función para crear un usuario
def crear_usuario(data):
    return mongo.db.usuarios.insert_one(data)

# Función para obtener todos los proyectos
def obtener_proyectos():
    return mongo.db.proyectos.find()

# Función para crear un proyecto
def crear_proyecto(data):
    proyecto = {
        "nombre": data["nombre"],
        "descripcion": data["descripcion"],
        "estado": "activo",  # Estado por defecto
        "voluntarios": [],  # Lista vacía al inicio
        "fecha_creacion": datetime.isoformat()  # Fecha de creación en formato ISO
    }
    return mongo.db.proyectos.insert_one(proyecto)

# Función para buscar un proyecto por su ID
def buscar_proyecto_por_id(proyecto_id):
    try:
        return mongo.db.proyectos.find_one({"_id": ObjectId(proyecto_id)})
    except Exception:
        return None

# Función para actualizar un proyecto
def actualizar_proyecto(proyecto_id, data):
    try:
        return mongo.db.proyectos.update_one(
            {"_id": ObjectId(proyecto_id)},
            {"$set": data}  # Actualiza solo los campos proporcionados
        )
    except Exception:
        return None

# Función para eliminar un proyecto
def eliminar_proyecto(proyecto_id):
    try:
        return mongo.db.proyectos.delete_one({"_id": ObjectId(proyecto_id)})
    except Exception:
        return None

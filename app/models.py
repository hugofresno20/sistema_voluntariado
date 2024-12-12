from app import mongo
from bson.objectid import ObjectId
from datetime import datetime

# Función para crear un usuario
def crear_usuario(data):
    """Crea un nuevo usuario en la colección 'usuarios'."""
    return mongo.db.usuarios.insert_one(data)

# Función para obtener todos los proyectos
def obtener_proyectos():
    """Obtiene todos los proyectos de la colección 'proyectos'."""
    return mongo.db.proyectos.find()

# Función para crear un proyecto
def crear_proyecto(data):
    """Crea un nuevo proyecto en la colección 'proyectos'."""
    proyecto = {
        "nombre": data["nombre"],
        "descripcion": data["descripcion"],
        "estado": "activo",  # Estado por defecto
        "voluntarios": [],  # Lista vacía al inicio
        "fecha_creacion": datetime.utcnow().isoformat()  # Fecha de creación en formato ISO
    }
    return mongo.db.proyectos.insert_one(proyecto)

# Función para buscar un proyecto por su ID
def buscar_proyecto_por_id(proyecto_id):
    """Busca un proyecto en la colección 'proyectos' por su ID."""
    try:
        return mongo.db.proyectos.find_one({"_id": ObjectId(proyecto_id)})
    except Exception:
        return None

# Función para actualizar un proyecto
def actualizar_proyecto(proyecto_id, data):
    """Actualiza los datos de un proyecto existente."""
    try:
        return mongo.db.proyectos.update_one(
            {"_id": ObjectId(proyecto_id)},
            {"$set": data}  # Actualiza solo los campos proporcionados
        )
    except Exception:
        return None

# Función para eliminar un proyecto
def eliminar_proyecto(proyecto_id):
    """Elimina un proyecto de la colección 'proyectos'."""
    try:
        return mongo.db.proyectos.delete_one({"_id": ObjectId(proyecto_id)})
    except Exception:
        return None

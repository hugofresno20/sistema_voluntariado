#Depenndencias framework back y conexion mongo python
#variables de entorno, autenticacion y solicitud 
#entre back y front
from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Inicializar extensiones
mongo = PyMongo()
jwt = JWTManager()

def create_app():
    # Cargar variables de entorno
    load_dotenv()

    # Configurar Flask, obtener claves y conexion mongo
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default_secret_key")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/testDb")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_jwt_secret")

    # Inicializar extensiones de arriba con fucion de flask
    mongo.init_app(app)
    jwt.init_app(app)

    # Habilita la conexion del front y el back
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Registrar rutas para que interprete flask
    from app.routes import api
    app.register_blueprint(api)

    return app

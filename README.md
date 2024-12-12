
# Sistema Voluntariado

Este proyecto es una aplicación web para la gestión de proyectos y usuarios. La aplicación permite a los usuarios registrarse, iniciar sesión, unirse a proyectos, buscar proyectos y gestionar su participación en ellos, además de poder eliminar y editar estos.

## 🛠️ Tecnologías y Herramientas Utilizadas

Este proyecto combina varias herramientas y tecnologías. 
A continuación, se detalla lo que se utilizó en el backend y el frontend:

### **Backend**
Se utilizó **Python** junto con el framework **Flask** para manejar la lógica de la aplicación, las rutas, y las operaciones en la base de datos:
- **Python**: Lenguaje principal para el desarrollo del backend.
- **Flask**: Microframework para manejar rutas, lógica y comunicación entre el frontend y el backend.
- **Extensiones de Flask**:
  - `Flask-JWT-Extended`: Para la autenticación segura utilizando tokens JWT (JSON Web Tokens).
  - `pymongo`: Para interactuar con la base de datos MongoDB desde Python.
- **MongoDB**:
  - Base de datos NoSQL utilizada para almacenar usuarios, proyectos y relaciones.
  - Acceso manejado a través de la biblioteca `pymongo`.
- **Werkzeug Security**:
  - Utilizada para gestionar el hash y la validación de contraseñas de forma segura.
- **Datetime**:
  - Módulo para gestionar fechas y horas en el contexto de los proyectos.

### **Frontend**
La interfaz fue desarrollada utilizando HTML, CSS y JavaScript:
- **HTML**:
  - Estructura base de las páginas web del proyecto.
- **CSS**:
  - Diseños personalizados para estructurar la interfaz de usuario, con estilos claros para botones, listas y formularios.
- **JavaScript**:
  - Principal motor de interacción dinámica entre el usuario y la aplicación.
  - Utilizado para:
    - Manejar eventos en botones y formularios.
    - Hacer solicitudes HTTP al backend (usando `fetch`).
    - Actualizar dinámicamente el contenido del DOM sin recargar la página.
- **Fetch API**:
  - Para enviar solicitudes HTTP desde el frontend al backend.

### **Herramientas Adicionales**
- **MongoDB Compass**:
  - Interfaz gráfica para visualizar y gestionar la base de datos MongoDB.
- **Git** y **GitHub**:
  - Control de versiones y almacenamiento remoto del código fuente.
- **Entorno Virtual con Conda**:
  - Para gestionar las dependencias del proyecto y mantener un entorno limpio.


## 📂 Estructura del Proyecto

El proyecto está organizado en carpetas y archivos para separar claramente la lógica del backend, frontend y configuraciones.
A continuación se detalla la estructura:


### **Detalles por Carpeta y Archivos**
#### **`app/`**
Contiene toda la lógica del backend:
- `__init__.py`: Inicializa la aplicación Flask y configura las extensiones.
- `models.py`: Define las estructuras o modelos de datos utilizados en MongoDB.
- `routes.py`: Implementa las rutas del backend CRUD(usuarios y prooyectos).


#### **`frontend/`**
Incluye todo lo relacionado con la interfaz del usuario:
- `css/`: Contiene los estilos CSS que se aplican a las páginas.
  - `styles.css`: Archivo principal de diseño.
- `js/`: Incluye la lógica del cliente en JavaScript.
  - `app.js`: Controla los eventos de usuario y realiza solicitudes al backend.
- `dashboard.html`: Interfaz principal del usuario donde se gestionan proyectos y usuarios.
- `index.html`: Página de inicio de sesión.
- `register.html`: Página para registrar nuevos usuarios.

#### **`venv/`**
Directorio generado por el entorno virtual, que contiene las bibliotecas y dependencias instaladas para este proyecto. Es importante para mantener un entorno controlado y reproducible.

#### **Archivos de Configuración**
- `.env`: Contiene configuraciones sensibles como la conexión a MongoDB o claves secretas.
- `requirements.txt`: Lista de todas las dependencias de Python necesarias para el proyecto.
- `run.py`: Archivo principal que inicia la aplicación Flask. Este archivo configura el servidor y corre la aplicación.
=======

---

## 🔗 Conexiones entre el Backend y el Frontend

El backend (Python con Flask) y el frontend (HTML + CSS + JavaScript) se comunican utilizando **API REST**. 
A continuación, se describe cómo funcionan estas conexiones a rasgos generales:

1. **Frontend (HTML/JS)**:  
   - El usuario interactúa con formularios y botones en la interfaz web.
   - Al realizar una acción (como crear un proyecto), el frontend realiza una solicitud HTTP (usualmente `POST` o `GET`) a una ruta del backend utilizando `fetch` en JavaScript.

2. **Backend (Python con Flask)**:  
   - Flask recibe la solicitud en una de sus rutas definidas, por ejemplo, `/create_project`.
   - Procesa los datos enviados (en formato JSON) y realiza operaciones en la base de datos (MongoDB).
   - Retorna una respuesta al frontend, usualmente en formato JSON, que contiene información como mensajes de éxito o los datos solicitados.

3. **Respuesta al Frontend**:
   - El frontend recibe la respuesta y la usa para actualizar dinámicamente la interfaz sin necesidad de recargar la página (uso de JavaScript para manipulación DOM).

**Ejemplo de Flujo: Crear un Proyecto**
- El usuario llena el formulario en el navegador y hace clic en "Crear Proyecto".
- JavaScript toma los datos del formulario y envía una solicitud `POST` a `http://127.0.0.1:5000/create_project`.
- Flask procesa los datos, los guarda en MongoDB y retorna un mensaje de éxito.
- JavaScript actualiza la lista de proyectos visibles en la página.

---

## 🚀 Cómo Iniciar el Proyecto

Esta guía explica cómo iniciar el proyecto.

### **1. Instalaciones**
1. Instalar Python desde la página oficial.
3. Instalar MongoDB desde la pagina oficial.

### **2. Agregar los Path**
1. Agregar al path en variables del entorno la ruta de python  `C:\Users\tu_usuario\AppData\Local\Programs\Python\Python312;`
2. Agregar al path en variables del entorno la ruta de python script `C:\Users\tu_usuario\AppData\Local\Programs\Python\Python312\Scripts`
3. Agregar al path en variables del entorno la ruta de mongo
`C:\Program Files\MongoDB\Server\8.0\bin`

### **3. Configurar el Entorno Virtual con Conda**
1. Abrir una terminal `conda.prompt`
1. Asegúrate de estar en la carpeta raíz del proyecto donde se encuentra el archivo `environment.yml`.
2. Ejecuta el siguiente comando para crear un entorno virtual basado en el archivo `environment.yml`:
   ```bash
   conda env create -f environment.yml
3. Activa el entorno virtual:
   ```bash
   conda activate sistema_voluntariado

### **4. Instalar Dependencias**

1. Activa el entorno virtual:
   ```bash
    pip install flask
    pip install flask-jwt-extended
    pip install pymongo
    pip install python-dotenv
    pip install flask-cors
    pip install werkzeug

 
1. **`Flask`**  
   Framework web ligero para crear aplicaciones backend en Python.

2. **`flask-jwt-extended`**  
   Extensión para manejar autenticación y autorización con JWT (JSON Web Tokens).

3. **`pymongo`**  
   Cliente Python para interactuar con bases de datos MongoDB.

4. **`python-dotenv`**  
   Herramienta para gestionar variables de entorno desde un archivo `.env`.

5. **`flask-cors`**  
   Extensión para habilitar solicitudes entre dominios (CORS) en Flask.

6. **`werkzeug`**  
   Biblioteca que maneja funciones de seguridad como hash de contraseñas.

### **4. Iniciar App desde Conda**
1. Asegúrate de que el entorno virtual está activado:
   ```bash
   python run.py

### **5. Levantar Servidor del Frontend**
Tienes dos opciones para levantar el servidor del frontend:
#### **Opción 1: Usar la Terminal**
1. Navega a la carpeta del frontend donde está el archivo `index.html` e introduce:
   ```bash
   cd ruta/a/la/carpeta/del/frontend python -m http.server 8000
2. Navega a localhost:8000 o http://tu_ip:8000
#### **Opción 2: Extensión Visual Code**
1. Utilizar extensión de Visual Code `Live Server`, una vez descargada boton derecho sobre `index.html` y `Open With Live Server`:
2. Liver server abrira directamente la ventana en el navegador.



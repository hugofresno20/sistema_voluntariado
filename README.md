# **Gestión de Proyectos y Usuarios**

## **Descripción del Proyecto**
Este proyecto es una aplicación de gestión de proyectos que permite a los usuarios registrarse, iniciar sesión y realizar operaciones relacionadas con proyectos. Estas operaciones incluyen crear proyectos, buscar proyectos, unirse como voluntarios, editar proyectos, y más. Además, los administradores pueden gestionar usuarios registrados.

La aplicación está desarrollada en **Python** utilizando **Flask** para el backend y **MongoDB** como base de datos.

---

## **Características Principales**
- **Autenticación:**
  - Registro de usuarios con validación.
  - Inicio de sesión con JWT.
  - Protección de rutas mediante autenticación JWT.

- **Gestión de Proyectos:**
  - Crear nuevos proyectos.
  - Buscar proyectos por nombre o país.
  - Unirse como voluntario a proyectos.
  - Listar proyectos en los que el usuario está participando.
  - Editar y eliminar proyectos.
  - Filtrar proyectos disponibles.

- **Gestión de Usuarios:**
  - Listar todos los usuarios registrados.
  - Eliminar usuarios de la base de datos.
  - Editar la información de los usuarios.

---

## **Estructura del Proyecto**
El proyecto está organizado en las siguientes capas:

### **Backend (API RESTful con Flask)**
- **Rutas principales:**
  - `register`: Registrar nuevos usuarios.
  - `login`: Iniciar sesión y generar un JWT.
  - `list_users`: Listar todos los usuarios.
  - `create_project`: Crear un nuevo proyecto.
  - `list_projects`: Listar todos los proyectos disponibles.
  - `join_project`: Permitir a un usuario unirse como voluntario a un proyecto.
  - `my_projects`: Listar proyectos en los que un usuario es voluntario.
  - `update_project`: Actualizar la información de un proyecto.
  - `delete_project`: Eliminar un proyecto.
  - `leave_project`: Permitir que un usuario se retire de un proyecto.

- **Conexión con la base de datos (MongoDB):**
  - Utiliza **pymongo** para interactuar con la base de datos.
  - Colección de usuarios: `usuarios`.
  - Colección de proyectos: `proyectos`.

### **Frontend (Interfaz del Usuario)**
- La interfaz es una página web que interactúa con el backend mediante llamadas **AJAX** (utilizando `fetch`).
- Incluye formularios dinámicos para registro, inicio de sesión, creación y edición de proyectos.
- Secciones principales:
  - **Mis Proyectos**: Muestra los proyectos donde el usuario es voluntario.
  - **Proyectos Disponibles**: Muestra los proyectos disponibles con opciones para unirse, editar o eliminar.
  - **Usuarios Registrados**: Permite listar, ocultar, y eliminar usuarios.

### **Flujo de Datos**
1. El usuario interactúa con el frontend.
2. El frontend realiza llamadas API al backend para realizar operaciones (registro, login, gestión de proyectos).
3. El backend valida las solicitudes, interactúa con la base de datos y devuelve respuestas JSON al frontend.

---

## **Requisitos de Configuración**
1. **Instalar dependencias:**
   - Asegúrate de tener **Python 3.x** instalado.
   - Instala las dependencias necesarias en un entorno virtual:
     ```bash
     pip install -r requirements.txt
     ```
2. **Configurar MongoDB:**
   - Asegúrate de tener MongoDB en ejecución.
   - Configura las credenciales y la URL de conexión en el archivo `app.py` o en una variable de entorno.

3. **Iniciar el servidor Flask:**
   - Ejecuta el comando:
     ```bash
     flask run
     ```
   - Esto iniciará el servidor en `http://127.0.0.1:5000`.

4. **Iniciar el frontend:**
   - Abre el archivo `index.html` en tu navegador.

---

## **Estructura de Archivos**
```plaintext
📂 Proyecto
├── 📂 static
│   └── css/
│       └── styles.css  # Estilos CSS para la interfaz
├── 📂 templates
│   └── index.html      # Página principal del frontend
├── app.py              # Servidor principal Flask
├── api.py              # Rutas API del proyecto
├── requirements.txt    # Dependencias del proyecto
└── README.md           # Este archivo

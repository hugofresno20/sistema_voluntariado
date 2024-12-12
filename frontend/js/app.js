// Lógica de inicio de sesión
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        localStorage.setItem("access_token", data.access_token);
                        alert("Inicio de sesión exitoso");
                        window.location.href = "dashboard.html";
                    } else {
                        alert(data.error || "Error al iniciar sesión.");
                    }
                })
                .catch((error) => {
                    console.error("Error durante el inicio de sesión:", error);
                    alert("No se pudo completar el inicio de sesión. Intenta nuevamente.");
                });
        });
    }
});

// Lógica de registro
if (window.location.pathname.endsWith("register.html")) {
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("register-form");

        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;

                fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message) {
                            alert("Registro exitoso. Ahora puedes iniciar sesión.");
                            window.location.href = "index.html";
                        } else {
                            alert(data.error || "Error al registrarse.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error durante el registro:", error);
                        alert("No se pudo completar el registro. Intenta nuevamente.");
                    });
            });
        }
    });
}

// Lógica del Dashboard
if (window.location.pathname.endsWith("dashboard.html")) {
    document.addEventListener("DOMContentLoaded", function () {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            alert("Debes iniciar sesión primero.");
            window.location.href = "index.html";
            return;
        }

        // Inicializar las funciones del Dashboard
        loadUserProjects();
        loadAvailableProjects();
        setupFilterProjects();
        setupCreateProject();
        setupViewUsers(); 
        setupLogout();

        fetch("http://127.0.0.1:5000/protected", {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                const welcomeMessage = document.getElementById("welcome-message");
                if (data.message) {
                    welcomeMessage.textContent = `Hola, ${data.message.split(" ")[3]}! Bienvenido a tu Dashboard.`;
                }
            })
            .catch((error) => console.error("Error al recuperar el mensaje de bienvenida:", error));

       
    });



    //Logica cargas proyectos del usuario
    function loadUserProjects() {
        const accessToken = localStorage.getItem("access_token");
    
        fetch("http://127.0.0.1:5000/my_projects", {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                const myProjectsList = document.getElementById("my-projects");
                myProjectsList.innerHTML = "";
                if (data.length === 0) {
                    myProjectsList.innerHTML = "<li>No tienes proyectos aún.</li>";
                } else {
                    data.forEach((project) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            <div>
                                <span><strong>Nombre:</strong> ${project.nombre}</span>
                                <button class="btn leave-btn" data-id="${project.id}">Abandonar Proyecto</button>
                            </div>
                        `;
    
                        // Lógica para el botón "Abandonar Proyecto"
                        const leaveButton = listItem.querySelector(".leave-btn");
                        leaveButton.addEventListener("click", function () {
                            leaveProject(project.id);
                        });
    
                        myProjectsList.appendChild(listItem);
                    });
                }
            })
            .catch((error) => console.error("Error al cargar mis proyectos:", error));
    }
    
    

    //Logica boton proyectos disponibles
    document.addEventListener("DOMContentLoaded", function () {
        const toggleAvailableProjectsButton = document.getElementById("toggle-available-projects");
        const availableProjectsList = document.getElementById("available-projects");
    
        toggleAvailableProjectsButton.addEventListener("click", function () {
            if (availableProjectsList.style.display === "none") {
                availableProjectsList.style.display = "block";
                toggleAvailableProjectsButton.textContent = "Ocultar Proyectos Disponibles";
            } else {
                availableProjectsList.style.display = "none";
                toggleAvailableProjectsButton.textContent = "Mostrar Proyectos Disponibles";
            }
        });
    });
    

    // Función para cargar proyectos disponibles
    function loadAvailableProjects() {
        const accessToken = localStorage.getItem("access_token");
    
        fetch("http://127.0.0.1:5000/list_projects", {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                const availableProjectsList = document.getElementById("available-projects");
                availableProjectsList.innerHTML = "";
                if (data.length === 0) {
                    availableProjectsList.innerHTML = "<li>No hay proyectos disponibles.</li>";
                } else {
                    data.forEach((project) => {
                        const listItem = renderProjectDetails(project, true); // Mostrar botones
                        availableProjectsList.appendChild(listItem);
                    });
                }
            })
            .catch((error) => console.error("Error al cargar proyectos disponibles:", error));
    }
    

    // Función para renderizar detalles del proyecto
    function renderProjectDetails(project, showButtons) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div>
                <span><strong>Nombre:</strong> ${project.nombre}</span>
                ${showButtons ? `
                <button class="btn join-btn" data-id="${project.id}">Unirme</button>
                <button class="btn details-btn" data-id="${project.id}">Ver Detalles</button>
                <button class="btn edit-btn" data-id="${project.id}">Editar</button>
                <button class="btn delete-btn" data-id="${project.id}">Eliminar</button>
                ` : ""}
            </div>
            ${showButtons ? `
            <div class="project-details" id="details-${project.id}" style="display: none;">
                <p><strong>Descripción:</strong> ${project.descripcion}</p>
                <p><strong>País:</strong> ${project.pais}</p>
                <p><strong>Creado en:</strong> ${project.fecha_creacion ? formatDate(project.fecha_creacion) : "Fecha no disponible"}</p>
                <p><strong>ID del Proyecto:</strong> ${project.id}</p>
            </div>
            ` : ""}
        `;
    
        // Lógica para los botones solo si se deben mostrar
        if (showButtons) {
            const detailsButton = listItem.querySelector(".details-btn");
            detailsButton.addEventListener("click", function () {
                const detailsDiv = document.getElementById(`details-${project.id}`);
                detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
                detailsButton.textContent =
                    detailsDiv.style.display === "none" ? "Ver Detalles" : "Ocultar Detalles";
            });
    
            // Lógica para "Unirme"
            const joinButton = listItem.querySelector(".join-btn");
            joinButton.addEventListener("click", function () {
                joinProject(project.id);
            });

            const editButton = listItem.querySelector(".edit-btn");
            editButton.addEventListener("click", function () {
                showEditForm(project);
            });
    
            const deleteButton = listItem.querySelector(".delete-btn");
            deleteButton.addEventListener("click", function () {
                deleteProject(project.id);
            });
        }
    
        return listItem;
    }
    
    

    // Función para eliminar proyecto
    function deleteProject(projectId) {
        const accessToken = localStorage.getItem("access_token");

        fetch(`http://127.0.0.1:5000/delete_project/${projectId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message || "Proyecto eliminado.");
                loadAvailableProjects();
                loadUserProjects();
            })
            .catch((error) => {
                console.error("Error al eliminar el proyecto:", error);
                alert("Error al eliminar el proyecto. Por favor, inténtalo de nuevo.");
            });
    }

    // Función para mostrar formulario de edición
    function showEditForm(project) {
        const editFormContainer = document.getElementById("edit-form-container");
        document.getElementById("edit-project-name").value = project.nombre;
        document.getElementById("edit-project-description").value = project.descripcion;
        document.getElementById("edit-project-country").value = project.pais;

        editFormContainer.style.display = "block";

        const editProjectForm = document.getElementById("edit-project-form");
        editProjectForm.onsubmit = function (event) {
            event.preventDefault();
            saveProjectChanges(project.id);
        };
    }

    // Función para guardar cambios en el proyecto
    function saveProjectChanges(projectId) {
        const accessToken = localStorage.getItem("access_token");
        const nombre = document.getElementById("edit-project-name").value;
        const descripcion = document.getElementById("edit-project-description").value;
        const pais = document.getElementById("edit-project-country").value;
    
        fetch(`http://127.0.0.1:5000/update_project/${projectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ nombre, descripcion, pais }),  
        })
            .then((response) => response.json())
            .then(() => {
                alert("Proyecto actualizado exitosamente.");
                document.getElementById("edit-form-container").style.display = "none";
                loadAvailableProjects(); 
                loadUserProjects(); 
            })
            .catch((error) => {
                console.error("Error al actualizar proyecto:", error);
                alert("Error al actualizar el proyecto. Por favor, inténtalo de nuevo.");
            });
    }
    

    // Función para configurar el buscar proyectos
    function setupFilterProjects() {
        const filterProjectForm = document.getElementById("filter-project-form");
        const clearFilterButton = document.getElementById("clear-filter");
    
        filterProjectForm.addEventListener("submit", function (event) {
            event.preventDefault();
    
            const accessToken = localStorage.getItem("access_token");
            const filterName = document.getElementById("filter-name").value.trim();
            const filterCountry = document.getElementById("filter-country").value.trim();
    
            // Verificar que al menos uno de los campos tenga un valor
            if (!filterName && !filterCountry) {
                alert("Por favor, ingresa al menos un criterio de búsqueda.");
                return; 
            }
    
            let url = "http://127.0.0.1:5000/search_projects?";
            if (filterName) url += `nombre=${filterName}&`;
            if (filterCountry) url += `pais=${filterCountry}`;
    
            fetch(url, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    const filteredProjectsList = document.getElementById("filtered-projects");
                    filteredProjectsList.innerHTML = "";
                    if (data.length === 0) {
                        filteredProjectsList.innerHTML = "<li>No se encontraron proyectos.</li>";
                    } else {
                        data.forEach((project) => {
                            const listItem = renderProjectDetails(project, false, false);
                            filteredProjectsList.appendChild(listItem);
                        });
                    }
                })
                .catch((error) => console.error("Error al buscar proyectos:", error));
        });
    
        // Lógica para borrar la búsqueda
        clearFilterButton.addEventListener("click", function () {
            document.getElementById("filter-name").value = "";
            document.getElementById("filter-country").value = "";
            const filteredProjectsList = document.getElementById("filtered-projects");
            filteredProjectsList.innerHTML = ""; 
        });
    }
    

    //boton mostrar crear
    document.addEventListener("DOMContentLoaded", function () {
        const toggleCreateProjectButton = document.getElementById("toggle-create-project");
        const createProjectForm = document.getElementById("create-project-form");
    
        createProjectForm.style.display = "none";
    
        // Lógica del botón Mostrar/Ocultar
        toggleCreateProjectButton.addEventListener("click", function () {
            if (createProjectForm.style.display === "none") {
                createProjectForm.style.display = "block";
                toggleCreateProjectButton.textContent = "Ocultar Formulario de Creación";
            } else {
                createProjectForm.style.display = "none";
                toggleCreateProjectButton.textContent = "Mostrar Formulario de Creación";
            }
        });
    });
    

    
    

    // Función para configurar la creación de proyectos
    function setupCreateProject() {
        const createProjectForm = document.getElementById("create-project-form");
        createProjectForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
    
                const accessToken = localStorage.getItem("access_token");
                const projectNameInput = document.getElementById("project-name");
                const projectDescriptionInput = document.getElementById("project-description");
                const projectCountryInput = document.getElementById("project-country");
    
                const projectName = projectNameInput.value;
                const projectDescription = projectDescriptionInput.value;
                const projectCountry = projectCountryInput.value;
    
                fetch("http://127.0.0.1:5000/create_project", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        nombre: projectName,
                        descripcion: projectDescription,
                        pais: projectCountry,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message) {
                            alert(data.message || "Proyecto creado exitosamente.");
                        } else {
                            alert("Error al crear el proyecto. Por favor, inténtalo nuevamente.");
                        }
                        // Limpiar los campos del formulario
                        projectNameInput.value = "";
                        projectDescriptionInput.value = "";
                        projectCountryInput.value = "";
    
                        loadAvailableProjects();
                    })
                    .catch((error) => {
                        console.error("Error al crear proyecto:", error);
                        alert("Hubo un error al intentar crear el proyecto.");
                    });
            },
            { once: true } // Registrar el evento solo una vez
        );
    }
    


    // Función para configurar el botón de cerrar sesión
    function setupLogout() {
        const logoutButton = document.getElementById("logout-btn");
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("access_token");
            alert("Has cerrado sesión correctamente.");
            window.location.href = "index.html";
        });
    }
}


function formatDate(fechaISO) {
    if (!fechaISO) return "Fecha no disponible";
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    fecha.setHours(fecha.getHours() + 1);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio}  ${horas}:${minutos}`;
}
function joinProject(projectId) {
    const accessToken = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/join_project/${projectId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message || "Te has unido al proyecto.");
            loadAvailableProjects(); 
            loadUserProjects(); 
        })
        .catch((error) => {
            console.error("Error al unirse al proyecto:", error);
            alert("Error al unirse al proyecto. Por favor, inténtalo de nuevo.");
        });
}


//funcion dejar peoyecto
function leaveProject(projectId) {
    const accessToken = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/leave_project/${projectId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message || "Has abandonado el proyecto.");
            loadUserProjects(); 
            loadAvailableProjects(); 
        })
        .catch((error) => {
            console.error("Error al abandonar el proyecto:", error);
            alert("Error al abandonar el proyecto. Por favor, inténtalo nuevamente.");
        });
}


//boton ver usuarios
document.addEventListener("DOMContentLoaded", function () {
    setupViewUsers();
});

    // Lógica para cargar usuarios

function setupViewUsers() {
    const loadUsersButton = document.getElementById("load-users-btn");
    const hideUsersButton = document.getElementById("hide-users-btn");
    const usersList = document.getElementById("users-list");

    loadUsersButton.addEventListener("click", function () {
        const accessToken = localStorage.getItem("access_token");

        fetch("http://127.0.0.1:5000/list_users", {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener usuarios");
                }
                return response.json();
            })
            .then((data) => {
                usersList.innerHTML = "";

                if (data.length === 0) {
                    usersList.innerHTML = "<li>No hay usuarios registrados.</li>";
                } else {
                    data.forEach((user) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            Email: ${user.email}
                            <button class="btn btn-danger delete-user-btn" data-id="${user.id}">Eliminar</button>
                        `;
                        usersList.appendChild(listItem);
                    });

                    // Agregar evento al botón "Eliminar" de cada usuario
                    const deleteButtons = document.querySelectorAll(".delete-user-btn");
                    deleteButtons.forEach((button) => {
                        button.addEventListener("click", function () {
                            const userId = button.getAttribute("data-id");
                            deleteUser(userId, button);
                        });
                    });
                }

                usersList.style.display = "block";
                loadUsersButton.style.display = "none";
                hideUsersButton.style.display = "inline-block";
            })
            .catch((error) => {
                console.error("Error al cargar usuarios:", error);
                alert("No se pudieron cargar los usuarios. Inténtalo nuevamente.");
            });
    });

    // Lógica para ocultar usuarios
    hideUsersButton.addEventListener("click", function () {
        usersList.style.display = "none";
        hideUsersButton.style.display = "none";
        loadUsersButton.style.display = "inline-block";
    });
}

// Función para eliminar un usuario
function deleteUser(userId, button) {
    const accessToken = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/delete_user/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${accessToken}` },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al eliminar usuario");
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message || "Usuario eliminado exitosamente.");
            const listItem = button.parentElement;
            listItem.remove(); 
        })
        .catch((error) => {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario. Inténtalo nuevamente.");
        });
}





// Configuración de la API - CAMBIAR POR LA IP PRIVADA DE TU INSTANCIA EC2 BACKEND
const API_URL = "http://10.0.1.200:5000" // Reemplazar con la IP privada de tu EC2 backend

// Datos de ejemplo para demostración
const CURSOS_EJEMPLO = [
  {
    id: 1,
    nombre: "Desarrollo Web Full Stack",
    descripcion: "Aprende HTML, CSS, JavaScript, Node.js y bases de datos",
    duracion_horas: 120,
    instructor: "Carlos Mendoza",
    precio: 299.99,
    imagen_url: "/desarrollo-web-fullstack-programacion-codigo.jpg",
  },
  {
    id: 2,
    nombre: "Python para Data Science",
    descripcion: "Domina Python, Pandas, NumPy y visualización de datos",
    duracion_horas: 80,
    instructor: "Ana García",
    precio: 249.99,
    imagen_url: "/python-data-science-analytics-graficos.jpg",
  },
  {
    id: 3,
    nombre: "AWS Cloud Practitioner",
    descripcion: "Fundamentos de AWS: EC2, S3, RDS, VPC y arquitectura cloud",
    duracion_horas: 60,
    instructor: "Roberto Silva",
    precio: 199.99,
    imagen_url: "/aws-cloud-computing-servidores-nube.jpg",
  },
  {
    id: 4,
    nombre: "React y Next.js Avanzado",
    descripcion: "Construye aplicaciones modernas con React, Next.js y TypeScript",
    duracion_horas: 100,
    instructor: "Laura Martínez",
    precio: 279.99,
    imagen_url: "/react-nextjs-frontend-desarrollo-web-moderno.jpg",
  },
  {
    id: 5,
    nombre: "DevOps y CI/CD",
    descripcion: "Docker, Kubernetes, Jenkins y automatización de despliegues",
    duracion_horas: 90,
    instructor: "Miguel Torres",
    precio: 319.99,
    imagen_url: "/devops-docker-kubernetes-automatizacion.jpg",
  },
  {
    id: 6,
    nombre: "Bases de Datos PostgreSQL",
    descripcion: "Diseño, optimización y administración de bases de datos",
    duracion_horas: 70,
    instructor: "Patricia Ruiz",
    precio: 189.99,
    imagen_url: "/postgresql-base-de-datos-sql-tablas.jpg",
  },
]

// Estado global
let cursosData = []
let alumnosData = []
let inscripcionesData = []

// ==================== FUNCIONES DE NAVEGACIÓN ====================

function mostrarSeccion(seccion) {
  // Ocultar todas las secciones
  document.querySelectorAll(".seccion").forEach((s) => s.classList.remove("active"))
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"))

  // Mostrar la sección seleccionada
  document.getElementById(`seccion-${seccion}`).classList.add("active")
  event.target.classList.add("active")

  // Cargar datos según la sección
  switch (seccion) {
    case "cursos":
      cargarCursos()
      break
    case "alumnos":
      cargarAlumnos()
      break
    case "inscripciones":
      cargarInscripciones()
      break
    case "estadisticas":
      cargarEstadisticas()
      break
  }
}

// ==================== FUNCIONES DE CURSOS ====================

async function cargarCursos() {
  const container = document.getElementById("cursos-grid")
  container.innerHTML = '<div class="loading">Cargando cursos...</div>'

  try {
    const response = await fetch(`${API_URL}/api/cursos`)
    if (!response.ok) throw new Error("Error al cargar cursos")

    cursosData = await response.json()
    renderizarCursos(cursosData)
  } catch (error) {
    console.error("Error:", error)
    console.log("⚠️ Mostrando cursos de ejemplo (backend no disponible)")
    cursosData = CURSOS_EJEMPLO
    renderizarCursos(cursosData)
    mostrarToast("⚠️ Mostrando cursos de ejemplo", "warning")
  }
}

function renderizarCursos(cursos) {
  const container = document.getElementById("cursos-grid")

  if (cursos.length === 0) {
    container.innerHTML = '<div class="loading">No hay cursos disponibles</div>'
    return
  }

  container.innerHTML = cursos
    .map(
      (curso) => `
        <div class="curso-card">
            <div class="curso-imagen">
                ${curso.imagen_url ? `<img src="${curso.imagen_url}" alt="${curso.nombre}" style="width:100%;height:100%;object-fit:cover;">` : "📚"}
            </div>
            <div class="curso-contenido">
                <h3 class="curso-titulo">${curso.nombre}</h3>
                <p class="curso-descripcion">${curso.descripcion || "Sin descripción"}</p>
                <div class="curso-info">
                    <span class="info-badge">⏱️ ${curso.duracion_horas || 0} horas</span>
                </div>
                <div class="curso-precio">S/ ${Number.parseFloat(curso.precio || 0).toFixed(2)}</div>
                <p class="curso-instructor">👨‍🏫 ${curso.instructor || "Sin instructor"}</p>
            </div>
        </div>
    `,
    )
    .join("")
}

async function crearCurso(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  const curso = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    duracion_horas: Number.parseInt(formData.get("duracion_horas")) || 0,
    precio: Number.parseFloat(formData.get("precio")) || 0,
    instructor: formData.get("instructor"),
    imagen_url: formData.get("imagen_url"),
  }

  try {
    const response = await fetch(`${API_URL}/api/cursos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curso),
    })

    if (!response.ok) throw new Error("Error al crear curso")

    mostrarToast("✅ Curso creado exitosamente", "success")
    cerrarModal("modal-nuevo-curso")
    form.reset()
    cargarCursos()
  } catch (error) {
    console.error("Error:", error)
    mostrarToast("❌ Error al crear curso", "error")
  }
}

// ==================== FUNCIONES DE ALUMNOS ====================

async function cargarAlumnos() {
  const container = document.getElementById("alumnos-lista")
  container.innerHTML = '<div class="loading">Cargando alumnos...</div>'

  try {
    const response = await fetch(`${API_URL}/api/alumnos`)
    if (!response.ok) throw new Error("Error al cargar alumnos")

    alumnosData = await response.json()

    if (alumnosData.length === 0) {
      container.innerHTML = '<div class="loading">No hay alumnos registrados</div>'
      return
    }

    container.innerHTML = `
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${alumnosData
                      .map(
                        (alumno) => `
                        <tr>
                            <td>${alumno.id}</td>
                            <td><strong>${alumno.nombre}</strong></td>
                            <td>${alumno.email || "-"}</td>
                            <td>${alumno.telefono || "-"}</td>
                            <td>${new Date(alumno.fecha_registro).toLocaleDateString("es-PE")}</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        `
  } catch (error) {
    console.error("Error:", error)
    container.innerHTML = '<div class="loading">❌ Error al cargar alumnos</div>'
    mostrarToast("Error al cargar alumnos", "error")
  }
}

async function crearAlumno(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  const alumno = {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
  }

  try {
    const response = await fetch(`${API_URL}/api/alumnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    })

    if (!response.ok) throw new Error("Error al registrar alumno")

    mostrarToast("✅ Alumno registrado exitosamente", "success")
    cerrarModal("modal-nuevo-alumno")
    form.reset()
    cargarAlumnos()
  } catch (error) {
    console.error("Error:", error)
    mostrarToast("❌ Error al registrar alumno", "error")
  }
}

// ==================== FUNCIONES DE INSCRIPCIONES ====================

async function cargarInscripciones() {
  const container = document.getElementById("inscripciones-lista")
  container.innerHTML = '<div class="loading">Cargando inscripciones...</div>'

  try {
    const response = await fetch(`${API_URL}/api/inscripciones`)
    if (!response.ok) throw new Error("Error al cargar inscripciones")

    inscripcionesData = await response.json()

    if (inscripcionesData.length === 0) {
      container.innerHTML = '<div class="loading">No hay inscripciones registradas</div>'
      return
    }

    container.innerHTML = `
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Alumno</th>
                        <th>Email</th>
                        <th>Curso</th>
                        <th>Instructor</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${inscripcionesData
                      .map(
                        (insc) => `
                        <tr>
                            <td>${insc.id}</td>
                            <td><strong>${insc.alumno_nombre}</strong></td>
                            <td>${insc.alumno_email || "-"}</td>
                            <td>${insc.curso_nombre}</td>
                            <td>${insc.instructor}</td>
                            <td>${new Date(insc.fecha_inscripcion).toLocaleDateString("es-PE")}</td>
                            <td><span class="badge badge-${insc.estado}">${insc.estado}</span></td>
                            <td>
                                <button class="btn-danger" onclick="eliminarInscripcion(${insc.id})">Eliminar</button>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        `
  } catch (error) {
    console.error("Error:", error)
    container.innerHTML = '<div class="loading">❌ Error al cargar inscripciones</div>'
    mostrarToast("Error al cargar inscripciones", "error")
  }
}

async function crearInscripcion(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  const inscripcion = {
    alumno_id: Number.parseInt(formData.get("alumno_id")),
    curso_id: Number.parseInt(formData.get("curso_id")),
  }

  try {
    const response = await fetch(`${API_URL}/api/inscripciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcion),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error al crear inscripción")
    }

    mostrarToast("✅ Inscripción registrada exitosamente", "success")
    cerrarModal("modal-nueva-inscripcion")
    form.reset()
    cargarInscripciones()
  } catch (error) {
    console.error("Error:", error)
    mostrarToast(`❌ ${error.message}`, "error")
  }
}

async function eliminarInscripcion(id) {
  if (!confirm("¿Estás seguro de eliminar esta inscripción?")) return

  try {
    const response = await fetch(`${API_URL}/api/inscripciones/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Error al eliminar inscripción")

    mostrarToast("✅ Inscripción eliminada", "success")
    cargarInscripciones()
  } catch (error) {
    console.error("Error:", error)
    mostrarToast("❌ Error al eliminar inscripción", "error")
  }
}

// ==================== FUNCIONES DE ESTADÍSTICAS ====================

async function cargarEstadisticas() {
  const container = document.getElementById("estadisticas-cards")
  container.innerHTML = '<div class="loading">Cargando estadísticas...</div>'

  try {
    const response = await fetch(`${API_URL}/api/estadisticas`)
    if (!response.ok) throw new Error("Error al cargar estadísticas")

    const stats = await response.json()

    container.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-label">Total de Cursos</div>
                <div class="stat-value">${stats.total_cursos}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-label">Total de Alumnos</div>
                <div class="stat-value">${stats.total_alumnos}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-label">Inscripciones Activas</div>
                <div class="stat-value">${stats.inscripciones_activas}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-label">Curso Más Popular</div>
                <div class="stat-value" style="font-size: 18px;">${stats.curso_mas_popular?.nombre || "N/A"}</div>
                <div class="stat-label">${stats.curso_mas_popular?.total_inscripciones || 0} inscripciones</div>
            </div>
        `
  } catch (error) {
    console.error("Error:", error)
    container.innerHTML = '<div class="loading">❌ Error al cargar estadísticas</div>'
    mostrarToast("Error al cargar estadísticas", "error")
  }
}

// ==================== FUNCIONES DE MODALES ====================

async function mostrarModalNuevoCurso() {
  document.getElementById("modal-nuevo-curso").classList.add("active")
}

async function mostrarModalNuevoAlumno() {
  document.getElementById("modal-nuevo-alumno").classList.add("active")
}

async function mostrarModalNuevaInscripcion() {
  // Cargar alumnos y cursos para los selects
  try {
    const [alumnosRes, cursosRes] = await Promise.all([fetch(`${API_URL}/api/alumnos`), fetch(`${API_URL}/api/cursos`)])

    const alumnos = await alumnosRes.json()
    const cursos = await cursosRes.json()

    // Llenar select de alumnos
    const selectAlumno = document.getElementById("select-alumno")
    selectAlumno.innerHTML =
      '<option value="">-- Seleccione un alumno --</option>' +
      alumnos.map((a) => `<option value="${a.id}">${a.nombre}</option>`).join("")

    // Llenar select de cursos
    const selectCurso = document.getElementById("select-curso")
    selectCurso.innerHTML =
      '<option value="">-- Seleccione un curso --</option>' +
      cursos.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")

    document.getElementById("modal-nueva-inscripcion").classList.add("active")
  } catch (error) {
    console.error("Error:", error)
    mostrarToast("Error al cargar datos para inscripción", "error")
  }
}

function cerrarModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
}

// Cerrar modal al hacer clic fuera
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })
})

// ==================== FUNCIONES DE UTILIDAD ====================

function mostrarToast(mensaje, tipo = "success") {
  const toast = document.getElementById("toast")
  toast.textContent = mensaje
  toast.className = `toast ${tipo} show`

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener("DOMContentLoaded", () => {
  // Cargar cursos por defecto
  cargarCursos()

  // Verificar conexión con el backend
  fetch(`${API_URL}/api/status`)
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Conexión con backend:", data.message)
    })
    .catch((error) => {
      console.error("❌ Error de conexión con backend:", error)
      console.log("ℹ️ Funcionando en modo de ejemplo sin backend")
    })
})

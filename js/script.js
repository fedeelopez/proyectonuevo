// === Gestión de Usuarios y Sesión ===
const usuarios = [
  { documento: '1111', nombre: 'Carlos Pérez', area: 'operaciones' },
  { documento: '2222', nombre: 'Ana Torres', area: 'mantenimiento' },
  { documento: '3333', nombre: 'Mariana Ruiz', area: 'matriceria' },
  { documento: '4444', nombre: 'Luciano Gómez', area: 'logistica' },
  { documento: '9999', nombre: 'Gerente General', area: 'todos' }
];

let usuarioActivo = null;

function guardarSesion(usuario) {
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

function obtenerSesion() {
  const data = localStorage.getItem('usuarioActivo');
  return data ? JSON.parse(data) : null;
}

function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  usuarioActivo = null;
  document.getElementById('sidebar').style.display = 'none';
  document.querySelector('.header').innerHTML = `
    <button class="menu-btn" onclick="toggleSidebar()">☰</button>
    <img src="./assets/logo_vaer.png" alt="Logo Empresa" class="logo" />
  `;
  mostrarLogin();
}

function mostrarLogin() {
  const contenido = document.getElementById('contenido');
  contenido.innerHTML = `
    <h2>Ingreso de Usuario</h2>
    <p>Ingrese su número de documento para acceder:</p>
    <input type="text" id="docInput" placeholder="Documento" style="padding: 0.5rem; font-size: 1rem; max-width: 300px; width: 100%;">
    <button onclick="validarIngreso()" class="btn" style="margin-left: 1rem;">Ingresar</button>
    <div id="mensajeLogin" style="margin-top: 1rem; color: red;"></div>
  `;
  document.getElementById('sidebar').style.display = 'none';
}

function validarIngreso() {
  const doc = document.getElementById('docInput').value.trim();
  const user = usuarios.find(u => u.documento === doc);
  const mensaje = document.getElementById('mensajeLogin');

  if (user) {
    usuarioActivo = user;
    guardarSesion(user);
    document.getElementById('sidebar').style.display = 'block';
    filtrarMenuPorArea(user.area);
    mostrarUsuarioEnHeader(user);
    cargarPagina(`${user.area}-dashboard`);
  } else {
    mensaje.textContent = 'Documento no válido. Intente nuevamente.';
  }
}

function mostrarUsuarioEnHeader(user) {
  const header = document.querySelector('.header');
  const nombreSpan = document.createElement('span');
  nombreSpan.textContent = `👤 ${user.nombre}`;
  nombreSpan.style.marginLeft = 'auto';
  nombreSpan.style.marginRight = '1rem';
  nombreSpan.style.fontWeight = 'bold';

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.className = 'btn';
  logoutBtn.style.marginRight = '1rem';
  logoutBtn.onclick = cerrarSesion;

  header.appendChild(nombreSpan);
  header.appendChild(logoutBtn);
}

function filtrarMenuPorArea(area) {
  const secciones = ['mantenimiento', 'matriceria', 'logistica', 'operaciones'];
  secciones.forEach(seccion => {
    const grupo = document.getElementById(`${seccion}-menu`).parentElement;
    grupo.style.display = area === 'todos' || seccion === area ? 'block' : 'none';
  });
}

window.onload = () => {
  const sesion = obtenerSesion();
  if (sesion) {
    usuarioActivo = sesion;
    document.getElementById('sidebar').style.display = 'block';
    filtrarMenuPorArea(sesion.area);
    mostrarUsuarioEnHeader(sesion);
    cargarPagina(`${sesion.area}-dashboard`);
  } else {
    mostrarLogin();
  }
};

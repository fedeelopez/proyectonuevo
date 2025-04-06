// === Código JS completo con login y funcionalidades integradas ===

const usuarios = [
  { documento: '9999', nombre: 'Gustavo Amarilla', area: 'todos' },
  { documento: '1111', nombre: 'Carlos Pérez', area: 'operaciones' },
  { documento: '2222', nombre: 'Ana Torres', area: 'mantenimiento' },
  { documento: '3333', nombre: 'Mariana Ruiz', area: 'matriceria' },
  { documento: '4444', nombre: 'Luciano Gómez', area: 'logistica' }
];

let usuarioActivo = null;

function toggleMenu(id) {
  const menu = document.getElementById(id);
  menu.classList.toggle('hidden');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
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
  const header = document.querySelector('.header');
  const doc = document.getElementById('docInput').value.trim();
  const user = usuarios.find(u => u.documento === doc);
  const mensaje = document.getElementById('mensajeLogin');

  if (user) {
    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = `👤 ${user.nombre}`;
    nombreSpan.style.marginLeft = 'auto';
    nombreSpan.style.marginRight = '1rem';
    nombreSpan.style.fontWeight = 'bold';

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.className = 'btn';
    logoutBtn.style.marginRight = '1rem';
    logoutBtn.onclick = () => {
      usuarioActivo = null;
      document.getElementById('sidebar').style.display = 'none';
      header.innerHTML = '<button class="menu-btn" onclick="toggleSidebar()">☰</button><img src="./assets/logo_vaer.png" alt="Logo Empresa" class="logo" />';
      mostrarLogin();
    };

    header.appendChild(nombreSpan);
    header.appendChild(logoutBtn);
    usuarioActivo = user;
    document.getElementById('sidebar').style.display = 'block';
    filtrarMenuPorArea(user.area);
    cargarPagina(`${user.area}-dashboard`);
  } else {
    mensaje.textContent = 'Documento no válido. Intente nuevamente.';
  }
}

function filtrarMenuPorArea(area) {
  const secciones = ['mantenimiento', 'matriceria', 'logistica', 'operaciones'];
  secciones.forEach(seccion => {
    const grupo = document.getElementById(`${seccion}-menu`).parentElement;
    grupo.style.display = area === 'todos' || seccion === area ? 'block' : 'none';
  });
}

function cargarPagina(pagina) {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('show');
  const contenido = document.getElementById('contenido');

  let html = '';

  if (pagina === 'operaciones-dashboard') {
    html = `
      <h2>Dashboard de Operaciones</h2>
      <div class="cards-container">
        <div class="card"><h3>Orden de Trabajo</h3><p class="value">#OT-${Math.floor(Math.random() * 10000)}</p></div>
        <div class="card"><h3>Piezas OK</h3><p class="value">150</p></div>
        <div class="card"><h3>Piezas Scrap</h3><p class="value">5</p></div>
      </div>
    `;
  } else if (pagina === 'mantenimiento-dashboard') {
    html = `
      <h2>Dashboard de Mantenimiento</h2>
      <div class="cards-container">
        <div class="card"><h3>Órdenes Abiertas</h3><p class="value">18</p></div>
        <div class="card"><h3>MTTR</h3><p class="value">2.3 h</p></div>
        <div class="card"><h3>MTBF</h3><p class="value">45 h</p></div>
      </div>
    `;
  } else if (pagina === 'matriceria-dashboard') {
    html = `
      <h2>Dashboard de Matricería</h2>
      <div class="cards-container">
        <div class="card"><h3>Herramental activo</h3><p class="value">12</p></div>
        <div class="card"><h3>Mantenimientos en curso</h3><p class="value">3</p></div>
      </div>
    `;
  } else if (pagina === 'logistica-dashboard') {
    html = `
      <h2>Dashboard de Logística</h2>
      <div class="cards-container">
        <div class="card"><h3>Stock Crítico</h3><p class="value">4</p></div>
        <div class="card"><h3>Repuestos Disponibles</h3><p class="value">122</p></div>
      </div>
    `;
  } else {
    html = `<h2>${pagina.replace(/-/g, ' ').toUpperCase()}</h2><p>Contenido en construcción para esta sección.</p>`;
  }

  contenido.innerHTML = html;
}

mostrarLogin();

// === Código JS completo con login, dashboards, orden de trabajo, checklist y alertas progresivas ===

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

function mostrarAlertaProgresiva(titulo, onConfirmar, tiempoEspera, mensajeWhatsApp) {
  const contenedor = document.getElementById('contenido');
  const alerta = document.createElement('div');
  alerta.className = 'alerta-inicio';
  alerta.innerHTML = `
    <h3>${titulo}</h3>
    <button class="btn alerta-ok">✅ OK</button>
    <button class="btn alerta-cancel">❌ Cancelar</button>
  `;
  contenedor.prepend(alerta);

  const timeout = setTimeout(() => {
    alerta.innerHTML += `<p class="cancelado">⚠️ No se completó a tiempo.</p>`;
    window.open(`https://wa.me/5491134567890?text=🚨 ${mensajeWhatsApp}`, '_blank');
  }, tiempoEspera);

  alerta.querySelector('.alerta-ok').addEventListener('click', () => {
    clearTimeout(timeout);
    alerta.innerHTML = `<p class="ok">✅ ${titulo} completado.</p>`;
    onConfirmar();
  });

  alerta.querySelector('.alerta-cancel').addEventListener('click', () => {
    clearTimeout(timeout);
    alerta.innerHTML = `<p class="cancelado">❌ ${titulo} cancelado.</p>`;
  });
}

function configurarChecklist() {
  const btn = document.getElementById('confirmarOrdenBtn');
  const nombreInput = document.getElementById('nombreOperario');
  const checks = document.querySelectorAll('.check-item');

  function validarFormulario() {
    const nombre = nombreInput.value.trim();
    const todosMarcados = Array.from(checks).every(cb => cb.checked);
    btn.disabled = !(nombre && todosMarcados);
    btn.classList.toggle('disabled', btn.disabled);
  }

  if (btn && nombreInput && checks.length) {
    nombreInput.addEventListener('change', validarFormulario);
    checks.forEach(cb => cb.addEventListener('change', validarFormulario));
    validarFormulario();

    btn.addEventListener('click', () => {
      const resultado = document.getElementById('resultadoConfirmacion');
      const nombre = nombreInput.value;
      btn.disabled = true;
      btn.innerText = `Orden Confirmada por ${nombre} ✅`;
      nombreInput.disabled = true;
      resultado.innerHTML = '<p class="ok">✅ Orden de trabajo confirmada correctamente.</p>';

      mostrarAlertaProgresiva(
        '¿Iniciar Fabricación?',
        () => mostrarAlertaProgresiva(
          '¿Preparar Máquina?',
          () => mostrarAlertaProgresiva(
            '¿Liberar Producto?',
            () => mostrarFormularioProduccion(),
            120000,
            'El operario no avanzó con el paso LIBERAR PRODUCTO'
          ),
          120000,
          'El operario no avanzó con el paso PREPARAR MÁQUINA'
        ),
        120000,
        'El operario no avanzó con el paso INICIAR FABRICACIÓN'
      );
    });
  }
}

function mostrarFormularioProduccion() {
  const contenedor = document.getElementById('contenido');
  const div = document.createElement('div');
  div.innerHTML = `
    <h3>Detalle de Producción</h3>
    <label>Piezas OK: <input type="number" id="piezasOk" min="0" value="0"></label><br>
    <label>Piezas Scrap: <input type="number" id="piezasScrap" min="0" value="0"></label><br>
    <button id="btnFinalizarProduccion" class="btn" style="margin-top: 1rem;">Finalizar Producción</button>
    <div id="resultadoFinal" style="margin-top: 1rem;"></div>
  `;
  contenedor.appendChild(div);

  document.getElementById('btnFinalizarProduccion').addEventListener('click', () => {
    const ok = parseInt(document.getElementById('piezasOk').value) || 0;
    const scrap = parseInt(document.getElementById('piezasScrap').value) || 0;
    const total = ok + scrap;
    const resultado = document.getElementById('resultadoFinal');
    if (total === 250) {
      resultado.innerHTML = '<p class="ok">✅ Producción finalizada con éxito.</p>';
    } else {
      resultado.innerHTML = `<p class="cancelado">⚠️ Faltan ${250 - total} piezas.</p>`;
    }
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
      <div class="orden-trabajo">
        <p><strong>Número OT:</strong> OT-${Math.floor(Math.random() * 10000)}</p>
        <p><strong>Número de Pieza:</strong> PZA-1234</p>
        <p><strong>Matriz:</strong> MOL-56</p>
        <p><strong>Materia Prima:</strong> Polipropileno</p>
        <p><strong>Cantidad a Realizar:</strong> 250</p>
        <h3 style="padding-top: 1rem;">Checklist</h3>
        <ul class="checklist">
          <li><label><input type="checkbox" class="check-item"> Confirmación de materia prima</label></li>
          <li><label><input type="checkbox" class="check-item"> Herramientas disponibles</label></li>
          <li><label><input type="checkbox" class="check-item"> Parámetros de máquina verificados</label></li>
          <li><label><input type="checkbox" class="check-item"> Seguridad validada</label></li>
        </ul>
        <div style="margin-top: 1rem;">
          <label for="nombreOperario"><strong>Nombre del Operario:</strong></label><br />
          <select id="nombreOperario" class="input-operario" style="margin-bottom: 1rem; padding: 0.5rem; width: 100%; max-width: 300px;">
            <option value="">Seleccione un nombre</option>
            <option value="Carlos Pérez">Carlos Pérez</option>
            <option value="Ana Torres">Ana Torres</option>
            <option value="Julián Díaz">Julián Díaz</option>
            <option value="Mariana Ruiz">Mariana Ruiz</option>
            <option value="Luciano Gómez">Luciano Gómez</option>
          </select>
        </div>
        <button id="confirmarOrdenBtn" class="btn disabled" disabled>Confirmar Orden</button>
        <div id="resultadoConfirmacion" style="margin-top: 1rem;"></div>
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
  if (pagina === 'operaciones-dashboard') {
    setTimeout(configurarChecklist, 100);
  }
}

mostrarLogin();

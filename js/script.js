// === Código JS completo con login, dashboards, orden de trabajo, checklist, alertas progresivas y nuevas funciones en Operaciones ===

function generarOrdenTrabajo() {
  const orden = {
    numero: Math.floor(Math.random() * 90000) + 10000,
    pieza: 'Pieza A-132',
    lote: 'L-5849',
    materiaPrima: 'Polipropileno',
    cantidad: 250
  };

  const operarios = ["Carlos Pérez", "Ana Torres", "Julián Díaz", "Mariana Ruiz", "Luciano Gómez"];
  const opciones = operarios.map(nombre => `<option value="${nombre}">${nombre}</option>`).join('');

  return `
    <h2>Orden de Trabajo</h2>
    <div class="orden-trabajo">
      <p><strong>Número OT:</strong> ${orden.numero}</p>
      <p><strong>Número de Pieza:</strong> ${orden.pieza}</p>
      <p><strong>Lote:</strong> ${orden.lote}</p>
      <p><strong>Materia Prima:</strong> ${orden.materiaPrima}</p>
      <p><strong>Cantidad a Realizar:</strong> ${orden.cantidad}</p>

      <h3 style="padding-top: 1rem;">Checklist de Confirmación</h3>
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
          ${opciones}
        </select>
      </div>
      <button id="confirmarOrdenBtn" class="btn disabled" style="margin-top: 0.5rem;" disabled>Confirmar Orden</button>
    </div>
    <div id="contenedorAlertas"></div>
  `;
}

const usuarios = [
  { documento: '9999', nombre: 'Gustavo Amarilla', area: 'todos' },
  { documento: '1111', nombre: 'Carlos Pérez', area: 'operaciones' },
  { documento: '2222', nombre: 'Ana Torres', area: 'mantenimiento' },
  { documento: '3333', nombre: 'Mariana Ruiz', area: 'matriceria' },
  { documento: '4444', nombre: 'Luciano Gómez', area: 'logistica' }
];

let usuarioActivo = null;
const historialProduccion = [];

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
    // Limpiar contenido del header antes de agregar nombre y botón
    header.innerHTML = '<button class="menu-btn" onclick="toggleSidebar()">☰</button><img src="./assets/logo_vaer.png" alt="Logo Empresa" class="logo" />';

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

function configurarChecklist() {
  const btn = document.getElementById('confirmarOrdenBtn');
  const nombreInput = document.getElementById('nombreOperario');
  const checkboxes = document.querySelectorAll('.check-item');

  function validar() {
    const nombre = nombreInput.value;
    const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
    btn.disabled = !(nombre && todosMarcados);
    btn.classList.toggle('disabled', btn.disabled);
  }

  nombreInput.addEventListener('change', validar);
  checkboxes.forEach(cb => cb.addEventListener('change', validar));
  validar();

  btn.addEventListener('click', () => {
    const contenedor = document.getElementById('contenido');
    btn.disabled = true;
    btn.textContent = '✅ Orden Confirmada';
    mostrarAlertaProgresiva(
      '¿Iniciar fabricación?',
      () => mostrarAlertaProgresiva(
        '¿Preparar la máquina?',
        () => mostrarAlertaProgresiva(
          '¿Liberar producto?',
          () => mostrarFormularioProduccion(),
          60000,
          'El operario no avanzó con el paso LIBERAR PRODUCTO'
        ),
        60000,
        'El operario no avanzó con el paso PREPARAR LA MÁQUINA'
      ),
      60000,
      'El operario no avanzó con el paso INICIAR FABRICACIÓN'
    );
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
  contenedor.appendChild(alerta);

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

function mostrarFormularioProduccion() {
  const contenedor = document.getElementById('contenido');
  const div = document.createElement('div');
  div.innerHTML = `
    <h3>Detalle de Producción</h3>
    <label>Piezas OK: <input type="number" id="piezasOk" min="0" value="0"></label><br>
    <label>Piezas Scrap: <input type="number" id="piezasScrap" min="0" value="0"></label><br>
    <h3 style="margin-top: 1rem;">Registro de Anomalías</h3>
    <textarea id="anomalias" placeholder="Describa cualquier anomalía..." rows="3" style="width: 100%; max-width: 500px;"></textarea><br>
    <button id="btnFinalizarProduccion" class="btn" style="margin-top: 1rem;">Finalizar Producción</button>
    <div id="resultadoFinal" style="margin-top: 1rem;"></div>
  `;
  contenedor.appendChild(div);

  document.getElementById('btnFinalizarProduccion').addEventListener('click', () => {
    const ok = parseInt(document.getElementById('piezasOk').value) || 0;
    const scrap = parseInt(document.getElementById('piezasScrap').value) || 0;
    const total = ok + scrap;
    const textoAnomalia = document.getElementById('anomalias').value;
    const resultado = document.getElementById('resultadoFinal');

    historialProduccion.unshift({ fecha: new Date().toLocaleString(), ok, scrap, observaciones: textoAnomalia });

    if (total === 250) {
      resultado.innerHTML = '<p class="ok">✅ Producción finalizada con éxito.</p>';
    } else {
      resultado.innerHTML = `<p class="cancelado">⚠️ Faltan ${250 - total} piezas.</p>`;
    }

    mostrarHistorialProduccion();
  });
}

function mostrarHistorialProduccion() {
  const contenedor = document.getElementById('contenido');
  const historialDiv = document.createElement('div');
  historialDiv.innerHTML = `<h3 style="margin-top: 2rem;">Historial de Producción</h3>`;
  if (historialProduccion.length > 0) {
    historialDiv.innerHTML += `
      <table class="data-table">
        <thead><tr><th>Fecha</th><th>OK</th><th>Scrap</th><th>Observaciones</th></tr></thead>
        <tbody>
          ${historialProduccion.map(h => `
            <tr>
              <td>${h.fecha}</td>
              <td>${h.ok}</td>
              <td>${h.scrap}</td>
              <td>${h.observaciones || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  contenedor.appendChild(historialDiv);
}

function cargarPagina(pagina) {
  const contenido = document.getElementById('contenido');
  let html = '';

  switch (pagina) {
    case 'operaciones-dashboard':
      html = generarOrdenTrabajo();
      break;
    case 'mantenimiento-dashboard':
      html = `
        <h2>Dashboard de Mantenimiento</h2>
        <div class="cards-container">
          <div class="card"><h3>Órdenes Abiertas</h3><p class="value">18</p><p class="status warning">En progreso</p></div>
          <div class="card"><h3>MTTR</h3><p class="value">2.3 h</p><p class="status ok">Dentro del estándar</p></div>
          <div class="card"><h3>MTBF</h3><p class="value">45 h</p><p class="status ok">Buena fiabilidad</p></div>
          <div class="card"><h3>Plan Preventivo</h3><p class="value">92%</p><p class="status ok">Cumplido</p></div>
        </div>
      `;
      break;
    case 'matriceria-dashboard':
      html = `
        <h2>Dashboard de Matricería</h2>
        <div class="cards-container">
          <div class="card"><h3>Órdenes Activas</h3><p class="value">5</p><p class="status ok">En ejecución</p></div>
          <div class="card"><h3>Moldes en Mantenimiento</h3><p class="value">2</p><p class="status warning">Intervenciones activas</p></div>
          <div class="card"><h3>Intervención Próxima</h3><p class="value">1</p><p class="status warning">Por cantidad</p></div>
        </div>
      `;
      break;
    case 'logistica-dashboard':
      html = `
        <h2>Dashboard de Logística e Inventarios</h2>
        <div class="cards-container">
          <div class="card"><h3>Materias Primas</h3><p class="value">320</p><p class="status ok">Stock OK</p></div>
          <div class="card"><h3>Alertas de Reposición</h3><p class="value">4</p><p class="status warning">Atención urgente</p></div>
          <div class="card"><h3>Órdenes en Proceso</h3><p class="value">6</p><p class="status info">Pendientes</p></div>
        </div>
      `;
      break;
    default:
      html = `<h2>${pagina.replace(/-/g, ' ').toUpperCase()}</h2><p>Contenido en construcción para esta sección.</p>`;
  }

  contenido.innerHTML = html;
  if (pagina === 'operaciones-dashboard') {
    setTimeout(configurarChecklist, 0);
  }
}

// Fin del script actualizado

document.addEventListener('DOMContentLoaded', mostrarLogin);

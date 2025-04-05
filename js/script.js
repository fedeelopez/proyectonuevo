function toggleMenu(id) {
  const menu = document.getElementById(id);
  menu.classList.toggle('hidden');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

let usuarioActivo = null;

const usuarios = [
  { documento: '1111', nombre: 'Carlos Pérez', area: 'operaciones' },
  { documento: '2222', nombre: 'Ana Torres', area: 'mantenimiento' },
  { documento: '3333', nombre: 'Mariana Ruiz', area: 'matriceria' },
  { documento: '4444', nombre: 'Luciano Gómez', area: 'logistica' },
];

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
    grupo.style.display = seccion === area ? 'block' : 'none';
  });
}

mostrarLogin();

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Reporte de Mantenimiento", 20, 20);
  doc.setFontSize(12);
  doc.text("Costos Totales: $38,500", 20, 40);
  doc.text("Mano de Obra: $22,000", 20, 50);
  doc.text("Materiales: $16,500", 20, 60);
  doc.text("Órdenes Completadas:", 20, 80);
  doc.text("- Correctiva: 28", 30, 90);
  doc.text("- Preventiva: 22", 30, 100);
  doc.text("- Predictiva: 14", 30, 110);
  doc.text("- Autónoma: 10", 30, 120);
  doc.save("reporte-mantenimiento.pdf");
}

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

      <h3>Checklist de Confirmación</h3>
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

function configurarValidacionFormulario() {
  const btn = document.getElementById('confirmarOrdenBtn');
  const nombreInput = document.getElementById('nombreOperario');
  const checks = document.querySelectorAll('.check-item');

  function validarFormulario() {
    const nombre = nombreInput.value.trim();
    const todosMarcados = Array.from(checks).every(cb => cb.checked);
    btn.disabled = !(nombre && todosMarcados);
    btn.classList.toggle('disabled', btn.disabled);
  }

  nombreInput.addEventListener('change', validarFormulario);
  checks.forEach(cb => cb.addEventListener('change', validarFormulario));
  validarFormulario();
}

function cargarPagina(pagina) {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('show');
  const contenido = document.getElementById('contenido');
  let html = '';

  if (pagina === 'operaciones-dashboard') {
    html = generarOrdenTrabajo();
    contenido.innerHTML = html;
    setTimeout(configurarValidacionFormulario, 0);

    const btn = document.getElementById('confirmarOrdenBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const nombre = document.getElementById('nombreOperario').value;
        const checkboxes = document.querySelectorAll('.check-item');
        const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);

        if (!nombre || !todosMarcados) return;

        btn.disabled = true;
        btn.innerText = `Orden Confirmada por ${nombre} ✅`;
        document.getElementById('nombreOperario').disabled = true;

        const contenedorAlertas = document.getElementById('contenedorAlertas');

        const alerta = document.createElement('div');
        alerta.classList.add('alerta-inicio');
        alerta.innerHTML = `
          <h3>¿Iniciar fabricación?</h3>
          <button id="btnInicioOK" class="btn alerta-ok">✅ OK</button>
          <button id="btnInicioCancel" class="btn alerta-cancel">❌ Cancelar</button>
        `;
        contenedorAlertas.prepend(alerta);

        alerta.querySelector('#btnInicioOK').addEventListener('click', () => {
          alerta.innerHTML = '<p class="ok">🚀 Fabricación iniciada correctamente.</p>';

          const nuevaAlerta = document.createElement('div');
          nuevaAlerta.classList.add('alerta-inicio');
          nuevaAlerta.innerHTML = `
            <h3>¿Preparar la máquina?</h3>
            <button id="btnPrepOK" class="btn alerta-ok">✅ OK</button>
            <button id="btnPrepCancel" class="btn alerta-cancel">❌ Cancelar</button>
          `;
          contenedorAlertas.prepend(nuevaAlerta);

          nuevaAlerta.querySelector('#btnPrepOK').addEventListener('click', () => {
            nuevaAlerta.innerHTML = '<p class="ok">🛠️ Preparación de máquina completada.</p>';

            const alertaLiberacion = document.createElement('div');
            alertaLiberacion.classList.add('alerta-inicio');
            alertaLiberacion.innerHTML = `
              <h3>¿Liberar producto?</h3>
              <button id="btnLibOK" class="btn alerta-ok">✅ OK</button>
              <button id="btnLibCancel" class="btn alerta-cancel">❌ Cancelar</button>
            `;
            contenedorAlertas.prepend(alertaLiberacion);

            alertaLiberacion.querySelector('#btnLibOK').addEventListener('click', () => {
              alertaLiberacion.innerHTML = '<p class="ok">📦 Producto liberado exitosamente.</p>';

              const detallePiezas = document.createElement('div');
              detallePiezas.innerHTML = `
                <h3>Detalle de Producción</h3>
                <label>Piezas OK: <input type="number" id="piezasOk" min="0" value="0"></label><br>
                <label>Piezas Scrap: <input type="number" id="piezasScrap" min="0" value="0"></label><br>
                <button id="btnFinalizarProduccion" class="btn" style="margin-top: 1rem;">Finalizar Producción</button>
                <div id="resultadoFinal" style="margin-top: 1rem;"></div>
              `;
              contenido.appendChild(detallePiezas);

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
            });

            alertaLiberacion.querySelector('#btnLibCancel').addEventListener('click', () => {
              alertaLiberacion.innerHTML = '<p class="cancelado">❌ Liberación cancelada.</p>';
            });
          });

          nuevaAlerta.querySelector('#btnPrepCancel').addEventListener('click', () => {
            nuevaAlerta.innerHTML = '<p class="cancelado">❌ Preparación cancelada.</p>';
          });
        });

        alerta.querySelector('#btnInicioCancel').addEventListener('click', () => {
          alerta.innerHTML = '<p class="cancelado">❌ Fabricación cancelada.</p>';
        });
      });
    }
  } else {
    html = `<h2>${pagina.replace(/-/g, ' ').toUpperCase()}</h2><p>Contenido en construcción para esta sección.</p>`;
    contenido.innerHTML = html;
  }
}

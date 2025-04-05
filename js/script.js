function toggleMenu(id) {
    const menu = document.getElementById(id);
    menu.classList.toggle('hidden');
  }
  
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
  }
  
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
          <li><label><input type="checkbox"> Confirmación de materia prima</label></li>
          <li><label><input type="checkbox"> Herramientas disponibles</label></li>
          <li><label><input type="checkbox"> Parámetros de máquina verificados</label></li>
          <li><label><input type="checkbox"> Seguridad validada</label></li>
        </ul>
  
        <div style="margin-top: 1rem;">
          <label for="nombreOperario"><strong>Nombre del Operario:</strong></label><br />
          <input type="text" id="nombreOperario" placeholder="Ingrese su nombre" class="input-operario" style="margin-bottom: 1rem; padding: 0.5rem; width: 100%; max-width: 300px;">
        </div>
        <button id="confirmarOrdenBtn" class="btn" style="margin-top: 0.5rem;">Confirmar Orden</button>
        <div id="alertaInicio" class="alerta-inicio" style="display:none;"></div>
      </div>
    `;
  }
  
  function cargarPagina(pagina) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('show');
    const contenido = document.getElementById('contenido');
    let html = '';
  
    switch (pagina) {
      case 'dashboard':
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
  
      case 'orders':
        html = `
          <h2>Órdenes de Mantenimiento</h2>
          <div class="cards-container">
            <div class="card"><h3>Correctivas</h3><p class="value">10</p><p class="status warning">En curso</p></div>
            <div class="card"><h3>Preventivas</h3><p class="value">6</p><p class="status ok">Planificadas</p></div>
            <div class="card"><h3>Predictivas</h3><p class="value">3</p><p class="status ok">Con sensores</p></div>
            <div class="card"><h3>Autónomas</h3><p class="value">5</p><p class="status ok">Realizadas por operadores</p></div>
          </div>
        `;
        break;
  
      case 'planning':
        html = `
          <h2>Planificación de Mantenimiento</h2>
          <div class="cards-container">
            <div class="card"><h3>Planes Activos</h3><p class="value">4</p><p class="status ok">En ejecución</p></div>
            <div class="card"><h3>Intervenciones Programadas</h3><p class="value">8</p><p class="status ok">Próximas</p></div>
            <div class="card"><h3>Equipos con Frecuencia</h3><p class="value">12</p><p class="status ok">Monitoreados</p></div>
          </div>
        `;
        break;
  
      case 'inventory':
        html = `
          <h2>Gestión de Repuestos Críticos</h2>
          <div class="cards-container">
            <div class="card"><h3>Repuestos Disponibles</h3><p class="value">120</p><p class="status ok">En stock</p></div>
            <div class="card"><h3>Repuestos Críticos</h3><p class="value">8</p><p class="status warning">Atención</p></div>
            <div class="card"><h3>En Pedido</h3><p class="value">5</p><p class="status info">En tránsito</p></div>
          </div>
        `;
        break;
  
      case 'indicators':
        html = `
          <h2>Indicadores de Mantenimiento</h2>
          <canvas id="graficoIndicadores" width="400" height="200"></canvas>
        `;
        break;
  
      case 'reports':
        html = `
          <h2>Informes y Análisis de Mantenimiento</h2>
          <div class="cards-container">
            <div class="card"><h3>Costos Totales</h3><p class="value">$38,500</p><p class="status warning">Este mes</p></div>
            <div class="card"><h3>Mano de Obra</h3><p class="value">$22,000</p><p class="status ok">Controlado</p></div>
            <div class="card"><h3>Materiales</h3><p class="value">$16,500</p><p class="status ok">Dentro de presupuesto</p></div>
          </div>
          <h3 style="margin-top:2rem;">Informe por Tipo de Orden</h3>
          <canvas id="graficoReportes" width="400" height="200"></canvas>
          <button onclick="generarPDF()" class="btn" style="margin-top: 1rem;">📄 Descargar Reporte PDF</button>
        `;
        break;
  
      case 'operaciones-dashboard':
        html = generarOrdenTrabajo();
        break;
  
      default:
        html = `<h2>${pagina.replace(/-/g, ' ').toUpperCase()}</h2><p>Contenido en construcción para esta sección.</p>`;
    }
  
    document.getElementById('contenido').innerHTML = html;
  
    if (pagina === 'operaciones-dashboard') {
      const btn = document.getElementById('confirmarOrdenBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          const nombre = document.getElementById('nombreOperario').value.trim();
          if (!nombre) {
            alert('Por favor ingrese su nombre antes de confirmar la orden.');
            return;
          }
          btn.disabled = true;
          btn.innerText = `Orden Confirmada por ${nombre} ✅`;
          document.getElementById('nombreOperario').disabled = true;
  
          const alerta = document.getElementById('alertaInicio');
          alerta.style.display = 'block';
          alerta.innerHTML = `
            <h3>¿Iniciar fabricación?</h3>
            <button id="btnInicioOK" class="btn alerta-ok">✅ OK</button>
            <button id="btnInicioCancel" class="btn alerta-cancel">❌ Cancelar</button>
          `;
  
          document.getElementById('btnInicioOK').addEventListener('click', () => {
            alerta.innerHTML = '<p class="ok">🚀 Fabricación iniciada correctamente.</p>';
            const nuevaAlerta = document.createElement('div');
            nuevaAlerta.classList.add('alerta-inicio');
            nuevaAlerta.innerHTML = `
              <h3>¿Preparar la máquina?</h3>
              <button id="btnPrepOK" class="btn alerta-ok">✅ OK</button>
              <button id="btnPrepCancel" class="btn alerta-cancel">❌ Cancelar</button>
            `;
            document.getElementById('contenido').appendChild(nuevaAlerta);
  
            nuevaAlerta.querySelector('#btnPrepOK').addEventListener('click', () => {
              nuevaAlerta.innerHTML = '<p class="ok">🛠️ Preparación de máquina completada.</p>';
              const alertaLiberacion = document.createElement('div');
              alertaLiberacion.classList.add('alerta-inicio');
              alertaLiberacion.innerHTML = `
                <h3>¿Liberar producto?</h3>
                <button id="btnLibOK" class="btn alerta-ok">✅ OK</button>
                <button id="btnLibCancel" class="btn alerta-cancel">❌ Cancelar</button>
              `;
              document.getElementById('contenido').appendChild(alertaLiberacion);
  
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
                document.getElementById('contenido').appendChild(detallePiezas);
  
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
  
          document.getElementById('btnInicioCancel').addEventListener('click', () => {
            alerta.innerHTML = '<p class="cancelado">❌ Fabricación cancelada.</p>';
          });
        });
      }
    }
  }
  
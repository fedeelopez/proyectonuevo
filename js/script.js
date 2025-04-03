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
  
      case 'repuestos':
        html = `
          <h2>Gestión de Repuestos Críticos</h2>
          <div class="cards-container">
            <div class="card"><h3>Repuestos Disponibles</h3><p class="value">120</p><p class="status ok">En stock</p></div>
            <div class="card"><h3>Repuestos Críticos</h3><p class="value">8</p><p class="status warning">Atención</p></div>
            <div class="card"><h3>En Pedido</h3><p class="value">5</p><p class="status info">En tránsito</p></div>
          </div>
        `;
        break;
  
      case 'reportes':
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

      contenido.innerHTML = html;

      setTimeout(() => {
        if (typeof Chart !== 'undefined') {
          const ctx = document.getElementById('graficoReportes').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Correctiva', 'Preventiva', 'Predictiva', 'Autónoma'],
              datasets: [{
                label: 'Órdenes completadas',
                data: [28, 22, 14, 10],
                backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24']
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: { beginAtZero: true }
              }
            }
          });
        }
      }, 300);
        break;
  
      case 'calendario':
        html = `
          <h2>Calendario de Mantenimiento</h2>
          <div id="calendar"></div>
        `;
        setTimeout(() => {
          if (typeof FullCalendar !== 'undefined') {
            const calendarEl = document.getElementById('calendar');
            const calendar = new FullCalendar.Calendar(calendarEl, {
              initialView: 'dayGridMonth',
              locale: 'es',
              height: 'auto',
              headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              },
              events: [
                { title: 'Mantenimiento Robot 3', start: '2025-04-05' },
                { title: 'Lubricación Prensa A', start: '2025-04-07' },
                { title: 'Revisión Célula B', start: '2025-04-10' },
                { title: 'TPM Línea 4', start: '2025-04-12' },
                { title: 'Chequeo Moldes', start: '2025-04-14' }
              ]
            });
            calendar.render();
          }
        }, 200);
        break;
  
      default:
        html = `
          <h2>${pagina.replace(/-/g, ' ').toUpperCase()}</h2>
          <p>Contenido en construcción para esta sección.</p>
        `;
    }
  
    contenido.innerHTML = html;
  }
  
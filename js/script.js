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
          <li><label><input type="checkbox"> Confirmación de materia prima</label></li>
          <li><label><input type="checkbox"> Herramientas disponibles</label></li>
          <li><label><input type="checkbox"> Parámetros de máquina verificados</label></li>
          <li><label><input type="checkbox"> Seguridad validada</label></li>
        </ul>
  
        <div style="margin-top: 1rem;">
          <label for="nombreOperario"><strong>Nombre del Operario:</strong></label><br />
          <select id="nombreOperario" class="input-operario" style="margin-bottom: 1rem; padding: 0.5rem; width: 100%; max-width: 300px;">
            <option value="">Seleccione un nombre</option>
            ${opciones}
          </select>
        </div>
        <button id="confirmarOrdenBtn" class="btn" style="margin-top: 0.5rem;">Confirmar Orden</button>
      </div>
      <div id="contenedorAlertas"></div>
    `;
  }
  
  // El resto del código no cambia
  
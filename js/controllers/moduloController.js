window.showModulos = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
        <div class="overlay" id="overlay"></div>
        <h2>Gestão de Módulos</h2>
        <p>Gerencie os Módulos do sistema.</p>
    `;

  setActiveButton("Relatórios");
};

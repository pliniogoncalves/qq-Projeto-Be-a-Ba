window.showLoja = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
        <div class="overlay" id="overlay"></div>
        <h2>Gestão de Lojas</h2>
        <p>Gerencie as lojas.</p>
    `;

  setActiveButton("Loja");
};

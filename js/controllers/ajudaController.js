window.showAjuda = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
        <div class="overlay" id="overlay"></div>
        <h2>Ajuda</h2>
        <p>Encontre respostas para suas dúvidas.</p>
    `;

  setActiveButton("Ajuda");
};

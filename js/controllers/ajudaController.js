window.showAjuda = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Ajuda</h2>
        <p>Encontre respostas para suas dúvidas.</p>
    `;

    setActiveButton('Ajuda');
}
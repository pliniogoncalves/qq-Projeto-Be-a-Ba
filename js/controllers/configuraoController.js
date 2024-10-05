window.showConfiguracoes = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Configurações</h2>
        <p>Altere as configurações do sistema.</p>
    `;

    setActiveButton('Configurações');
}
window.showPerfis = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Gestão de Perfis de Acesso</h2>
        <p>Gerencie os perfis de acesso dos usuários.</p>
    `;

    setActiveButton('Perfis de Acesso');
}
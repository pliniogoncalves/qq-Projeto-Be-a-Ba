function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        mainContent.classList.add('active');
    } else {
        mainContent.classList.remove('active');
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('active');
        document.getElementById('mainContent').classList.remove('active');
    }
});

function setActiveButton(activeSection) {
    const buttons = document.querySelectorAll('.nav-item .btn-custom');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const bottomButtons = document.querySelectorAll('.bottom-links .btn-custom, .bottom-links .btn-danger');
    bottomButtons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = [...buttons, ...bottomButtons].find(button => button.textContent.trim() === activeSection);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Função para exibir informações do usuário logado
function carregarInformacoesUsuario() {
    const userInfo = document.querySelector('.user-info');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado) {
        const userInitials = usuarioLogado.nome.split(' ')
            .map(name => name.substring(0, 2))  // Pega as duas primeiras letras de cada parte
            .join('');  // Junta as iniciais
        const userName = usuarioLogado.nome;

        userInfo.innerHTML = `
            <div class="user-avatar">
                <span class="user-initials">${userInitials}</span>
            </div>
            <div class="user-details">
                <p class="user-perfil"><strong>${usuarioLogado.perfil}</strong></p>
                <p class="user-name"><strong>${usuarioLogado.loja}</strong></p>
            </div>
        `;
    } else {
        // Se o usuário não está logado, redireciona para a página de login
        window.location.href = 'login.html';
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

// Carregar as informações do usuário assim que a página for carregada
window.onload = carregarInformacoesUsuario;


// Função para alternar a visibilidade da senha
document.getElementById('togglePassword').addEventListener('click', function() {
    const senha = document.getElementById('senha');
    const eyeIcon = document.getElementById('eyeIcon');

    if (senha.type === 'senha') {
        senha.type = 'text';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    } else {
        senha.type = 'senha';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
    }
});

// Função para verificar o login
function login() {
    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;

    // Verificar se matricula e senha estão preenchidos
    if (!matricula || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Obter usuários do Local Storage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar se o usuário existe
    const usuarioEncontrado = usuarios.find(user => user.matricula === matricula && user.senha === senha);

    if (usuarioEncontrado) {
        // Login bem-sucedido, armazenar usuário logado (simulando uma sessão)
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
        // Redirecionar para a página principal (dashboard, por exemplo)
        window.location.href = '../html/main.html';  // Alterar o caminho conforme sua estrutura
    } else {
        alert("Matrícula ou senha incorretos. Tente novamente.");
    }
}

// Função para mostrar a ajuda
function showAjuda() {
    alert("Entre em contato com o suporte para ajuda com o login.");
}

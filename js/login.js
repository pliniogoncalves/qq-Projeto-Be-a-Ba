import { Usuario } from "./models/Usuario.js";

Usuario.inicializarAdmin();

// Função para alternar a visibilidade da senha
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const senha = document.getElementById("senha");
    const eyeIcon = document.getElementById("eyeIcon");

    if (senha.type === "password") { 
      senha.type = "text";
      eyeIcon.classList.remove("bi-eye-slash");
      eyeIcon.classList.add("bi-eye");
    } else {
      senha.type = "password";
      eyeIcon.classList.remove("bi-eye");
      eyeIcon.classList.add("bi-eye-slash");
    }
  });


// Função para verificar o login
window.login = function () {
  const matricula = document.getElementById("matricula").value;
  const senha = document.getElementById("senha").value;

  // Verificar se matricula e senha estão preenchidos
  if (!matricula || !senha) {
    mostrarModal("Por favor, preencha todos os campos.");
    return;
  }

  // Obter usuários do Local Storage
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verificar se o usuário existe
  const usuarioEncontrado = usuarios.find(
    (user) => user.matricula === matricula && user.senha === senha
  );

  if (usuarioEncontrado) {
    // Login bem-sucedido, armazenar usuário logado (simulando uma sessão)
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    //mostrarModal(`Bem-vindo, ${usuarioEncontrado.nome}!`);
    // Redirecionar para a página principal (dashboard, por exemplo)
    window.location.href = "../html/main.html"; // Alterar o caminho conforme sua estrutura
  } else {
    mostrarModal("Matrícula ou senha incorretos.");
  }
};

// Função para mostrar a ajuda
window.showAjuda = function () {
  mostrarModal("Entre em contato com o suporte via Workplace para ajuda com o login.");
};

window.mostrarModal = function(mensagem) {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `<p>${mensagem}</p>`; // Define a mensagem que será exibida
  const modal = document.getElementById("detalhesModal");
  modal.style.display = "block"; // Exibe o modal
}

window.mostrarRecuperacaoModal = function() {
  const modal = document.getElementById("recuperacaoModal");
  modal.style.display = "block";
}

window.fecharModal = function(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const overlay = document.getElementById("overlay");

  // Alterna a classe active no sidebar
  sidebar.classList.toggle("active");

  // Se o sidebar estiver ativo
  if (sidebar.classList.contains("active")) {
    mainContent.classList.add("active");
    overlay.style.display = "block"; // Mostra o overlay
  } else {
    mainContent.classList.remove("active");
    overlay.style.display = "none"; // Esconde o overlay
  }
}

// Fechar o sidebar quando clicar fora dele
document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.querySelector(".hamburger");
  const overlay = document.getElementById("overlay");

  // Verifica se o clique foi fora do sidebar e do hamburger
  if (
    sidebar.classList.contains("active") &&
    !sidebar.contains(event.target) && // Se o clique não for no sidebar
    !hamburger.contains(event.target) // Se o clique não for no botão de hambúrguer
  ) {
    // Recolhe o sidebar e ajusta o conteúdo
    sidebar.classList.remove("active");
    mainContent.classList.remove("active");
    overlay.style.display = "none"; // Esconde o overlay
  }
});

// Função para fechar o sidebar ao clicar no botão "X"
function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const overlay = document.getElementById("overlay");

  sidebar.classList.remove("active");
  mainContent.classList.remove("active");
  overlay.style.display = "none"; // Esconde o overlay
}

function setActiveButton(activeSection) {
  const buttons = document.querySelectorAll(".nav-item .btn-custom");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  const bottomButtons = document.querySelectorAll(
    ".bottom-links .btn-custom, .bottom-links .btn-danger"
  );
  bottomButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const activeButton = [...buttons, ...bottomButtons].find(
    (button) => button.textContent.trim() === activeSection
  );
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// Função para exibir informações do usuário logado
function carregarInformacoesUsuario() {
  const userInfo = document.querySelector(".user-info");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLogado) {
    const userInitials = usuarioLogado.nome
      .split(" ")
      .map((name) => name.substring(0, 2)) // Pega as duas primeiras letras de cada parte
      .join(""); // Junta as iniciais
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
    window.location.href = "login.html";
  }
}

// Função de logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

// Carregar as informações do usuário assim que a página for carregada
window.onload = carregarInformacoesUsuario;

// Função para formatar data e hora
function formatarDataHora(dataString) {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Os meses começam do zero
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");

  const dataFormatada = `${dia}/${mes}/${ano}`;
  const horaFormatada = `${horas}:${minutos}`;

  return [dataFormatada, horaFormatada]; // Retorna um array com data e hora separadas
}

function mostrarAlerta() {
  alert('Você clicou no botão de alerta!');
}

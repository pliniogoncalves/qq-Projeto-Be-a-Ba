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
    const userLoja = usuarioLogado.loja; // Supondo que 'loja' seja uma string, não um objeto

    // Verifique se 'loja' é um objeto e obtenha a propriedade correta
    const lojaDisplayName = typeof userLoja === 'object' && userLoja !== null ? userLoja.nome : userLoja;

    userInfo.innerHTML = `
      <div class="user-avatar">
        <span class="user-initials">${userInitials}</span>
      </div>
      <div class="user-details">
        <p class="user-perfil"><strong>${usuarioLogado.perfil}</strong></p>
        <p class="user-name"><strong>${lojaDisplayName}</strong></p>
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

// Fechar o modal ao clicar fora do conteúdo
window.onclick = function(event) {
  const modal = document.getElementById("detalhesModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

window.mostrarModal = function(mensagem) {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `<p>${mensagem}</p>`; // Define a mensagem que será exibida
  const modal = document.getElementById("detalhesModal");
  modal.style.display = "block"; // Exibe o modal
}

let callbackConfirmarAcao; // Variável para armazenar a função de callback

window.mostrarConfirmacao = function(mensagem, callback) {
  const modalConfirmacaoBody = document.getElementById("modalConfirmacaoBody");
  modalConfirmacaoBody.innerHTML = `<p>${mensagem}</p>`;
  
  // Armazena a função de callback
  callbackConfirmarAcao = callback;

  const modalConfirmacao = document.getElementById("modalConfirmacao");
  modalConfirmacao.style.display = "block"; // Exibe o modal

  // Configura o botão de confirmação
  document.getElementById("btnConfirmarAcao").onclick = function() {
    if (callbackConfirmarAcao) {
      callbackConfirmarAcao(); // Executa a função de callback
    }
    fecharModal('modalConfirmacao'); // Fecha o modal
  };
};

// Função para fechar o modal
function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

// Array para armazenar o histórico de navegação
const historico = [];

// Função de voltar
window.voltar = function () {
  // Remove o último estado do histórico
  if (historico.length > 1) {
    historico.pop(); // Remove a tela atual
    const { funcao, args } = historico.pop(); // Obtém a tela anterior
    funcao(...args); // Chama a função da tela anterior
  } else {
    // Se não houver tela anterior, talvez redirecionar ou exibir uma mensagem
    alert("Você está na tela inicial.");
  }
};

//notificações//

let notificationCount = 0;
const notifications = []; // Array para armazenar notificações

function adicionarNotificacao(mensagem) {
  notificationCount++;
  notifications.push(mensagem); // Armazena a mensagem na lista de notificações
  atualizarBotaoNotificacao();
}

// Atualiza o estado do botão de notificações
function atualizarBotaoNotificacao() {
  const notificationButton = document.querySelector('.btn-alert-circle');
  const notificationCountEl = document.getElementById('notificationCount');
  
  if (notificationCount > 0) {
    notificationButton.classList.add('has-notifications');
    notificationButton.style.backgroundColor = '#851306'; // Botão vermelho com notificações
    notificationCountEl.style.display = 'inline';
    notificationCountEl.textContent = notificationCount;
  } else {
    notificationButton.classList.remove('has-notifications');
    notificationButton.style.backgroundColor = '#1f5d3d'; // Botão verde sem notificações
    notificationCountEl.style.display = 'none';
  }
}

// Mostra o modal de notificações com as mensagens
function mostrarNotificacao() {
  const modal = document.getElementById('modalNotificacao');
  const modalNotificacaoBody = document.getElementById('modalNotificacaoBody');
  
  modalNotificacaoBody.innerHTML = ''; // Limpa o conteúdo antes de adicionar

  if (notifications.length > 0) {
    notifications.forEach((notificacao) => {
      const p = document.createElement('p'); // Usar <p> para cada notificação
      p.textContent = notificacao; // Adiciona o texto da notificação
      modalNotificacaoBody.appendChild(p); // Insere no corpo do modal
    });
  } else {
    modalNotificacaoBody.innerHTML = '<p>Sem notificações</p>';
  }

  modal.style.display = 'flex'; // Exibe o modal
}

// Marca todas as notificações como lidas e fecha o modal
function marcarTodasLidas() {
  notificationCount = 0;
  notifications.length = 0; // Limpa as notificações armazenadas
  atualizarBotaoNotificacao();
  fecharModal('modalNotificacao'); // Fecha o modal após marcar como lidas
}

// Exemplo de adição de notificações para testes
adicionarNotificacao("Estoque baixo em loja X");
adicionarNotificacao("Usuário solicitou talão");
adicionarNotificacao("Novo login realizado");
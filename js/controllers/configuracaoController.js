// Importa o modelo Usuario
import { Usuario } from '../models/Usuario.js'

// Função auxiliar para obter o usuário autenticado
function getUsuarioAutenticado() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    mostrarModal("Usuário não autenticado. Por favor, faça login novamente.");
    return null;
  }
  return usuarioLogado;
}

// Função para exibir a página de configurações com o formulário de redefinição de senha
window.showConfiguracoes = function () {
  historico.push({ funcao: showConfiguracoes });

  const content = document.getElementById("mainContent");
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="w-100 text-center me-4 me-md-5">
        <h1>Configurações</h1>
        <p>Altere as configurações do sistema.</p>
      </div>
    </div>
    <div class="form-container">
      <form id="senhaForm">
        <div class="mb-3">
          <label for="senhaAtual" class="form-label">Senha Atual</label>
          <input type="password" class="form-control" id="senhaAtual" placeholder="Digite sua senha atual" required>
        </div>
        <div class="mb-3">
          <label for="novaSenha" class="form-label">Nova Senha</label>
          <input type="password" class="form-control" id="novaSenha" placeholder="Digite a nova senha" required>
        </div>
        <div class="mb-3">
          <label for="confirmarSenha" class="form-label">Confirmar Nova Senha</label>
          <input type="password" class="form-control" id="confirmarSenha" placeholder="Confirme a nova senha" required>
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-4 mb-2">
              <button type="button" class="btn btn-custom w-100" onclick="salvarNovaSenha()">
                <i class="fas fa-save"></i> Salvar Nova Senha
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
  setActiveButton("Configurações");
};

// Função para salvar a nova senha do usuário autenticado
window.salvarNovaSenha = function () {
  const usuario = getUsuarioAutenticado();
  if (!usuario) return;

  const senhaAtual = document.getElementById("senhaAtual").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (novaSenha !== confirmarSenha) {
    mostrarModal("As senhas não coincidem. Por favor, tente novamente.");
    return;
  }

  if (usuario.senha !== senhaAtual) {
    mostrarModal("Senha atual incorreta.");
    return;
  }

  usuario.senha = novaSenha;
  Usuario.usuarios = Usuario.usuarios.map(user => user.id === usuario.id ? usuario : user);
  Usuario.salvarNoLocalStorage();
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  mostrarModal("Senha atualizada com sucesso!");
  document.getElementById("senhaForm").reset();
};

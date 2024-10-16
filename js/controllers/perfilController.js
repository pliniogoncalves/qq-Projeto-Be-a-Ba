import { Perfil } from "../models/Perfil.js";

window.showPerfis = function () {
  const content = document.getElementById("mainContent");
  const perfis = Perfil.listarPerfis();

  let tableRows = "";

  perfis.forEach((perfil) => {
    tableRows += `
        <tr>
            <td>${perfil.nome}</td>
            <td>${perfil.permissoes.join(', ')}</td>
            <td>
                <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarPerfil(${perfil.id})"></i>
                <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirPerfil(${perfil.id})"></i>
            </td>
        </tr>
        `;
  });

  content.innerHTML = `
      <h1 class="text-center">Lista de Perfis de Acesso</h1>
      <p class="text-center">Veja a lista de perfis de acesso e suas permissões.</p>

      <div class="table-responsive">
          <table class="table table-striped">
              <thead>
                  <tr>
                      <th>Nome do Perfil</th>
                      <th>Permissões</th>
                      <th>Ações</th>
                  </tr>
              </thead>
              <tbody>
                  ${tableRows}
              </tbody>
          </table>
      </div>
      <div class="text-center mb-4">
          <button class="btn btn-custom" type="button" onclick="cadastrarPerfil()">Cadastrar Novo Perfil</button>
      </div>
  `;

  setActiveButton("Perfis de Acesso");
};

window.cadastrarPerfil = function () {
  const content = document.getElementById("mainContent");

  content.innerHTML = `
      <div class="form-container">
        <h1 class="h4 mb-4">Novo Perfil de Acesso</h1>
        <form id="perfilForm">
          <div class="mb-3">
            <label for="nomePerfil" class="form-label">Nome do Perfil</label>
            <input type="text" class="form-control" id="nomePerfil" placeholder="Digite o nome do perfil">
          </div>
          <div class="mb-3">
            <label class="form-label">Permissões</label>
            <div>
              <input type="checkbox" id="permCadastrarUsuario" value="cadastrar_usuario"> Cadastrar Usuário<br>
              <input type="checkbox" id="permExcluirUsuario" value="excluir_usuario"> Excluir Usuário<br>
              <input type="checkbox" id="permManutencaoPerfis" value="manutencao_perfis"> Manutenção de Perfis<br>
              <input type="checkbox" id="permConfigurarPermissoes" value="configurar_permissoes"> Configurar Permissões<br>
              <input type="checkbox" id="permAcessarRelatorios" value="acessar_relatorios"> Acessar Relatórios<br>
              <input type="checkbox" id="permGerenciarTalões" value="gerenciar_taloes"> Gerenciar Talões<br>
              <input type="checkbox" id="permVerEstoque" value="ver_estoque"> Ver Estoque<br>
              <input type="checkbox" id="permConsultarEnvio" value="consultar_envio"> Consultar Envio<br>
              <input type="checkbox" id="permConsultarRecebimento" value="consultar_recebimento"> Consultar Recebimento<br>
              <input type="checkbox" id="permRegistrarEntrega" value="registrar_entrega"> Registrar Entrega<br>
            </div>
          </div>
          <button type="button" class="btn btn-submit" onclick="submitCadastroPerfil()">Cadastrar Perfil</button>
        </form>
      </div>
  `;
};

window.submitCadastroPerfil = function () {
  const nome = document.getElementById("nomePerfil").value;
  const permissoes = [];

  if (document.getElementById("permCadastrarUsuario").checked) permissoes.push("cadastrar_usuario");
  if (document.getElementById("permExcluirUsuario").checked) permissoes.push("excluir_usuario");
  if (document.getElementById("permManutencaoPerfis").checked) permissoes.push("manutencao_perfis");
  if (document.getElementById("permConfigurarPermissoes").checked) permissoes.push("configurar_permissoes");
  if (document.getElementById("permAcessarRelatorios").checked) permissoes.push("acessar_relatorios");
  if (document.getElementById("permGerenciarTalões").checked) permissoes.push("gerenciar_taloes");
  if (document.getElementById("permVerEstoque").checked) permissoes.push("ver_estoque");
  if (document.getElementById("permConsultarEnvio").checked) permissoes.push("consultar_envio");
  if (document.getElementById("permConsultarRecebimento").checked) permissoes.push("consultar_recebimento");
  if (document.getElementById("permRegistrarEntrega").checked) permissoes.push("registrar_entrega");

  if (!nome || permissoes.length === 0) {
    alert("Preencha todos os campos e selecione pelo menos uma permissão.");
    return;
  }

  Perfil.criarPerfil(nome, permissoes);
  showPerfis();
};

window.editarPerfil = function (id) {
  const perfil = Perfil.perfis.find((p) => p.id === id);
  const content = document.getElementById("mainContent");

  content.innerHTML = `
      <div class="form-container">
        <h1 class="h4 mb-4">Editar Perfil de Acesso</h1>
        <form id="perfilForm">
          <div class="mb-3">
            <label for="nomePerfil" class="form-label">Nome do Perfil</label>
            <input type="text" class="form-control" id="nomePerfil" value="${perfil.nome}">
          </div>
          <div class="mb-3">
            <label class="form-label">Permissões</label>
            <div>
              <input type="checkbox" id="permCadastrarUsuario" value="cadastrar_usuario" ${perfil.permissoes.includes("cadastrar_usuario") ? "checked" : ""}> Cadastrar Usuário<br>
              <input type="checkbox" id="permExcluirUsuario" value="excluir_usuario" ${perfil.permissoes.includes("excluir_usuario") ? "checked" : ""}> Excluir Usuário<br>
              <input type="checkbox" id="permManutencaoPerfis" value="manutencao_perfis" ${perfil.permissoes.includes("manutencao_perfis") ? "checked" : ""}> Manutenção de Perfis<br>
              <input type="checkbox" id="permConfigurarPermissoes" value="configurar_permissoes" ${perfil.permissoes.includes("configurar_permissoes") ? "checked" : ""}> Configurar Permissões<br>
              <input type="checkbox" id="permAcessarRelatorios" value="acessar_relatorios" ${perfil.permissoes.includes("acessar_relatorios") ? "checked" : ""}> Acessar Relatórios<br>
              <input type="checkbox" id="permGerenciarTalões" value="gerenciar_taloes" ${perfil.permissoes.includes("gerenciar_taloes") ? "checked" : ""}> Gerenciar Talões<br>
              <input type="checkbox" id="permVerEstoque" value="ver_estoque" ${perfil.permissoes.includes("ver_estoque") ? "checked" : ""}> Ver Estoque<br>
              <input type="checkbox" id="permConsultarEnvio" value="consultar_envio" ${perfil.permissoes.includes("consultar_envio") ? "checked" : ""}> Consultar Envio<br>
              <input type="checkbox" id="permConsultarRecebimento" value="consultar_recebimento" ${perfil.permissoes.includes("consultar_recebimento") ? "checked" : ""}> Consultar Recebimento<br>
              <input type="checkbox" id="permRegistrarEntrega" value="registrar_entrega" ${perfil.permissoes.includes("registrar_entrega") ? "checked" : ""}> Registrar Entrega<br>
            </div>
          </div>
          <button type="button" class="btn btn-submit" onclick="submitEdicaoPerfil(${id})">Salvar Alterações</button>
        </form>
      </div>
  `;
};

window.submitEdicaoPerfil = function (id) {
  const nome = document.getElementById("nomePerfil").value;
  const permissoes = [];

  if (document.getElementById("permCadastrarUsuario").checked) permissoes.push("cadastrar_usuario");
  if (document.getElementById("permExcluirUsuario").checked) permissoes.push("excluir_usuario");
  if (document.getElementById("permManutencaoPerfis").checked) permissoes.push("manutencao_perfis");
  if (document.getElementById("permConfigurarPermissoes").checked) permissoes.push("configurar_permissoes");
  if (document.getElementById("permAcessarRelatorios").checked) permissoes.push("acessar_relatorios");
  if (document.getElementById("permGerenciarTalões").checked) permissoes.push("gerenciar_taloes");
  if (document.getElementById("permVerEstoque").checked) permissoes.push("ver_estoque");
  if (document.getElementById("permConsultarEnvio").checked) permissoes.push("consultar_envio");
  if (document.getElementById("permConsultarRecebimento").checked) permissoes.push("consultar_recebimento");
  if (document.getElementById("permRegistrarEntrega").checked) permissoes.push("registrar_entrega");

  if (!nome || permissoes.length === 0) {
    alert("Preencha todos os campos e selecione pelo menos uma permissão.");
    return;
  }

  Perfil.atualizarPerfil(id, nome, permissoes);
  showPerfis();
};

window.excluirPerfil = function (id) {
  if (confirm("Você tem certeza que deseja excluir este perfil?")) {
    Perfil.excluirPerfil(id);
    showPerfis();
  }
};

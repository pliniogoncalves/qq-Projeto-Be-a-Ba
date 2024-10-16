import { Perfil } from "../models/Perfil.js";

// Função para formatar o nome da permissão
function formatarPermissao(permissao) {
  return permissao
    .replace(/_/g, " ") // Substitui "_" por espaço
    .replace(/\b\w/g, (letra) => letra.toUpperCase()); // Capitaliza a primeira letra de cada palavra
}

// Função para gerar linhas da tabela
function gerarLinhas(perfis) {
  let tableRows = "";

  perfis.forEach((perfil) => {
    const permissoesAdministrativas = perfil.permissoes
      .filter(
        (perm) =>
          perm === "cadastrar_usuario" ||
          perm === "excluir_usuario" ||
          perm === "manutencao_perfis" ||
          perm === "configurar_permissoes"
      )
      .map(formatarPermissao);

    const permissoesOperacionais = perfil.permissoes
      .filter(
        (perm) =>
          perm !== "cadastrar_usuario" &&
          perm !== "excluir_usuario" &&
          perm !== "manutencao_perfis" &&
          perm !== "configurar_permissoes"
      )
      .map(formatarPermissao);

    tableRows += `
      <tr>
        <td>${perfil.nome}</td>
        <td>
          <strong>Administrativas:</strong><br>
          ${
            permissoesAdministrativas.length
              ? permissoesAdministrativas.join(", ")
              : "Nenhuma"
          }<br>
          <strong>Operacionais:</strong><br>
          ${
            permissoesOperacionais.length
              ? permissoesOperacionais.join(", ")
              : "Nenhuma"
          }
        </td>
        <td>
          <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarPerfil(${
            perfil.id
          })"></i>
          <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirPerfil(${
            perfil.id
          })"></i>
        </td>
      </tr>
    `;
  });

  return tableRows;
}

window.showPerfis = async function () {
  const content = document.getElementById("mainContent");
  const perfis = await Perfil.listarPerfis(); // Adicionado await para lidar com possível Promise

  let tableRows = gerarLinhas(perfis);

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Lista de Perfis de Acesso</h1>
    <p class="text-center">Veja a lista de perfis de acesso e suas permissões.</p>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12 mb-4">
          <div class="input-group">
            <input type="text" class="form-control" id="searchInput" placeholder="Procurar por perfil" oninput="buscarPerfis()">
            <div class="input-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nome do Perfil</th>
            <th>Permissões</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="tableBody">
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

// Função para filtrar os perfis com base na entrada do usuário
window.buscarPerfis = async function () {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const perfis = await Perfil.listarPerfis(); // Adicionado await
  const filteredPerfis = perfis.filter((perfil) =>
    perfil.nome.toLowerCase().includes(searchInput)
  );
  const tableBody = document.getElementById("tableBody");

  // Atualiza a tabela com os perfis filtrados
  tableBody.innerHTML = gerarLinhas(filteredPerfis);
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
          <label class="form-label">Permissões Administrativas</label>
          <div>
            <input type="checkbox" id="permAdminTotal" onclick="marcarTodas('admin')"> <strong>Marcar Todas</strong><br>
            <input type="checkbox" id="permCadastrarUsuario" value="cadastrar_usuario" class="admin"> Cadastrar Usuário<br>
            <input type="checkbox" id="permExcluirUsuario" value="excluir_usuario" class="admin"> Excluir Usuário<br>
            <input type="checkbox" id="permManutencaoPerfis" value="manutencao_perfis" class="admin"> Manutenção de Perfis<br>
            <input type="checkbox" id="permConfigurarPermissoes" value="configurar_permissoes" class="admin"> Configurar Permissões<br>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Permissões Operacionais</label>
          <div>
            <input type="checkbox" id="permOperacionalTotal" onclick="marcarTodas('operacional')"> <strong>Marcar Todas</strong><br>
            <input type="checkbox" id="permAcessarRelatorios" value="acessar_relatorios" class="operacional"> Acessar Relatórios<br>
            <input type="checkbox" id="permGerenciarTaloes" value="gerenciar_taloes" class="operacional"> Gerenciar Talões<br>
            <input type="checkbox" id="permVerEstoque" value="ver_estoque" class="operacional"> Ver Estoque<br>
            <input type="checkbox" id="permConsultarEnvio" value="consultar_envio" class="operacional"> Consultar Envio<br>
            <input type="checkbox" id="permConsultarRecebimento" value="consultar_recebimento" class="operacional"> Consultar Recebimento<br>
            <input type="checkbox" id="permRegistrarEntrega" value="registrar_entrega" class="operacional"> Registrar Entrega<br>
          </div>
        </div>

        <button type="button" class="btn btn-submit" onclick="submitCadastroPerfil()">Cadastrar Perfil</button>
      </form>
    </div>
  `;
};

// Função para marcar/desmarcar todas as permissões de uma categoria
window.marcarTodas = function (categoria) {
  const checkboxes = document.querySelectorAll(
    `#perfilForm input.${categoria}`
  );
  const marcarTodas = document.getElementById(
    `perm${categoria.charAt(0).toUpperCase() + categoria.slice(1)}Total`
  ).checked;

  checkboxes.forEach((checkbox) => {
    checkbox.checked = marcarTodas;
  });
};

window.submitCadastroPerfil = function () {
  const nome = document.getElementById("nomePerfil").value;
  const permissoes = [];

  const permissoesAdmin = [
    "CadastrarUsuario",
    "ExcluirUsuario",
    "ManutencaoPerfis",
    "ConfigurarPermissoes",
  ];
  const permissoesOperacionais = [
    "AcessarRelatorios",
    "GerenciarTaloes",
    "VerEstoque",
    "ConsultarEnvio",
    "ConsultarRecebimento",
    "RegistrarEntrega",
  ];

  permissoesAdmin.forEach((perm) => {
    const checkbox = document.getElementById(`perm${perm}`);
    if (checkbox && checkbox.checked) {
      permissoes.push(checkbox.value);
    }
  });

  permissoesOperacionais.forEach((perm) => {
    const checkbox = document.getElementById(`perm${perm}`);
    if (checkbox && checkbox.checked) {
      permissoes.push(checkbox.value);
    }
  });

  if (!nome || permissoes.length === 0) {
    alert("Preencha todos os campos e selecione pelo menos uma permissão.");
    return;
  }

  Perfil.criarPerfil(nome, permissoes);
  showPerfis();
};

window.editarPerfil = async function (id) {
  const perfil = await Perfil.obterPerfilPorId(id); // Método para obter um perfil específico
  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="form-container">
      <h1 class="h4 mb-4">Editar Perfil de Acesso</h1>
      <form id="perfilForm">
        <div class="mb-3">
          <label for="nomePerfil" class="form-label">Nome do Perfil</label>
          <input type="text" class="form-control" id="nomePerfil" value="${
            perfil.nome
          }">
        </div>

        <div class="mb-3">
          <label class="form-label">Permissões Administrativas</label>
          <div>
            <input type="checkbox" id="permAdminTotal" onclick="marcarTodas('admin')"> <strong>Marcar Todas</strong><br>
            <input type="checkbox" class="admin" id="permCadastrarUsuario" value="cadastrar_usuario" ${
              perfil.permissoes.includes("cadastrar_usuario") ? "checked" : ""
            }> Cadastrar Usuário<br>
            <input type="checkbox" class="admin" id="permExcluirUsuario" value="excluir_usuario" ${
              perfil.permissoes.includes("excluir_usuario") ? "checked" : ""
            }> Excluir Usuário<br>
            <input type="checkbox" class="admin" id="permManutencaoPerfis" value="manutencao_perfis" ${
              perfil.permissoes.includes("manutencao_perfis") ? "checked" : ""
            }> Manutenção de Perfis<br>
            <input type="checkbox" class="admin" id="permConfigurarPermissoes" value="configurar_permissoes" ${
              perfil.permissoes.includes("configurar_permissoes")
                ? "checked"
                : ""
            }> Configurar Permissões<br>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Permissões Operacionais</label>
          <div>
            <input type="checkbox" id="permOperacionalTotal" onclick="marcarTodas('operacional')"> <strong>Marcar Todas</strong><br>
            <input type="checkbox" class="operacional" id="permAcessarRelatorios" value="acessar_relatorios" ${
              perfil.permissoes.includes("acessar_relatorios") ? "checked" : ""
            }> Acessar Relatórios<br>
            <input type="checkbox" class="operacional" id="permGerenciarTaloes" value="gerenciar_taloes" ${
              perfil.permissoes.includes("gerenciar_taloes") ? "checked" : ""
            }> Gerenciar Talões<br>
            <input type="checkbox" class="operacional" id="permVerEstoque" value="ver_estoque" ${
              perfil.permissoes.includes("ver_estoque") ? "checked" : ""
            }> Ver Estoque<br>
            <input type="checkbox" class="operacional" id="permConsultarEnvio" value="consultar_envio" ${
              perfil.permissoes.includes("consultar_envio") ? "checked" : ""
            }> Consultar Envio<br>
            <input type="checkbox" class="operacional" id="permConsultarRecebimento" value="consultar_recebimento" ${
              perfil.permissoes.includes("consultar_recebimento")
                ? "checked"
                : ""
            }> Consultar Recebimento<br>
            <input type="checkbox" class="operacional" id="permRegistrarEntrega" value="registrar_entrega" ${
              perfil.permissoes.includes("registrar_entrega") ? "checked" : ""
            }> Registrar Entrega<br>
          </div>
        </div>

        <button type="button" class="btn btn-submit" onclick="submitEdicaoPerfil(${
          perfil.id
        })">Salvar Alterações</button>
      </form>
    </div>
  `;
};

window.submitEdicaoPerfil = function (id) {
  const nome = document.getElementById("nomePerfil").value;
  const permissoes = [];

  const permissoesAdmin = [
    "CadastrarUsuario",
    "ExcluirUsuario",
    "ManutencaoPerfis",
    "ConfigurarPermissoes",
  ];
  const permissoesOperacionais = [
    "AcessarRelatorios",
    "GerenciarTaloes",
    "VerEstoque",
    "ConsultarEnvio",
    "ConsultarRecebimento",
    "RegistrarEntrega",
  ];

  permissoesAdmin.forEach((perm) => {
    const checkbox = document.getElementById(`perm${perm}`);
    if (checkbox && checkbox.checked) {
      permissoes.push(checkbox.value);
    }
  });

  permissoesOperacionais.forEach((perm) => {
    const checkbox = document.getElementById(`perm${perm}`);
    if (checkbox && checkbox.checked) {
      permissoes.push(checkbox.value);
    }
  });

  if (!nome || permissoes.length === 0) {
    alert("Preencha todos os campos e selecione pelo menos uma permissão.");
    return;
  }

  Perfil.atualizarPerfil(id, nome, permissoes);
  showPerfis();
};

window.excluirPerfil = function (id) {
  const confirmacao = confirm("Tem certeza que deseja excluir este perfil?");
  if (confirmacao) {
    Perfil.excluirPerfil(id);
    showPerfis();
  }
};

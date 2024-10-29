import { Perfil } from "../models/Perfil.js";
import { Usuario } from "../models/Usuario.js";

// Função para formatar o nome da permissão
function formatarPermissao(permissao) {
  return permissao
    .replace(/_/g, " ") // Substitui "_" por espaço
    .replace(/\b\w/g, (letra) => letra.toUpperCase()); // Capitaliza a primeira letra de cada palavra
}

// Função para gerar linhas da tabela de perfis
function gerarLinhas(perfis) {
  return perfis
    .map(
      (perfil) => `
      <tr>
        <td>${perfil.nome}</td>
        <td>
          <strong>Administrativas:</strong><br>
          ${
            perfil.permissoes
              .filter(
                (perm) =>
                  perm === "cadastrar_usuario" ||
                  perm === "excluir_usuario" ||
                  perm === "manutencao_perfis" ||
                  perm === "configurar_permissoes"
              )
              .map(formatarPermissao)
              .join(", ") || "Nenhuma"
          }<br>
          <strong>Operacionais:</strong><br>
          ${
            perfil.permissoes
              .filter(
                (perm) =>
                  perm !== "cadastrar_usuario" &&
                  perm !== "excluir_usuario" &&
                  perm !== "manutencao_perfis" &&
                  perm !== "configurar_permissoes"
              )
              .map(formatarPermissao)
              .join(", ") || "Nenhuma"
          }
        </td>
        <td>
          <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarPerfil(${
            perfil.id
          })" data-bs-toggle="tooltip" title="Editar"></i>
          <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirPerfil(${
            perfil.id
          })" data-bs-toggle="tooltip" title="Excluir"></i>
        </td>
      </tr>`
    )
    .join("");
}

// Função para exibir os perfis de acesso
window.showPerfis = async function (paginaAtual = 1) {

  // Salva o estado atual para histórico de navegação
  historico.push({ funcao: showPerfis, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  const perfis = await Perfil.listarPerfis();

  // Definir quantidade de itens por página com base no tamanho da tela
  let itensPorPagina;
  if (window.innerWidth >= 1200) {
    itensPorPagina = 3; // Para telas grandes (desktops)
  } else if (window.innerWidth >= 768) {
    itensPorPagina = 2; // Para tablets e telas médias
  } else {
    itensPorPagina = 1; // Para telas pequenas (smartphones)
  }

  // Paginação
  const totalPaginas = Math.ceil(perfis.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const perfisPaginados = perfis.slice(inicio, inicio + itensPorPagina);

  let tableRows = perfisPaginados.length
    ? gerarLinhas(perfisPaginados)
    : `<tr><td colspan="3" class="text-center">Nenhum perfil encontrado.</td></tr>`;

  // Geração da paginação dentro da tabela com setas "Previous" e "Next"
  const paginacao = `
    <tr>
      <td colspan="3">
        <nav>
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" aria-label="Previous" onclick="showPerfis(${
                paginaAtual - 1
              })">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            ${Array.from(
              { length: totalPaginas },
              (_, i) => `
              <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
                <a class="page-link" href="#" onclick="showPerfis(${i + 1})">${
                i + 1
              }</a>
              </li>
            `
            ).join("")}
            <li class="page-item ${
              paginaAtual === totalPaginas ? "disabled" : ""
            }">
              <a class="page-link" href="#" aria-label="Next" onclick="showPerfis(${
                paginaAtual + 1
              })">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </td>
    </tr>
  `;

  // Inserindo o conteúdo na página com o novo layout
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center mb-4">Gestão de Perfis de Acesso</h1>
    <p class="text-center mb-4">Veja a lista de perfis e suas respectivas permissões.</p>

    <div class="container mb-4">
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

    <div class="table-responsive mb-4">
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
          ${paginacao} <!-- Adiciona paginação dentro da tabela -->
        </tbody>
      </table>
    </div>

    <div class="text-center mb-4">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-6 col-md-3 mb-2">
          <button class="btn btn-custom w-100" style="background-color: #269447; color: white;" type="button" onclick="cadastrarPerfil()">
            <i class="fas fa-plus-circle"></i> Cadastrar Novo Perfil
          </button>
        </div>
      </div>
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

  // Salva o estado atual da função no histórico, permitindo navegação reversa
  historico.push({ funcao: cadastrarPerfil });

  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-voltar" onclick="voltar()">
          <i class="bi bi-arrow-left"></i> Voltar
        </button>
        <div class="w-100 text-center">
          <h1>Cadastrar Novo Perfil</h1>
          <p class="mb-3">Preencha os dados abaixo para cadastrar um novo perfil.</p>
        </div>
      </div>
    <div class="form-container">
      <form id="perfilForm">
        <div class="mb-3">
          <label for="nomePerfil" class="form-label">Nome do Perfil</label>
          <input type="text" class="form-control" id="nomePerfil" placeholder="Digite o nome do perfil" required>
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

        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-3 mb-2">
              <button type="button" class="btn btn-custom w-100" style="background-color: #269447; color: white;" onclick="submitCadastroPerfil()">
                <i class="fas fa-plus-circle"></i> Cadastrar Perfil
              </button>
            </div>
          </div>
        </div>
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

  // Salva o estado atual da função no histórico, permitindo navegação reversa
  historico.push({ funcao: editarPerfil });

  const perfil = await Perfil.obterPerfilPorId(id); // Método para obter um perfil específico
  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center mb-4">Editar Perfil de Acesso</h1>
    <p class="text-center mb-4">Atualize as informações do perfil conforme necessário.</p>
    <div class="form-container">
      <form id="perfilForm">
        <div class="mb-3">
          <label for="nomePerfil" class="form-label">Nome do Perfil</label>
          <input type="text" class="form-control" id="nomePerfil" value="${
            perfil.nome
          }" required>
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

        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-3 mb-2">
              <button type="button" class="btn btn-custom w-100" style="background-color: #269447; color: white;" onclick="submitEdicaoPerfil(${
                perfil.id
              })">
                <i class="fas fa-save"></i> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
};

window.submitEdicaoPerfil = async function (id) {
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

  // Atualização do perfil deve ser assíncrona
  await Perfil.atualizarPerfil(id, nome, permissoes);
  await showPerfis(); // Aguarda o recarregamento da lista de perfis
};

window.excluirPerfil = function (id) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuario = Usuario.usuarios.find((user) => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    mostrarModal("Você não tem permissão para excluir este usuário.");
    return;
  }

  mostrarConfirmacao(
    "Tem certeza que deseja excluir este perfil?",
    function () {
      Perfil.excluirPerfil(id);
      showPerfis();
    }
  );
};

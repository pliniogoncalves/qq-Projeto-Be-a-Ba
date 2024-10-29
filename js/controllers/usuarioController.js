import { Usuario } from "../models/Usuario.js";
import { Perfil } from "../models/Perfil.js";
import { Loja } from "../models/Loja.js";

// Função para exibir a lista de usuários
window.showUsuarios = function (paginaAtual = 1) {

  // Armazena o estado atual no histórico
  historico.push({ funcao: showUsuarios, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  content.innerHTML = "";

  let tableRows = "";

  // Ajusta a quantidade de itens por página com base no tamanho da tela
  let itensPorPagina;
  if (window.innerWidth >= 1200) {
    itensPorPagina = 10; // Telas grandes (desktops)
  } else if (window.innerWidth >= 768) {
    itensPorPagina = 6; // Telas médias (tablets)
  } else {
    itensPorPagina = 5; // Telas pequenas (smartphones)
  }

  // Filtra usuários com base no perfil do usuário logado
  const usuariosFiltrados = usuarios.filter((user) => {
    if (usuarioLogado.perfil === "AdminRoot") {
      return true; // AdminRoot vê todos os usuários
    } else {
      return user.loja === usuarioLogado.loja; // Gerente e Caixa veem apenas os usuários da sua loja
    }
  });

  // Calcula o número total de páginas
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);

  // Paginação dos usuários
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(
    inicio,
    inicio + itensPorPagina
  );

  // Verifica se há usuários para exibir
  if (usuariosPaginados.length === 0) {
    tableRows = `
      <tr>
        <td colspan="4" class="text-center">Nenhum usuário encontrado.</td>
      </tr>`;
  } else {
    usuariosPaginados.forEach((user) => {
      if (user) {
        let lojaNome = user.loja ? user.loja.nome : "Nenhuma loja";
        if (user.perfil === "AdminRoot") {
          lojaNome = "Matriz"; // Nome da loja padrão para AdminRoot
        }

        const perfilDisplay =
          !user.perfil || user.perfil === "Nenhuma" ? "" : user.perfil;

        tableRows += `
          <tr>
              <td>${user.nome}</td>
              <td>${perfilDisplay}</td>
              <td>${lojaNome}</td> <!-- Exibindo o nome da loja -->
              <td>
                  <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarUsuario(${user.id})" data-bs-toggle="tooltip" title="Editar"></i>
                  <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirUsuario(${user.id})" data-bs-toggle="tooltip" title="Excluir"></i>
              </td>
          </tr>
        `;
      }
    });
  }

  // Geração da paginação dentro da tabela com setas "Previous" e "Next"
  const paginacao = `
    <tr>
      <td colspan="4">
        <nav>
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" aria-label="Previous" onclick="showUsuarios(${
                paginaAtual - 1
              })">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            ${Array.from(
              { length: totalPaginas },
              (_, i) => `
              <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
                <a class="page-link" href="#" onclick="showUsuarios(${
                  i + 1
                })">${i + 1}</a>
              </li>
            `
            ).join("")}
            <li class="page-item ${
              paginaAtual === totalPaginas ? "disabled" : ""
            }">
              <a class="page-link" href="#" aria-label="Next" onclick="showUsuarios(${
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

  // Renderização final do conteúdo HTML
  content.innerHTML = `
      <div class="overlay" id="overlay"></div>
      <h1 class="text-center mb-4">Gestão de Usuários</h1>
      <p class="text-center mb-4">Veja a lista de usuários cadastrados e suas respectivas situações.</p>

      <div class="container mb-4">
          <div class="row justify-content-center">
              <div class="col-md-8 col-sm-12 mb-4">
                  <div class="input-group">
                      <input type="text" class="form-control" id="userSearchInput" placeholder="Procurar por usuário" oninput="buscarUsuario()">
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
                  <th>Nome</th>
                  <th>Função</th>
                  <th>Loja</th>
                  <th>Ações</th>
              </tr>
          </thead>
          <tbody id="userTableBody">
              ${tableRows}
              ${paginacao} <!-- Adiciona paginação dentro da tabela -->
          </tbody>
          </table>
      </div>

      <div class="text-center mb-4">
          <div class="row justify-content-center">
              <div class="col-12 col-sm-6 col-md-3 mb-2">
                  <button class="btn btn-custom w-100"  type="button" onclick="cadastrarUsuario()">
                      <i class="fas fa-plus-circle"></i> Cadastrar Novo Usuário
                  </button>
              </div>
          </div>
      </div>
  `;

  setActiveButton("Usuários");
};

window.cadastrarUsuario = function () {

  // Armazena o estado atual no histórico
  historico.push({ funcao: cadastrarUsuario });


  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    alert("Você não tem permissão para cadastrar novos usuários.");
    return;
  }

  const content = document.getElementById("mainContent");
  content.innerHTML = "";

  // Recupera as lojas do LocalStorage
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  // Obter os perfis de acesso do LocalStorage
  const perfis = JSON.parse(localStorage.getItem("perfis")) || [];

  // Criar opções de função a partir dos perfis de acesso
  const opcoesFuncoes =
    perfis
      .map((perfil) => `<option value="${perfil.nome}">${perfil.nome}</option>`)
      .join("") + `<option value="Nenhum">Nenhum</option>`;

      content.innerHTML = `
      <div class="overlay" id="overlay"></div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-voltar" onclick="voltar()">
          <i class="bi bi-arrow-left"></i> Voltar
        </button>
        <div class="w-100 text-center">
          <h1>Cadastrar Novo Usuário</h1>
        </div>
      </div>
      <p class="text-center mb-4">Preencha as informações abaixo para cadastrar um novo usuário.</p>
      <div class="form-container">
        <form id="userForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome do Usuário</label>
            <input type="text" class="form-control" id="nome" placeholder="Digite o nome de usuário" required>
          </div>
          <div class="mb-3">
            <label for="matricula" class="form-label">Matrícula</label>
            <input type="number" class="form-control" id="matricula" placeholder="Digite a Matrícula" required>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" class="form-control" id="email" placeholder="Digite o e-mail" required>
          </div>
          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
            <input type="password" class="form-control" id="senha" placeholder="Digite a senha" required>
          </div>
          <div class="mb-3">
            <label for="funcao" class="form-label">Função</label>
            <select id="funcao" class="form-select" onchange="atualizarLojaCadastro()">
              ${opcoesFuncoes}
            </select>
          </div>
          <div class="mb-3" id="loja-container">
            <!-- O campo de loja será atualizado pela função 'atualizarLojaCadastro' -->
          </div>
          <div class="text-center mb-4">
            <div class="row justify-content-center">
              <div class="col-12 col-sm-6 col-md-3 mb-2">
                <button class="btn btn-custom w-100" type="button" onclick="submitCadastro()">
                  <i class="fas fa-user-plus"></i> Cadastrar Usuário
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
    

  // Inicializar o campo de loja com base no perfil inicial
  atualizarLojaCadastro();
};


window.atualizarLojaCadastro = function () {
  const perfilSelecionado = document.getElementById("funcao").value;
  const lojaContainer = document.getElementById("loja-container");
  const lojas = JSON.parse(localStorage.getItem("lojas")) || []; // Carregar lojas do localStorage

  if (perfilSelecionado === "AdminRoot") {
    // Se for AdminRoot, exibir "Matriz" e desabilitar a seleção
    lojaContainer.innerHTML = `
      <label for="loja" class="form-label">Loja</label>
      <input type="text" class="form-control" id="loja" value="Matriz" disabled>
    `;
  } else {
    // Se for Caixa ou Gerente, exibir a lista de lojas excluindo a "Matriz"
    const lojasSemMatriz = lojas.filter((loja) => loja.nome !== "Matriz");

    lojaContainer.innerHTML = `
      <label for="loja" class="form-label">Loja</label>
      <select id="loja" class="form-select">
        ${lojasSemMatriz
          .map((loja) => `<option value="${loja.nome}">${loja.nome}</option>`)
          .join("")}
      </select>
    `;
  }
};

window.submitCadastro = function () {
  const nome = document.getElementById("nome").value;
  const matricula = document.getElementById("matricula").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const perfil =
    document.getElementById("funcao").value !== "Nenhum"
      ? document.getElementById("funcao").value
      : null;

  // Carregar as lojas do LocalStorage
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  // Obter o nome da loja selecionada
  let lojaNome = document.getElementById("loja")
    ? document.getElementById("loja").value
    : "Matriz";

  // Encontrar o objeto da loja com base no nome
  const loja = lojas.find((l) => l.nome === lojaNome) || { nome: "Matriz" }; // Se não encontrar, assume "Matriz"

  if (!nome || !matricula || !email || !senha || !loja) {
    alert("Preencha todos os campos.");
    return;
  }

  // Criar o novo usuário
  Usuario.criarUsuario(nome, matricula, email, senha, perfil, loja);
  showUsuarios(); // Exibir a lista de usuários após o cadastro
};

window.editarUsuario = function (id) {

  // Armazena o estado atual no histórico
  historico.push({ funcao: editarUsuario });

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuario = Usuario.usuarios.find((user) => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    alert("Você não tem permissão para editar este usuário.");
    return;
  }

  const content = document.getElementById("mainContent");
  content.innerHTML = "";

  // Recupera as lojas do LocalStorage
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  // Obter a lista de perfis de acesso do LocalStorage
  const perfis = JSON.parse(localStorage.getItem("perfis")) || [];

  // Filtrar para exibir "AdminRoot" apenas se o usuário sendo editado for AdminRoot
  const perfisFiltrados =
    usuario.perfil === "AdminRoot"
      ? perfis // Se for AdminRoot, exibe todos os perfis
      : perfis.filter((perfil) => perfil.nome !== "AdminRoot"); // Caso contrário, exclui "AdminRoot"

  // Gerar opções de perfil a partir da lista de perfis filtrados
  const opcoesPerfis =
    perfisFiltrados
      .map(
        (perfil) => `
    <option value="${perfil.nome}" ${
          usuario.perfil === perfil.nome ? "selected" : ""
        }>${perfil.nome}</option>
  `
      )
      .join("") +
    `<option value="Nenhuma" ${
      usuario.perfil === "Nenhum" ? "selected" : ""
    }>Nenhum</option>`;

  // Gerar opções de lojas
  const lojaOptions = lojas
    .map(
      (loja) => `
    <option value="${loja.id}" ${
        usuario.loja && usuario.loja.id === loja.id ? "selected" : ""
      }>${loja.nome}</option>
  `
    )
    .join("");

    content.innerHTML = `
    <div class="form-container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <button class="btn btn-voltar" onclick="voltar()">
                <i class="bi bi-arrow-left"></i> Voltar
            </button>
            <div class="w-100 text-center">
              <h1>Editar Usuário</h1>
            </div>
        </div>
        <form id="userForm">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome do Usuário</label>
                <input type="text" class="form-control" id="nome" value="${usuario.nome}" required>
            </div>
            <div class="mb-3">
                <label for="matricula" class="form-label">Matrícula</label>
                <input type="text" class="form-control" id="matricula" value="${usuario.matricula}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" value="${usuario.email}" required>
            </div>
            <div class="mb-3">
                <label for="senha" class="form-label">Senha</label>
                <input type="password" class="form-control" id="senha" placeholder="Digite a nova senha (opcional)">
            </div>
            <div class="mb-3">
                <label for="funcao" class="form-label">Função</label>
                <select id="funcao" class="form-select" ${usuario.perfil === "AdminRoot" ? "disabled" : ""}>
                    ${opcoesPerfis}
                </select>
            </div>
            <div class="mb-3" id="loja-container">
                ${usuarioLogado.perfil === "Gerente" ? 
                    `<input type="text" class="form-control" id="loja" value="${usuarioLogado.loja}" disabled>` : 
                    usuario.perfil === "AdminRoot" ? 
                    `<input type="text" class="form-control" id="loja" value="Matriz" disabled>` : 
                    `<label for="loja" class="form-label">Loja</label>
                    <select id="loja" class="form-select">
                        ${lojaOptions}
                    </select>`
                }
            </div>
            <div class="text-center mb-4">
                <div class="row justify-content-center">
                    <div class="col-12 col-sm-6 col-md-3 mb-2">
                        <button type="button" class="btn btn-custom w-100" onclick="submitEdicao(${id})">
                            <i class="fas fa-save"></i> Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
`;

};

window.submitEdicao = function (id) {
  const nome = document.getElementById("nome").value;
  const matricula = document.getElementById("matricula").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value || null; // Permite senha vazia
  const perfil =
    document.getElementById("funcao").value !== "Nenhum"
      ? document.getElementById("funcao").value
      : null;
  const lojaId = document.getElementById("loja")
    ? document.getElementById("loja").value
    : null;

  // Verificar se todos os campos obrigatórios estão preenchidos
  if (!nome || !matricula || !email || (perfil !== "AdminRoot" && !lojaId)) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  // Encontrar a loja correspondente ao ID
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const loja = lojas.find((l) => l.id === parseInt(lojaId, 10));

  // Atualizar o usuário
  Usuario.atualizarUsuario(id, nome, matricula, email, senha, perfil, loja);
  showUsuarios(); // Exibir a lista de usuários após a edição
};

window.excluirUsuario = function (id) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuario = Usuario.usuarios.find((user) => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    mostrarModal("Você não tem permissão para excluir este usuário.");
    return;
  }

  mostrarConfirmacao("Você tem certeza que deseja excluir este usuário?", function() {
    Usuario.excluirUsuario(id);
    showUsuarios();
  });
};

window.buscarUsuario = function () {
  const searchInput = document
    .getElementById("userSearchInput")
    .value.toLowerCase();
  const tableBody = document.getElementById("userTableBody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const nomeUsuario = rows[i]
      .getElementsByTagName("td")[0]
      .textContent.toLowerCase();

    if (nomeUsuario.includes(searchInput)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
};

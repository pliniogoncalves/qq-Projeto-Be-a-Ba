import { Usuario } from "../models/Usuario.js";
import { Perfil } from "../models/Perfil.js";
import { Loja } from "../models/Loja.js";

window.showUsuarios = function () {
  const content = document.getElementById("mainContent");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let tableRows = "";

  // Filtra usuários com base no perfil do usuário logado
  const usuariosFiltrados = usuarios.filter((user) => {
    if (usuarioLogado.perfil === "AdminRoot") {
      return true; // AdminRoot vê todos os usuários
    } else {
      return user.loja === usuarioLogado.loja; // Gerente e Caixa veem apenas os usuários da sua loja
    }
  });

  usuariosFiltrados.forEach((user) => {
    if (user && user.perfil) {
      // Verifica se 'user' existe e se 'perfil' está definido
      let lojaNome = user.loja ? user.loja.nome : "Nenhuma loja"; // Acessando a propriedade correta

      // Se o usuário for AdminRoot, atribui um valor padrão para loja
      if (user.perfil === "AdminRoot") {
        lojaNome = "Matriz"; // Ou qualquer valor padrão que você deseje
      }

      tableRows += `
          <tr>
              <td>${user.nome}</td>
              <td>${user.perfil}</td>
              <td>${lojaNome}</td> <!-- Exibindo o nome da loja -->
              <td>
                  <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarUsuario(${user.id})"></i>
                  <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirUsuario(${user.id})"></i>
              </td>
          </tr>
          `;
    } else {
      console.error("Usuário inválido encontrado: ", user); // Log para depuração
    }
  });

  content.innerHTML = `
      <div class="overlay" id="overlay"></div>
      <h1 class="text-center">Lista de Usuários</h1>
      <p class="text-center">Veja a lista de usuários cadastrados e suas respectivas situações.</p>

      <div class="container">
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

      <div class="table-responsive">
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
          </tbody>
          </table>
      </div>
      <div class="text-center mb-4">
          <button class="btn btn-custom" type="button" onclick="cadastrarUsuario()">Cadastrar Novo Usuário</button>
      </div>
  `;

  setActiveButton("Usuários");
};


window.cadastrarUsuario = function () {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    alert("Você não tem permissão para cadastrar novos usuários.");
    return;
  }

  const isAdminRoot = usuarioLogado.perfil === "AdminRoot"; // Verifica se o logado é AdminRoot

  const content = document.getElementById("mainContent");

  // Recupera as lojas do LocalStorage
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  // Obter os perfis de acesso do LocalStorage
  const perfis = JSON.parse(localStorage.getItem("perfis")) || [];

  // Criar opções de função a partir dos perfis de acesso
  const opcoesFuncoes = perfis
    .map((perfil) => `<option value="${perfil.nome}">${perfil.nome}</option>`)
    .join("");

  content.innerHTML = `
      <div class="form-container">
        <h1 class="h4 mb-4">Novo Usuário</h1>
        <form id="userForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome do Usuário</label>
            <input type="text" class="form-control" id="nome" placeholder="Digite o nome de usuário">
          </div>
          <div class="mb-3">
            <label for="matricula" class="form-label">Matrícula</label>
            <input type="number" class="form-control" id="matricula" placeholder="Digite a Matrícula">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" class="form-control" id="email" placeholder="Digite o e-mail">
          </div>
          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
            <input type="password" class="form-control" id="senha" placeholder="Digite a senha">
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
          <button type="button" class="btn btn-submit" onclick="submitCadastro()">Cadastrar Usuário</button>
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
  } else if (perfilSelecionado === "Gerente" || perfilSelecionado === "Caixa") {
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
  } else {
    // Para outros perfis, pode exibir a loja associada ao usuário logado
    lojaContainer.innerHTML = `
      <label for="loja" class="form-label">Loja</label>
      <input type="text" class="form-control" id="loja" value="${usuarioLogado.loja}" disabled>
    `;
  }
};

window.submitCadastro = function () {
  const nome = document.getElementById("nome").value;
  const matricula = document.getElementById("matricula").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const perfil = document.getElementById("funcao").value;
  let loja = document.getElementById("loja")
    ? document.getElementById("loja").value
    : "Matriz";

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // Recupera o usuário logado

  // Verificar se todos os campos estão preenchidos
  if (!nome || !matricula || !email || !senha || !perfil || !loja) {
    alert("Preencha todos os campos.");
    return;
  }

  // Criar o novo usuário
  Usuario.criarUsuario(nome, matricula, email, senha, perfil, loja);
  showUsuarios(); // Exibir a lista de usuários após o cadastro
};

window.editarUsuario = function (id) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuario = Usuario.usuarios.find((user) => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    alert("Você não tem permissão para editar este usuário.");
    return;
  }

  const content = document.getElementById("mainContent");

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
  const opcoesPerfis = perfisFiltrados
    .map(
      (perfil) => `
    <option value="${perfil.nome}" ${
        usuario.perfil === perfil.nome ? "selected" : ""
      }>${perfil.nome}</option>
  `
    )
    .join("");

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
    <div class="form-container">
        <h1 class="h4 mb-4">Editar Usuário</h1>
        <form id="userForm">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome do Usuário</label>
                <input type="text" class="form-control" id="nome" value="${usuario.nome}">
            </div>
            <div class="mb-3">
                <label for="matricula" class="form-label">Matrícula</label>
                <input type="text" class="form-control" id="matricula" value="${usuario.matricula}">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" value="${usuario.email}">
            </div>
            <div class="mb-3">
                <label for="senha" class="form-label">Senha</label>
                <input type="password" class="form-control" id="senha" placeholder="Digite a nova senha (opcional)">
            </div>
            <div class="mb-3">
                <label for="funcao" class="form-label">Função</label>
                <select id="funcao" class="form-select" ${
                  usuario.perfil === "AdminRoot" ? "disabled" : ""
                }>
                    ${opcoesPerfis}
                </select>
            </div>
            <div class="mb-3" id="loja-container">
                ${
                  usuarioLogado.perfil === "Gerente"
                    ? `<input type="text" class="form-control" id="loja" value="${usuarioLogado.loja}" disabled>`
                    : usuario.perfil === "AdminRoot"
                    ? `<input type="text" class="form-control" id="loja" value="Matriz" disabled>`
                    : `
                  <label for="loja" class="form-label">Loja</label>
                  <select id="loja" class="form-select">
                      ${lojaOptions}
                  </select>
                  `
                }
            </div>
            <button type="button" class="btn btn-submit" onclick="submitEdicao(${id})">Salvar Alterações</button>
        </form>
    </div>
  `;
};

window.submitEdicao = function (id) {
  const nome = document.getElementById("nome").value;
  const matricula = document.getElementById("matricula").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value || null; // Permite senha vazia
  const perfil = document.getElementById("funcao").value;
  const lojaId = document.getElementById("loja") ? document.getElementById("loja").value : null;

  // Verificar se todos os campos obrigatórios estão preenchidos
  if (!nome || !matricula || !email || !perfil || (perfil !== "AdminRoot" && !lojaId)) {
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
    alert("Você não tem permissão para excluir este usuário.");
    return;
  }

  if (confirm("Você tem certeza que deseja excluir este usuário?")) {
    Usuario.excluirUsuario(id);
    showUsuarios();
  }
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

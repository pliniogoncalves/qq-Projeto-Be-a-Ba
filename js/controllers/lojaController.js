import { Loja } from "../models/Loja.js";

// Exibe a lista de lojas cadastradas
window.showLojas = function () {
  const content = document.getElementById("mainContent");
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  let tableRows = "";

  lojas.forEach((loja) => {
    if (loja) {
      tableRows += `
        <tr>
          <td>${loja.nome}</td>
          <td>${loja.numero}</td>
          <td>
            <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarLoja(${loja.id})"></i>
            <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirLoja(${loja.id})"></i>
          </td>
        </tr>
      `;
    }
  });

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Lista de Lojas</h1>
    <p class="text-center">Veja a lista de lojas cadastradas.</p>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12 mb-4">
          <div class="input-group">
            <input type="text" class="form-control" id="lojaSearchInput" placeholder="Procurar por loja" oninput="buscarLoja()">
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
            <th>Número</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="lojaTableBody">
          ${tableRows}
        </tbody>
      </table>
    </div>
    <div class="text-center mb-4">
      <button class="btn btn-custom" type="button" onclick="cadastrarLoja()">Cadastrar Nova Loja</button>
    </div>
  `;

  setActiveButton("Lojas");
};

// Função para filtrar lojas com base no nome
window.buscarLoja = function () {
  const searchInput = document.getElementById("lojaSearchInput").value.toLowerCase();
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const lojaTableBody = document.getElementById("lojaTableBody");

  let filteredRows = lojas
    .filter(loja => loja.nome.toLowerCase().includes(searchInput))
    .map(loja => `
      <tr>
        <td>${loja.nome}</td>
        <td>${loja.numero}</td>
        <td>
          <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarLoja(${loja.id})"></i>
          <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirLoja(${loja.id})"></i>
        </td>
      </tr>
    `)
    .join("");

  lojaTableBody.innerHTML = filteredRows;
};

// Função para cadastrar nova loja
window.cadastrarLoja = function () {
  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="form-container">
      <h1 class="h4 mb-4">Nova Loja</h1>
      <form id="lojaForm">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome da Loja</label>
          <input type="text" class="form-control" id="nome" placeholder="Digite o nome da loja">
        </div>
        <div class="mb-3">
          <label for="numero" class="form-label">Número</label>
          <input type="text" class="form-control" id="numero" placeholder="Digite o número da loja">
        </div>
        <button type="button" class="btn btn-submit" onclick="submitLojaCadastro()">Cadastrar Loja</button>
      </form>
    </div>
  `;
};

// Submissão do cadastro de loja
window.submitLojaCadastro = function () {
  const nome = document.getElementById("nome").value;
  const numero = document.getElementById("numero").value;

  if (!nome || !numero) {
    alert("Preencha todos os campos.");
    return;
  }

  Loja.criarLoja(nome, numero);
  showLojas();
};

// Função para editar loja
window.editarLoja = function (id) {
  const loja = Loja.lojas.find((l) => l.id === id);
  
  // Verifica se a loja foi encontrada
  if (!loja) {
    alert("Loja não encontrada.");
    return;
  }

  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="form-container">
      <h1 class="h4 mb-4">Editar Loja</h1>
      <form id="lojaForm">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome da Loja</label>
          <input type="text" class="form-control" id="nome" value="${loja.nome}">
        </div>
        <div class="mb-3">
          <label for="numero" class="form-label">Número</label>
          <input type="text" class="form-control" id="numero" value="${loja.numero}">
        </div>
        <button type="button" class="btn btn-submit" onclick="submitEdicaoLoja(${id})">Salvar Alterações</button>
      </form>
    </div>
  `;
};

// Submissão da edição da loja
window.submitEdicaoLoja = function (id) {
  const nome = document.getElementById("nome").value;
  const numero = document.getElementById("numero").value;

  if (!nome || !numero) {
    alert("Preencha todos os campos.");
    return;
  }

  // Atualiza a loja usando o método da classe Loja
  Loja.atualizarLoja(id, nome, numero);

  showLojas(); // Atualiza a lista de lojas após a edição
};


// Função para excluir loja
window.excluirLoja = function (id) {
  if (confirm("Você tem certeza que deseja excluir esta loja?")) {
    Loja.excluirLoja(id);
    showLojas();
  }
};

import { Loja } from "../models/Loja.js";

// Função para exibir a lista de lojas cadastradas
window.showLojas = function (paginaAtual = 1) {

  // Salva o estado atual para histórico de navegação
  historico.push({ funcao: showLojas, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  let tableRows = "";

  // Ajusta a quantidade de itens por página com base no tamanho da tela
  let itensPorPagina;
  if (window.innerWidth >= 1200) {
    itensPorPagina = 10; // Telas grandes (desktops)
  } else if (window.innerWidth >= 768) {
    itensPorPagina = 7;  // Telas médias (tablets)
  } else {
    itensPorPagina = 5;  // Telas pequenas (smartphones)
  }

  // Calcular o total de páginas
  const totalPaginas = Math.ceil(lojas.length / itensPorPagina);

  // Paginar lojas
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const lojasPaginadas = lojas.slice(inicio, inicio + itensPorPagina);

  // Verificar se há lojas para exibir
  if (lojasPaginadas.length === 0) {
    tableRows = `
      <tr>
        <td colspan="3" class="text-center">Nenhuma loja encontrada.</td>
      </tr>`;
  } else {
    lojasPaginadas.forEach((loja) => {
      if (loja) {
        tableRows += `
          <tr>
            <td>${loja.nome}</td>
            <td>${loja.numero}</td>
            <td class="loja">
              <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarLoja(${loja.id})"></i>
              <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirLoja(${loja.id})"></i>
            </td>
          </tr>
        `;
      }
    });
  }

  // Geração da paginação
  const paginacao = `
    <tr>
      <td colspan="3">
        <nav>
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" aria-label="Previous" onclick="showLojas(${
                paginaAtual - 1
              })">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            ${Array.from(
              { length: totalPaginas },
              (_, i) => `
              <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
                <a class="page-link" href="#" onclick="showLojas(${i + 1})">${i + 1}</a>
              </li>
            `
            ).join("")}
            <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
              <a class="page-link" href="#" aria-label="Next" onclick="showLojas(${
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

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center mb-4">Gestão de Lojas</h1>
    <p class="text-center mb-4">Veja a lista de lojas cadastradas.</p>

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

    <div class="table-responsive mb-4">
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
          ${paginacao}
        </tbody>
      </table>
    </div>
    
    <div class="text-center mb-4">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-6 col-md-3 mb-2">
          <button class="btn btn-custom w-100" style="background-color: #269447; color: white;" type="button" onclick="cadastrarLoja()">
            <i class="fas fa-plus-circle"></i> Cadastrar Nova Loja
          </button>
        </div>
      </div>
    </div>
  `;

  setActiveButton("Lojas");
};


// Função para filtrar lojas com base no nome
window.buscarLoja = function () {
  const searchInput = document
    .getElementById("lojaSearchInput")
    .value.toLowerCase();
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const lojaTableBody = document.getElementById("lojaTableBody");

  let filteredRows = lojas
    .filter((loja) => loja.nome.toLowerCase().includes(searchInput))
    .map(
      (loja) => `
      <tr>
        <td>${loja.nome}</td>
        <td>${loja.numero}</td>
        <td>
          <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarLoja(${loja.id})"></i>
          <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirLoja(${loja.id})"></i>
        </td>
      </tr>
    `
    )
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
          <input type="text" class="form-control" id="nome" placeholder="Digite o nome da loja" required>
        </div>
        <div class="mb-3">
          <label for="numero" class="form-label">Número</label>
          <input type="text" class="form-control" id="numero" placeholder="Digite o número da loja" required>
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-4 mb-2">
              <button type="button" class="btn btn-custom w-100" style="background-color: #269447; color: white;" onclick="submitLojaCadastro()">
                <i class="fas fa-plus-circle"></i> Cadastrar Loja
              </button>
            </div>
          </div>
        </div>
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
          <input type="text" class="form-control" id="nome" value="${loja.nome}" required>
        </div>
        <div class="mb-3">
          <label for="numero" class="form-label">Número</label>
          <input type="text" class="form-control" id="numero" value="${loja.numero}" required>
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-4 mb-2">
              <button type="button" class="btn btn-custom w-100" style="background-color: #269447; color: white;" onclick="submitEdicaoLoja(${id})">
                <i class="fas fa-save"></i> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
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

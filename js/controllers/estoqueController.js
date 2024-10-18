import { Estoque } from "../models/Estoque.js";
import { Loja } from "../models/Loja.js";


window.showEstoque = function (paginaAtual = 1, termoBusca = "") {
  const content = document.getElementById("mainContent");
  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  if (termoBusca) {
    lojas = lojas.filter((loja) =>
      loja.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }

  let tableRows = "";
  let itensPorPagina = window.innerWidth >= 1200 ? 10 : window.innerWidth >= 768 ? 7 : 5;

  const totalPaginas = Math.ceil(lojas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const lojasPaginadas = lojas.slice(inicio, inicio + itensPorPagina);

  if (lojasPaginadas.length === 0) {
    tableRows = `<tr><td colspan="5" class="text-center">Nenhuma loja encontrada.</td></tr>`;
  } else {
    lojasPaginadas.forEach((loja) => {
      const estoque = new Estoque(
        loja.id_estoque,
        loja.id_loja,
        loja.quantidade_recomendada,
        loja.quantidade_minima,
        loja.quantidade_atual
      );

      let statusEstoque = estoque.estoqueSuficiente()
        ? "Estoque Suficiente"
        : estoque.estoqueMedio()
        ? "Estoque Médio"
        : "Estoque Baixo";
      
      // Define a classe para o badge do status
      let badgeClass = "";
      if (estoque.estoqueBaixo()) {
        badgeClass = "badge badge-low";
      } else if (estoque.estoqueMedio()) {
        badgeClass = "badge badge-medium";
      } else {
        badgeClass = "badge badge-sufficient";
      }

      // Geração das linhas da tabela
      tableRows += `
        <tr>
          <td>${loja.nome}</td>
          <td>${estoque.quantidade_atual}</td>
          <td>${estoque.quantidade_minima}</td>
          <td><span class="${badgeClass}">${statusEstoque}</span></td>
          <td>
            <i class="fas fa-pencil-alt" style="cursor: pointer; margin-right: 10px;" onclick="registrarUsoTalhoes(${loja.id_loja})"></i>
            <i class="fas fa-edit" style="cursor: pointer;" onclick="editarEstoque(${loja.id_loja})"></i>
          </td>
        </tr>
      `;
    });
  }

  const paginacao = `
    <tr>
      <td colspan="5">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" onclick="showEstoque(${paginaAtual - 1}, '${termoBusca}')">&laquo;</a>
            </li>
            ${Array.from({ length: totalPaginas }, (_, i) => `
              <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
                <a class="page-link" href="#" onclick="showEstoque(${i + 1}, '${termoBusca}')">${i + 1}</a>
              </li>
            `).join("")}
            <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
              <a class="page-link" href="#" onclick="showEstoque(${paginaAtual + 1}, '${termoBusca}')">&raquo;</a>
            </li>
          </ul>
        </nav>
      </td>
    </tr>
  `;

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center mb-4">Controle de Estoque de Talões</h1>
    <p class="text-center mb-4">Veja o estoque de talões de cada loja.</p>

    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12 mb-4">
          <div class="input-group">
            <input type="text" class="form-control" id="userSearchInput" placeholder="Procurar por Loja" oninput="buscarLojaEstoque()">
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
            <th>Estoque Atual</th>
            <th>Estoque Mínimo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="estoqueTableBody">
          ${tableRows}
          ${paginacao}
        </tbody>
      </table>
    </div>
  `;

  setActiveButton("Estoque");
};


// Função para registrar o uso de talões
window.registrarUsoTalhoes = function (id_loja) {
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const loja = lojas.find((l) => l.id_loja === id_loja);

  if (!loja) {
    alert("Loja não encontrada.");
    return;
  }

  const quantidadeUsada = prompt("Informe a quantidade de talões utilizados:");
  if (
    quantidadeUsada === null ||
    isNaN(quantidadeUsada) ||
    quantidadeUsada <= 0
  ) {
    alert("Quantidade inválida.");
    return;
  }

  const estoque = new Estoque(
    loja.id_estoque,
    loja.id_loja,
    loja.quantidade_recomendada,
    loja.quantidade_minima,
    loja.quantidade_atual
  );

  const status = estoque.reduzirEstoque(parseInt(quantidadeUsada));
  loja.quantidade_atual = estoque.quantidade_atual;
  localStorage.setItem("lojas", JSON.stringify(lojas));

  alert(`Uso registrado! Status do estoque: ${status}`);
  showEstoque(); // Atualiza a lista após o registro do uso
};

// Função para buscar loja pelo nome no estoque
window.buscarLojaEstoque = function () {
  const searchInput = document
    .getElementById("userSearchInput")
    .value.toLowerCase();
  const tableBody = document.getElementById("estoqueTableBody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const nomeLoja = rows[i]
      .getElementsByTagName("td")[0]
      .textContent.toLowerCase();

    if (nomeLoja.includes(searchInput)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
};

// Função para editar o estoque de uma loja
window.editarEstoque = function (id_loja) {
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const loja = lojas.find((l) => l.id_loja === id_loja);

  // Verifica se a loja foi encontrada
  if (!loja) {
    alert("Loja não encontrada.");
    return;
  }

  const estoque = new Estoque(
    loja.id_estoque,
    loja.id_loja,
    loja.quantidade_recomendada,
    loja.quantidade_minima,
    loja.quantidade_atual
  );

  // Verifica o status do estoque (baixo, médio, adequado)
  let statusEstoque = "";
  if (estoque.estoqueBaixo()) {
    statusEstoque = "Estoque Baixo";
  } else if (estoque.estoqueMedio()) {
    statusEstoque = "Estoque Médio";
  } else {
    statusEstoque = "Estoque Suficiente";
  }

  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="form-container">
      <h1 class="h4 mb-4">Editar Estoque</h1>
      <form id="estoqueForm">
        <div class="mb-3">
          <label for="estoqueAtual" class="form-label">Estoque Atual</label>
          <input type="number" class="form-control" id="estoqueAtual" value="${estoque.quantidade_atual}" required>
        </div>
        <div class="mb-3">
          <label for="estoqueMinimo" class="form-label">Estoque Mínimo</label>
          <input type="number" class="form-control" id="estoqueMinimo" value="${estoque.quantidade_minima}" required>
        </div>
        <div class="mb-3">
          <label for="estoqueRecomendado" class="form-label">Estoque Recomendado</label>
          <input type="number" class="form-control" id="estoqueRecomendado" value="${estoque.quantidade_recomendada}" required>
        </div>
        <div class="mb-3">
          <label for="statusEstoque" class="form-label">Status do Estoque</label>
          <input type="text" class="form-control" id="statusEstoque" value="${statusEstoque}" readonly>
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-4 mb-2">
              <button type="button" class="btn btn-custom w-100" style="background-color: #269447; color: white;" onclick="submitEstoqueEdicao(parseInt(${id_loja}))">
                <i class="fas fa-save"></i> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
};

// Submissão da edição de estoque
window.submitEstoqueEdicao = function (id_loja) {
  const estoqueAtual = document.getElementById("estoqueAtual").value;
  const estoqueMinimo = document.getElementById("estoqueMinimo").value;
  const estoqueRecomendado =
    document.getElementById("estoqueRecomendado").value;

  if (!estoqueAtual || !estoqueMinimo || !estoqueRecomendado) {
    alert("Preencha todos os campos.");
    return;
  }

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  let loja = lojas.find((l) => l.id_loja === id_loja);

  if (loja) {
    loja.quantidade_atual = estoqueAtual;
    loja.quantidade_minima = estoqueMinimo;
    loja.quantidade_recomendada = estoqueRecomendado;
    localStorage.setItem("lojas", JSON.stringify(lojas));
  }

  showEstoque(); // Atualiza a lista de estoque após a edição
};

// Função para cadastrar loja com controle de estoque
window.cadastrarLojaComEstoque = function () {
  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="form-container">
      <h1 class="h4 mb-4">Nova Loja com Controle de Estoque</h1>
      <form id="lojaForm">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome da Loja</label>
          <input type="text" class="form-control" id="nome" placeholder="Digite o nome da loja" required>
        </div>
        <div class="mb-3">
          <label for="numero" class="form-label">Número da Loja</label>
          <input type="text" class="form-control" id="numero" placeholder="Digite o número da loja" required>
        </div>
        <div class="mb-3">
          <label for="estoqueAtual" class="form-label">Estoque Atual</label>
          <input type="number" class="form-control" id="estoqueAtual" placeholder="Quantidade atual em estoque" required>
        </div>
        <div class="mb-3">
          <label for="estoqueMinimo" class="form-label">Estoque Mínimo</label>
          <input type="number" class="form-control" id="estoqueMinimo" placeholder="Quantidade mínima necessária" required>
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-4 mb-2">
              <button type="button" class="btn btn-custom w-100" style="background-color: #269447; color: white;" onclick="submitLojaComEstoque()">
                <i class="fas fa-plus-circle"></i> Cadastrar Loja
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
};

// Submissão do cadastro de loja com controle de estoque
window.submitLojaComEstoque = function () {
  const nome = document.getElementById("nome").value;
  const numero = document.getElementById("numero").value;
  const estoqueAtual = document.getElementById("estoqueAtual").value;
  const estoqueMinimo = document.getElementById("estoqueMinimo").value;

  if (!nome || !numero || !estoqueAtual || !estoqueMinimo) {
    alert("Preencha todos os campos.");
    return;
  }

  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const id_loja = lojas.length > 0 ? lojas[lojas.length - 1].id_loja + 1 : 1;
  const id_estoque =
    lojas.length > 0 ? lojas[lojas.length - 1].id_estoque + 1 : 1;

  const novaLoja = new Loja(
    id_loja,
    nome,
    numero,
    estoqueAtual,
    estoqueMinimo,
    id_estoque
  );
  lojas.push(novaLoja);
  localStorage.setItem("lojas", JSON.stringify(lojas));

  showEstoque();
};

// Importação dos modelos
import { Estoque } from "../models/Estoque.js";
import { Loja } from "../models/Loja.js";

// Função para exibir o estoque
window.showEstoque = function (paginaAtual = 1, lojasFiltradas = null) {
  // Salva o estado atual para histórico de navegação
  historico.push({ funcao: showEstoque, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  const todasLojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";
  const lojas =
    lojasFiltradas ||
    todasLojas.filter(
      (loja) => isAdminRootMatriz || loja.nome === usuarioLogado.loja
    );

  const itensPorPagina = window.innerWidth >= 768 ? 3 : 1;
  const totalPaginas = Math.ceil(lojas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;

  // Configuração e exibição de conteúdo
  const lojasPaginadas = lojas.slice(inicio, inicio + itensPorPagina);

  let cardRows = "";
  let tableRows = "";

  // Geração dos cards ou linhas da tabela para cada loja
  if (lojasPaginadas.length === 0) {
    cardRows = `<div class="col-12 text-center"><p>Nenhuma loja encontrada.</p></div>`;
    tableRows = cardRows;
  } else {
    lojasPaginadas.forEach((loja) => {
      const estoque = new Estoque(
        loja.id_estoque,
        loja.id,
        loja.quantidadeRecomendada,
        loja.quantidadeMinima,
        loja.quantidadeAtual
      );
      const statusEstoque = loja.status || estoque.verificarEstoque();
      
      // Define a classe de borda e badge conforme o status do estoque
      let borderClass = "default-border";
      let badgeClass = "badge-default";

      if (statusEstoque === "Estoque baixo") {
        borderClass = "low-stock";
        badgeClass = "badge-low";
      }else if (statusEstoque === "Estoque médio") {
        borderClass = "medium-stock";
        badgeClass = "badge-medium";
      } else {
        borderClass = "sufficient-stock";
        badgeClass = "badge-sufficient";
      }

      // Geração do card com os detalhes do estoque, incluindo o número da loja
      cardRows += `
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="card h-100 shadow-sm ${borderClass}">
            <div class="card-body">
              <h5 class="card-title">${loja.nome} - Nº ${loja.numero}</h5>
              <p class="card-text">
                <strong>Estoque Atual:</strong> ${estoque.quantidade_atual}<br>
                <strong>Estoque Mínimo:</strong> ${estoque.quantidade_minima}<br>
                <strong>Estoque Recomendado:</strong> ${estoque.quantidade_recomendada}<br>
                <span class="badge ${badgeClass}">${statusEstoque}</span>
              </p>
            </div>
            <div class="card-footer text-center">
              <i class="fas fa-edit mx-2" onclick="editarEstoque(${loja.id})" title="Editar"></i>
            </div>
          </div>
        </div>`;

      // Geração da linha da tabela, incluindo o número da loja
      tableRows += `
        <tr>
          <td>${loja.nome}</td>
          <td>${loja.numero}</td>
          <td>${estoque.quantidade_atual}</td>
          <td>${estoque.quantidade_minima}</td>
          <td>${estoque.quantidade_recomendada}</td>
          <td><span class="badge ${badgeClass}">${statusEstoque}</span></td>
          <td class="text-center estoque">
            <i class="fas fa-edit mx-2" onclick="editarEstoque(${loja.id})" title="Editar"></i>
          </td>
        </tr>`;
    });
  }

  // Alterna entre cards e tabela com base no tamanho da tela
  const isLargeScreen = window.innerWidth >= 768;
  const displayRows = isLargeScreen
    ? `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Número</th>
           <th>Estoque Atual</th>
          <th>Estoque Mínimo</th>
          <th>Estoque Recomendado</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>`
    : `<div class="row">${cardRows}</div>`;

  // Paginação
  const paginacao = `
    <nav class="d-flex justify-content-center">
      <ul class="pagination custom-pagination">
        <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="showEstoque(${
            paginaAtual - 1
          })">&laquo;</a>
        </li>
        ${Array.from(
          { length: totalPaginas },
          (_, i) => `
          <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
            <a class="page-link" href="#" onclick="showEstoque(${i + 1})">${
            i + 1
          }</a>
          </li>`
        ).join("")}
        <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="showEstoque(${
            paginaAtual + 1
          })">&raquo;</a>
        </li>
      </ul>
    </nav>`;

  // Montagem do conteúdo HTML
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Gestão de Estoque</h1>
    <p class="text-center">Veja o estoque de talões de cada loja.</p>
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12 mb-4">
          <div class="input-group">
            <input type="text" class="form-control" id="estoqueSearchInput" placeholder="Procurar por loja" oninput="buscarEstoque()" value="${
              document.getElementById("estoqueSearchInput")?.value || ""
            }">
            <div class="input-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      ${displayRows}
    </div>
    ${paginacao}
    <div class="text-center mb-4">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-6 col-md-3 mb-2">
          <button class="btn btn-custom w-100" type="button" onclick="solicitarTalao()" aria-label="Solicitar Talão">
            <i class="fas fa-plus-circle"></i> Solicitar Talão
          </button>
        </div>
        <div class="col-12 col-sm-6 col-md-3 mb-2">
          <button class="btn btn-secondary w-100" type="button" onclick="exportarEstoqueCSV()" aria-label="Exportar Estoque">
            <i class="fas fa-file-export"></i> Exportar CSV
          </button>
        </div>
      </div>
    </div>`;

  // Define o botão ativo na interface
  setActiveButton("Estoque");
};


// Função para editar o estoque mínimo, recomendado e a frequência de alerta
window.editarEstoque = function (id_loja) {
  // Salva o estado atual da função no histórico, permitindo navegação reversa
  historico.push({ funcao: editarEstoque });

  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const loja = lojas.find((l) => l.id === id_loja);

  if (!loja) {
    mostrarModal("Loja não encontrada.");
    return;
  }

  const estoque = new Estoque(
    loja.id_estoque,
    loja.id,
    loja.quantidadeRecomendada,
    loja.quantidadeMinima,
    loja.quantidadeAtual || 0,
    loja.frequenciaAlerta
  );

  const content = document.getElementById("mainContent");

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-voltar" onclick="voltar()">
          <i class="bi bi-arrow-left"></i> Voltar
        </button>
        <div class="w-100 text-center me-4 me-md-5">
          <h1>Editar Estoque</h1>
         <p>Preencha as informações abaixo para Editar o Estoque.</p>
        </div>
      </div>
    <form id="estoqueForm">
      <div class="mb-3">
        <label for="nomeLoja" class="form-label">Nome da Loja</label>
        <input type="text" id="nomeLoja" class="form-control" value="${loja.nome}" readonly>
      </div>
      <div class="mb-3">
        <label for="quantidadeAtual" class="form-label">Estoque Atual</label>
        <input type="number" id="quantidadeAtual" class="form-control" value="${estoque.quantidade_atual}">
      </div>
      <div class="mb-3">
        <label for="quantidadeMinima" class="form-label">Estoque Mínimo</label>
        <input type="number" id="quantidadeMinima" class="form-control" value="${estoque.quantidade_minima}">
      </div>
      <div class="mb-3">
        <label for="quantidadeRecomendada" class="form-label">Estoque Recomendado</label>
        <input type="number" id="quantidadeRecomendada" class="form-control" value="${estoque.quantidade_recomendada}">
      </div>
      <div class="mb-3">
        <label for="frequenciaAlerta" class="form-label">Frequência de Alerta</label>
        <select id="frequenciaAlerta" class="form-control">
          <option value="semanal" ${estoque.frequenciaAlerta === "semanal" ? "selected" : ""}>Semanal</option>
          <option value="quinzenal" ${estoque.frequenciaAlerta === "quinzenal" ? "selected" : ""}>Quinzenal</option>
          <option value="mensal" ${estoque.frequenciaAlerta === "mensal" ? "selected" : ""}>Mensal</option>
        </select>
      </div>
      <div class="text-center mb-4">
        <button type="button" class="btn btn-custom" onclick="submitEstoqueEdicao(${id_loja})">Salvar Alterações</button>
      </div>
    </form>
  `;
};

// Salvar as mudanças feitas no estoque mínimo, recomendado e na frequência de alerta
window.submitEstoqueEdicao = function (id_loja) {
  const quantidadeMinima = parseInt(
    document.getElementById("quantidadeMinima").value,
    10
  );
  const quantidadeRecomendada = parseInt(
    document.getElementById("quantidadeRecomendada").value,
    10
  );
  const quantidadeAtual = parseInt(
    document.getElementById("quantidadeAtual").value,
    10
  ); 
  
  const frequenciaAlerta = document.getElementById("frequenciaAlerta").value;

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  let loja = lojas.find((l) => l.id === id_loja);

  if (loja) {
    loja.quantidadeMinima = quantidadeMinima;
    loja.quantidadeRecomendada = quantidadeRecomendada;
    loja.quantidadeAtual = quantidadeAtual;
    loja.frequenciaAlerta = frequenciaAlerta;

    // Instanciando o objeto Estoque para verificar o status
    const estoqueAtualizado = new Estoque(
      loja.id_estoque,
      loja.id,
      loja.quantidadeRecomendada,
      loja.quantidadeMinima,
      loja.quantidadeAtual,
      loja.frequenciaAlerta
    );

    // Atualiza o status do estoque
    loja.status = estoqueAtualizado.verificarEstoque();

    localStorage.setItem("lojas", JSON.stringify(lojas));
  }

  showEstoque();
};

// Função para sinalizar necessidade de talões
window.solicitarTalao = function () {
  // Salva o estado atual da função no histórico, permitindo navegação reversa
  historico.push({ funcao: solicitarTalao });

  const content = document.getElementById("mainContent");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Verificar se há lojas cadastradas
  const lojasCadastradas = Loja.listarLojas();

  // Lógica para campo da loja, dependendo do perfil do usuário logado
  let lojaInput = "";
  if (usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz") {
    if (lojasCadastradas.length > 0) {
      lojaInput = `
        <select class="form-select" id="lojaTalao" required>
          ${lojasCadastradas
            .map((loja) => `<option value="${loja.nome}">${loja.nome}</option>`)
            .join("")}
        </select>`;
    } else {
      lojaInput = `
        <select class="form-select" id="lojaTalao" disabled>
          <option value="">Nenhuma loja cadastrada</option>
        </select>`;
    }
  } else {
    lojaInput = `
      <input type="text" class="form-control" id="lojaTalao" value="${usuarioLogado.loja}" readonly required>`;
  }

  // Formulário simplificado apenas para selecionar a loja
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-voltar" onclick="voltar()">
          <i class="bi bi-arrow-left"></i> Voltar
        </button>
        <div class="w-100 text-center me-4 me-md-5">
          <h1>Solicitar Talão</h1>
          <p>Selecione a loja que precisa de reposição de talões.</p>
        </div>
      </div>
      <form id="talaoForm" onsubmit="sinalizarNecessidadeTalao(event)">
        <div class="mb-3">
          <label for="lojaTalao" class="form-label">Loja</label>
          ${lojaInput}
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-3 mb-2">
              <button type="submit" class="btn btn-custom w-100" ${
                lojasCadastradas.length === 0 ? "disabled" : ""
              }>
                <i class="fas fa-exclamation-circle"></i> Sinalizar Necessidade
              </button>
            </div>
          </div>
        </div>
        ${
          lojasCadastradas.length === 0
            ? '<p class="text-danger mt-2">Nenhuma loja cadastrada. Por favor, cadastre uma loja para continuar.</p>'
            : ""
        }
      </form>
    </div>
  `;
};

window.sinalizarNecessidadeTalao = function (event) {
  event.preventDefault();

  const lojaNome = document.getElementById("lojaTalao").value; // Obtém o nome da loja selecionada

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  let loja = lojas.find((l) => l.nome === lojaNome);

  if (loja) {
    if (loja.status !== "Estoque baixo") {
      loja.status = "Estoque baixo";
      loja.quantidadeAtual = 0
      mostrarModal(
        `A loja ${lojaNome} foi sinalizada como "necessitando de talões".`
      );
    } else {
      mostrarModal(
        `A loja ${lojaNome} já está sinalizada como "necessitando de talões".`
      );
    }

    localStorage.setItem("lojas", JSON.stringify(lojas));
    showEstoque();
  } else {
    mostrarModal("Erro: Loja não encontrada.");
  }
};

// Função para exportar todos os dados de estoque como um arquivo CSV
window.exportarEstoqueCSV = function () {
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  // Define cabeçalhos do CSV
  let csvContent = "Nome da Loja,Estoque Mínimo,Estoque Recomendado,Status\n";

  // Adiciona dados de cada loja
  lojas.forEach((loja) => {
    const estoque = new Estoque(
      loja.id_estoque,
      loja.id,
      loja.quantidadeRecomendada,
      loja.quantidadeMinima
    );

    // Verifica o status do estoque
    const statusEstoque = loja.status || estoque.verificarEstoque();

    csvContent += `${loja.nome},${estoque.quantidade_minima},${estoque.quantidade_recomendada},${statusEstoque}\n`;
  });

  // Cria o arquivo CSV e faz download
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "estoque.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Função para buscar lojas no estoque
window.buscarEstoque = function () {
  const searchInputElement = document.getElementById("estoqueSearchInput");
  if (!searchInputElement) return; // Sai da função se o elemento não existe

  const searchInput = searchInputElement.value.toLowerCase();
  const todasLojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";

  const lojasFiltradas = todasLojas.filter(
    (loja) =>
      (isAdminRootMatriz || loja.nome === usuarioLogado.loja) &&
      loja.nome.toLowerCase().includes(searchInput)
  );

  // Exibe os resultados filtrados ou a lista completa conforme o input
  showEstoque(1, searchInput ? lojasFiltradas : null);
};

window.addEventListener("resize", function () {
  // Verifique se o elemento do input de busca específico para estoque está presente
  if (document.getElementById("estoqueSearchInput")) {
    buscarEstoque();
  }
});

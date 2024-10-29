// Função para exibir a lista de relatórios disponíveis com paginação e opções de download em CSV
window.showRelatorios = function (paginaAtual = 1) {

  // Salva o estado atual para histórico de navegação
  historico.push({ funcao: showRelatorios, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  const relatorios = [
    { nome: "Relatório de Usuários Cadastrados", visualizar: "showRelatorioUsuarios", download: "exportarUsuariosCSV" },
    { nome: "Relatório de Perfis de Usuários", visualizar: "showRelatorioPerfis", download: "exportarPerfisCSV" },
    { nome: "Relatório de Manutenção e Recebimento de Talões", visualizar: "showRelatorioTaloes", download: "exportarTaloesCSV" },
    { nome: "Relatório de Gestão de Estoque", visualizar: "showRelatorioEstoque", download: "exportarEstoqueCSV" }
  ];

  // Configuração de paginação
  let itensPorPagina;
  if (window.innerWidth >= 1200) {
    itensPorPagina = 10;
  } else if (window.innerWidth >= 768) {
    itensPorPagina = 7;
  } else {
    itensPorPagina = 5;
  }

  const totalPaginas = Math.ceil(relatorios.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const relatoriosPaginados = relatorios.slice(inicio, inicio + itensPorPagina);

  let tableRows = "";

  // Verificar se há relatórios para exibir
  if (relatoriosPaginados.length === 0) {
    tableRows = `
      <tr>
        <td colspan="3" class="text-center">Nenhum relatório encontrado.</td>
      </tr>`;
  } else {
    relatoriosPaginados.forEach((relatorio) => {
      tableRows += `
        <tr class="modulo">
          <td>${relatorio.nome}</td>
          <td class="text-center">
            <i class="fas fa-eye mx-2" onclick="${relatorio.visualizar}()" data-bs-toggle="tooltip" title="Visualizar"></i>
          </td>
          <td class="text-center">
            <i class="fas fa-file-export mx-2" onclick="${relatorio.download}()" data-bs-toggle="tooltip" title="Baixar CSV"></i>
          </td>
        </tr>
      `;
    });
  }

  // Geração da paginação
  const paginacao = `
    <tr>
      <td colspan="3">
        <nav>
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" aria-label="Previous" onclick="showRelatorios(${paginaAtual - 1})">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            ${Array.from(
              { length: totalPaginas },
              (_, i) => `
              <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
                <a class="page-link" href="#" onclick="showRelatorios(${i + 1})">${i + 1}</a>
              </li>
            `
            ).join("")}
            <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
              <a class="page-link" href="#" aria-label="Next" onclick="showRelatorios(${paginaAtual + 1})">
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
    <h1 class="text-center">Relatórios Disponíveis</h1>
    <p class="text-center">Escolha um relatório para visualizar ou fazer o download em CSV.</p>

    <div class="table-responsive mb-4">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nome do Relatório</th>
            <th class="text-center">Visualizar</th>
            <th class="text-center">Download CSV</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          ${paginacao}
        </tbody>
      </table>
    </div>
  `;

  setActiveButton("Relatórios");
};


// Funções para chamar as funções já implementadas em cada módulo de relatório
window.showRelatorioUsuarios = function () {
  showUsuarios();
};

window.usuariosCSV = function () {
  exportarUsuariosCSV();
};

window.showRelatorioPerfis = function () {
  showPerfis();
};

window.perfisCSV = function () {
  exportarPerfisCSV();
};

window.showRelatorioTaloes = function () {
  showTaloes();
};

window.taloesCSV = function () {
  exportarTodosTaloes();
};

window.showRelatorioEstoque = function () {
  showEstoque();
};

window.estoqueCSV = function () {
  exportarEstoqueCSV();
};

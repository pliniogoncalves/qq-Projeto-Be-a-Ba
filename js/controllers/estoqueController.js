// Importação dos modelos
import { Estoque } from "../models/Estoque.js";
import { Loja } from "../models/Loja.js";

// Função para exibir o estoque
window.showEstoque = function (paginaAtual = 1, termoBusca = "") {
  // Salva o estado atual para histórico de navegação
  historico.push({ funcao: showEstoque, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  // Ajusta a quantidade de itens por página com base no tamanho da tela
  const itensPorPagina = window.innerWidth >= 1200 ? 10 : window.innerWidth >= 768 ? 7 : 5;
  const totalPaginas = Math.ceil(lojas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const lojasPaginadas = lojas.slice(inicio, inicio + itensPorPagina);

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Gestão de Estoque</h1>
    <p class="text-center">Veja o estoque de talões de cada loja.</p>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12 mb-4">
          <div class="input-group">
            <input type="text" id="estoqueSearchInput" placeholder="Buscar loja..." class="form-control" oninput="buscarEstoque()" />
            <div class="input-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Verifica se há lojas paginadas e exibe conforme o tamanho da tela
  if (lojasPaginadas.length === 0) {
    content.innerHTML += `<div class="text-center">Nenhuma loja encontrada.</div>`;
  } else {
    if (window.innerWidth < 768) { // Exibe como cartões em telas pequenas
      const searchInput = termoBusca.toLowerCase();
      let cardRows = lojasPaginadas.filter(loja => loja.nome.toLowerCase().includes(searchInput)).map((loja) => {
        const estoque = new Estoque(
          loja.id_estoque,
          loja.id,
          loja.quantidadeRecomendada,
          loja.quantidadeMinima
        );
        const statusEstoque = loja.status || estoque.verificarEstoque();
        const badgeClass = statusEstoque === "Estoque baixo" ? "badge badge-low" : "badge badge-sufficient";
        const borderClass = statusEstoque === "Estoque baixo" ? "border-danger" : "border-success"; // Mudança na borda

        return `
          <div class="card mb-3 ${borderClass}">
            <div class="card-body">
              <h5 class="card-title">${loja.nome}</h5>
              <p class="card-text"><strong>Estoque Mínimo:</strong> ${estoque.quantidade_minima}</p>
              <p class="card-text"><strong>Estoque Recomendado:</strong> ${estoque.quantidade_recomendada}</p>
              <p class="card-text"><span class="${badgeClass}">${statusEstoque}</span></p>
              <div class="card-footer text-center">
                <i class="fas fa-edit mx-2" onclick="editarEstoque(${loja.id})" data-bs-toggle="tooltip" title="Editar"></i>
              </div>
            </div>
          </div>
        `;
      }).join("");
      content.innerHTML += cardRows || `<div class="text-center">Nenhuma loja encontrada com esse critério.</div>`;
    } else { // Exibe como tabela em telas grandes
      let tableRows = lojasPaginadas.map((loja) => {
        const estoque = new Estoque(
          loja.id_estoque,
          loja.id,
          loja.quantidadeRecomendada,
          loja.quantidadeMinima
        );
        const statusEstoque = loja.status || estoque.verificarEstoque();
        const badgeClass = statusEstoque === "Estoque baixo" ? "badge badge-low" : "badge badge-sufficient";
        
        return `
          <tr>
            <td>${loja.nome}</td>
            <td>${estoque.quantidade_minima}</td>
            <td>${estoque.quantidade_recomendada}</td>
            <td><span class="${badgeClass}">${statusEstoque}</span></td>
            <td class="estoque">
              <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarEstoque(${loja.id})"></i>
            </td>
          </tr>
        `;
      }).join("");
      
      const paginacao = `
        <tr>
          <td colspan="5">
            <nav>
              <ul class="pagination justify-content-center custom-pagination">
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

      content.innerHTML += `
        <div class="table-responsive mb-4">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Estoque Mínimo</th>
                <th>Estoque Recomendado</th>
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
    }
    
    content.innerHTML += `
      <div class="text-center mb-4">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-6 col-md-3 mb-2">
            <button class="btn btn-custom w-100" type="button" onclick="solicitarTalao()">
              <i class="fas fa-plus-circle"></i> Solicitar Talão
            </button>
          </div>
          <div class="col-12 col-sm-6 col-md-3 mb-2">
            <button class="btn btn-secondary w-100" type="button" onclick="exportarEstoqueCSV()">
              <i class="fas fa-file-export"></i> Exportar CSV
            </button>
          </div>    
        </div>
      </div>
    `;
  }

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
          <option value="semanal" ${estoque.frequenciaAlerta === 'semanal' ? 'selected' : ''}>Semanal</option>
          <option value="quinzenal" ${estoque.frequenciaAlerta === 'quinzenal' ? 'selected' : ''}>Quinzenal</option>
          <option value="mensal" ${estoque.frequenciaAlerta === 'mensal' ? 'selected' : ''}>Mensal</option>
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
  const quantidadeMinima = parseInt(document.getElementById("quantidadeMinima").value, 10);
  const quantidadeRecomendada = parseInt(document.getElementById("quantidadeRecomendada").value, 10);
  const frequenciaAlerta = document.getElementById("frequenciaAlerta").value;

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  let loja = lojas.find((l) => l.id === id_loja);

  if (loja) {
    loja.quantidadeMinima = quantidadeMinima;
    loja.quantidadeRecomendada = quantidadeRecomendada;
    loja.frequenciaAlerta = frequenciaAlerta;

    // Atualiza o status do estoque com base nas novas quantidades
    if (quantidadeRecomendada > quantidadeMinima) {
      loja.status = "Estoque baixo";
    } else {
      loja.status = "Estoque adequado";
    }

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
      mostrarModal(`A loja ${lojaNome} foi sinalizada como "necessitando de talões".`);
    } else {
      mostrarModal(`A loja ${lojaNome} já está sinalizada como "necessitando de talões".`);
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
  lojas.forEach(loja => {
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
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'estoque.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Função para buscar lojas no estoque
window.buscarEstoque = function () {
  const searchInput = document.getElementById("estoqueSearchInput").value.toLowerCase();
  const todasLojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Filtra as lojas
  const lojasFiltradas = todasLojas.filter((loja) => {
    const isAdminRootMatriz = usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";
    return (isAdminRootMatriz || loja.nome === usuarioLogado.loja) &&
           loja.nome.toLowerCase().includes(searchInput);
  });

  // Atualiza a tabela de lojas no estoque
  const lojaTableBody = document.getElementById("estoqueTableBody");
  const lojaCardsContainer = document.getElementById("estoqueCardsContainer"); // Adicione um container para os cards

  // Gera as linhas da tabela com as lojas filtradas
  let filteredRows = lojasFiltradas.map((loja) => {
    const estoque = new Estoque(
      loja.id_estoque,
      loja.id,
      loja.quantidadeRecomendada,
      loja.quantidadeMinima
    );
    const statusEstoque = loja.status || estoque.verificarEstoque();
    const badgeClass = statusEstoque === "Estoque baixo" ? "badge badge-low" : "badge badge-sufficient";

    return `
      <tr>
        <td>${loja.nome}</td>
        <td>${estoque.quantidadeMinima}</td>
        <td>${estoque.quantidadeRecomendada}</td>
        <td><span class="${badgeClass}">${statusEstoque}</span></td>
        <td class="estoque">
          <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarEstoque(${loja.id})"></i>
        </td>
      </tr>
    `;
  }).join("");

  // Atualiza o conteúdo do corpo da tabela
  lojaTableBody.innerHTML = filteredRows;

  // Gera os cards para lojas filtradas
  const filteredCards = lojasFiltradas.map((loja) => {
    const estoque = new Estoque(
      loja.id_estoque,
      loja.id,
      loja.quantidadeRecomendada,
      loja.quantidadeMinima
    );
    const statusEstoque = loja.status || estoque.verificarEstoque();
    const badgeClass = statusEstoque === "Estoque baixo" ? "badge badge-low" : "badge badge-sufficient";

    return `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${loja.nome}</h5>
          <p class="card-text">Quantidade Mínima: ${estoque.quantidadeMinima}</p>
          <p class="card-text">Quantidade Recomendada: ${estoque.quantidadeRecomendada}</p>
          <span class="${badgeClass}">${statusEstoque}</span>
          <div class="card-actions">
            <i class="fas fa-edit" style="cursor: pointer;" onclick="editarEstoque(${loja.id})"></i>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Atualiza o container de cards
  lojaCardsContainer.innerHTML = filteredCards;

  // Exibe a tabela ou os cards com base na largura da tela
  const isMobile = window.innerWidth < 768; // Defina o breakpoint para considerar mobile
  if (isMobile) {
    lojaTableBody.style.display = "none"; // Esconde a tabela em dispositivos móveis
    lojaCardsContainer.style.display = "block"; // Exibe os cards em dispositivos móveis
  } else {
    lojaTableBody.style.display = "table-row-group"; // Exibe a tabela em dispositivos desktop
    lojaCardsContainer.style.display = "none"; // Esconde os cards em desktop
  }
};

// Adicione um listener para verificar a janela ao redimensionar
window.addEventListener('resize', buscarEstoque);





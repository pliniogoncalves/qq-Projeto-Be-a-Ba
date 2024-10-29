// Importação dos modelos
import { Estoque } from "../models/Estoque.js";
import { Loja } from "../models/Loja.js";

// Função para exibir o estoque
window.showEstoque = function (paginaAtual = 1, termoBusca = "") {
  const content = document.getElementById("mainContent");
  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  if (termoBusca) {
    lojas = lojas.filter((loja) =>
      loja.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }

  let tableRows = "";
  const itensPorPagina = window.innerWidth >= 1200 ? 10 : window.innerWidth >= 768 ? 7 : 5;
  const totalPaginas = Math.ceil(lojas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const lojasPaginadas = lojas.slice(inicio, inicio + itensPorPagina);

  if (lojasPaginadas.length === 0) {
    tableRows = `<tr><td colspan="5" class="text-center">Nenhuma loja encontrada.</td></tr>`;
  } else {
    lojasPaginadas.forEach((loja) => {
      const estoque = new Estoque(
        loja.id_estoque,
        loja.id,
        loja.quantidadeRecomendada, // Ajuste
        loja.quantidadeMinima // Ajuste
      );

      const statusEstoque = estoque.verificarEstoque();
      const badgeClass = estoque.estoqueBaixo() ? "badge badge-low" : "badge badge-sufficient";

      tableRows += `
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
    });
  }

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

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Gestão de Estoque</h1>
    <p class="text-center">Veja o estoque de talões de cada loja.</p>

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

    <div class="text-center mb-4">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-6 col-md-3 mb-2">
          <button class="btn btn-custom w-100" type="button" onclick="solicitarTalao()">
            <i class="fas fa-plus-circle"></i> Solicitar Talão
          </button>
        </div>    
      </div>
    </div>
  `;

  setActiveButton("Estoque");
};

// Função para editar o estoque mínimo, recomendado e a frequência de alerta
window.editarEstoque = function (id_loja) {
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
    <h1>Editar Estoque</h1>
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
  const quantidadeMinima = document.getElementById("quantidadeMinima").value;
  const quantidadeRecomendada = document.getElementById("quantidadeRecomendada").value;
  const frequenciaAlerta = document.getElementById("frequenciaAlerta").value;

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  let loja = lojas.find((l) => l.id === id_loja);

  if (loja) {
    loja.quantidadeMinima = quantidadeMinima;
    loja.quantidadeRecomendada = quantidadeRecomendada;
    loja.frequenciaAlerta = frequenciaAlerta;

    localStorage.setItem("lojas", JSON.stringify(lojas));
  }

  showEstoque();
};

// Solicitar talão
window.solicitarTalao = function () {
  // Salva o estado atual da função no histórico, permitindo navegação reversa
  historico.push({ funcao: solicitarTalao });

  const content = document.getElementById("mainContent");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Verificar se há lojas cadastradas
  const lojasCadastradas = Loja.listarLojas(); // Presumindo que existe uma função para listar lojas

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

  // Mostrar conteúdo dinâmico do formulário
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-voltar" onclick="voltar()">
          <i class="bi bi-arrow-left"></i> Voltar
        </button>
        <div class="w-100 text-center me-4 me-md-5">
          <h1>Solicitar Talão</h1>
          <p>Preencha os dados abaixo para Solicitar um novo Talão.</p>
        </div>
      </div>
      <form id="talaoForm" onsubmit="salvarSolicitacaoTalao(event)">
        <div class="mb-3">
          <label for="lojaTalao" class="form-label">Loja</label>
          ${lojaInput}
        </div>
        <div class="mb-3">
          <label for="dataTalao" class="form-label">Data</label>
          <input type="date" class="form-control" id="dataTalao" required>
        </div>
        <div class="mb-3">
          <label for="horaTalao" class="form-label">Hora</label>
          <input type="time" class="form-control" id="horaTalao" required>
        </div>
        <div class="mb-3">
          <label for="quantidadeTalao" class="form-label">Quantidade de Talões</label>
          <input type="number" class="form-control" id="quantidadeTalao" placeholder="Digite a quantidade" min="1" required>
        </div>
        <div class="text-center mb-4">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-6 col-md-3 mb-2">
              <button type="submit" class="btn btn-custom w-100" ${
                lojasCadastradas.length === 0 ? "disabled" : ""
              }>
                <i class="fas fa-plus-circle"></i> Solicitar Talão
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

// Salvar solicitação de talão
window.salvarSolicitacaoTalao = function (event) {
  event.preventDefault();
  const loja = document.getElementById("lojaTalao").value;
  const data = document.getElementById("dataTalao").value; // Obtém a data
  const hora = document.getElementById("horaTalao").value; // Obtém a hora
  const quantidade = parseInt(
    document.getElementById("quantidadeTalao").value,
    10
  );
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // Adiciona o usuário logado

  // Validação adicional
  if (!loja || !data || !hora || isNaN(quantidade) || quantidade < 1) {
    mostrarModal("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const dataHora = new Date(`${data}T${hora}`).toISOString();
  Talao.criarTalao(loja, dataHora, quantidade, usuarioLogado.nome); // Passa o nome do funcionário
  showTaloes();
};

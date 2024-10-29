import { Talao } from "../models/Talao.js";
import { Loja } from "../models/Loja.js";

// Função para formatar data e hora para os campos de input
function formatarDataHora(dataHoraISO) {
  const data = new Date(dataHoraISO);

  if (isNaN(data.getTime())) {
    console.error("Data inválida:", dataHoraISO);
    return [null, null]; // Retorne valores padrão em caso de erro
  }

  // Formatar data para yyyy-MM-dd, compatível com o input de data
  const dataFormatada = data.toISOString().split("T")[0];

  // Formatar hora para HH:mm, compatível com o input de hora
  const horaFormatada = data.toTimeString().split(":").slice(0, 2).join(":");

  return [dataFormatada, horaFormatada];
}

window.showTaloes = function (paginaAtual = 1, taloesFiltrados = null) {
  const content = document.getElementById("mainContent");
  const todosTaloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  let cardRows = "";

  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";

  let itensPorPagina = window.innerWidth >= 768 ? 3 : 1;

  const taloes =
    taloesFiltrados ||
    todosTaloes.filter(
      (talao) => isAdminRootMatriz || talao.loja === usuarioLogado.loja
    );

  const totalPaginas = Math.ceil(taloes.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const taloesPaginados = taloes.slice(inicio, inicio + itensPorPagina);

  if (taloesPaginados.length === 0) {
    cardRows = `
      <div class="col-12 text-center">
        <p>Nenhum talão encontrado.</p>
      </div>`;
  } else {
    taloesPaginados.forEach((talao) => {
      const [data, hora] = formatarDataHora(talao.dataHora);

      // Define a classe da borda de acordo com o status
      let borderClass = "default"; // Classe padrão
      let badgeClass = "badge-default"; // Classe padrão do badge
      if (talao.status === "Solicitado") {
        borderClass = "solicitado";
        badgeClass = "badge-solicitado"; // Atualiza a classe do badge para solicitado
      } else if (talao.status === "Recebido") {
        borderClass = "recebido";
        badgeClass = "badge-recebido"; // Classe do badge para recebido
      }

      // Geração do card
      cardRows += `
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="card h-100 shadow-sm ${borderClass}"> <!-- Adiciona a classe da borda -->
            <div class="card-body">
              <h5 class="card-title">Talão ID: ${talao.id}</h5>
              <p class="card-text">
                <strong>Loja:</strong> ${talao.loja}<br>
                <strong>Data:</strong> ${data}<br>
                <strong>Hora:</strong> ${hora}<br>
                <strong>Quantidade:</strong> ${talao.quantidade}<br>
                <span class="badge ${badgeClass}">${talao.status}</span> <!-- Aplica a classe do badge -->
              </p>
            </div>
            <div class="card-footer text-center">
              <i class="fas fa-eye mx-2" onclick="visualizarDetalhes(${talao.id})" data-bs-toggle="tooltip" title="Detalhes"></i>
              <i class="fas fa-edit mx-2" onclick="editarTalao(${talao.id})" data-bs-toggle="tooltip" title="Editar"></i>
              <i class="fas fa-trash mx-2" onclick="excluirTalao(${talao.id})" data-bs-toggle="tooltip" title="Excluir"></i>
              <i class="fas fa-file-export mx-2" onclick="exportarTalao(${talao.id})" data-bs-toggle="tooltip" title="Exportar"></i>
            </div>
          </div>
        </div>`;
    });
  }

  const paginacao = `
    <nav class="d-flex justify-content-center">
      <ul class="pagination custom-pagination">
        <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="showTaloes(${
            paginaAtual - 1
          })">&laquo;</a>
        </li>
        ${Array.from(
          { length: totalPaginas },
          (_, i) => `
          <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
            <a class="page-link" href="#" onclick="showTaloes(${i + 1})">${
            i + 1
          }</a>
          </li>`
        ).join("")}
        <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="showTaloes(${
            paginaAtual + 1
          })">&raquo;</a>
        </li>
      </ul>
    </nav>`;

  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Gestão de Talões</h1>
    <p class="text-center">Veja a lista de talões e suas respectivas situações.</p>
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12 mb-4">
          <div class="input-group">
            <input type="text" class="form-control" id="talaoSearchInput" placeholder="Procurar por talão" oninput="buscarTalao()" value="${
              document.getElementById("talaoSearchInput")?.value || ""
            }">
              <div class="input-icon">
                <i class="fas fa-search"></i>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">${cardRows}</div>
    </div>
    ${paginacao}
    <div class="text-center mb-4">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-6 col-md-3 mb-2">
          <button class="btn btn-custom w-100" type="button" onclick="solicitarTalao()">
            <i class="fas fa-plus-circle"></i> Solicitar Talão
          </button>
        </div>
         <div class="col-12 col-sm-6 col-md-3 mb-2">
    <button class="btn btn-enviar w-100" type="button" onclick="registrarEnvio()" aria-label="Registrar Envio">
      <i class="fas fa-paper-plane"></i> Registrar Envio
    </button>
  </div>
  <div class="col-12 col-sm-6 col-md-3 mb-2">
    <button class="btn btn-recebimento w-100" type="button" onclick="registrarRecebimento()" aria-label="Registrar Recebimento">
      <i class="fas fa-check-circle"></i> Registrar Recebimento
    </button>
  </div>
  <div class="col-12 col-sm-6 col-md-3 mb-2">
    <button class="btn btn-exportar w-100" type="button" onclick="exportarTodosTaloes()" aria-label="Exportar Todos">
      <i class="fas fa-file-export"></i> Exportar Todos
    </button>
  </div>
       
      </div>
    </div>`;

  setActiveButton("Talões");
};

// Função para editar talão
window.editarTalao = function (id) {
  console.log(`Editando talão com ID: ${id}`); // Log para verificar o ID
  const talao = Talao.buscarTalao(id);

  const content = document.getElementById("mainContent");

  // Certifique-se de que a dataHora do talão está no formato correto
  const [data, hora] = formatarDataHora(talao.dataHora);

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Verificar se há lojas cadastradas
  const lojasCadastradas = Loja.listarLojas();

  // Lógica para exibir o campo da loja
  let lojaInput = "";
  if (usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz") {
    if (lojasCadastradas.length > 0) {
      lojaInput = `
        <select class="form-select" id="lojaTalaoEdit" required>
          ${lojasCadastradas
            .map(
              (loja) =>
                `<option value="${loja.nome}" ${
                  loja.nome === talao.loja ? "selected" : ""
                }>${loja.nome}</option>`
            )
            .join("")}
        </select>`;
    } else {
      lojaInput = `
        <select class="form-select" id="lojaTalaoEdit" disabled>
          <option value="">Nenhuma loja cadastrada</option>
        </select>`;
    }
  } else {
    lojaInput = `
      <input type="text" class="form-control" id="lojaTalaoEdit" value="${talao.loja}" readonly required>`;
  }

  content.innerHTML = `
      <div class="form-container">
          <h1 class="h4 mb-4">Editar Talão</h1>
          <form id="talaoEditForm" onsubmit="salvarEdicaoTalao(event, ${id})">
              <div class="mb-3">
                  <label for="lojaTalaoEdit" class="form-label">Loja</label>
                  ${lojaInput}
              </div>
              <div class="mb-3">
                  <label for="dataTalaoEdit" class="form-label">Data</label>
                  <input type="date" class="form-control" id="dataTalaoEdit" value="${data}" required>
              </div>
              <div class="mb-3">
                  <label for="horaTalaoEdit" class="form-label">Hora</label>
                  <input type="time" class="form-control" id="horaTalaoEdit" value="${hora}" required>
              </div>
              <div class="mb-3">
                  <label for="quantidadeTalaoEdit" class="form-label">Quantidade de Talões</label>
                  <input type="number" class="form-control" id="quantidadeTalaoEdit" value="${talao.quantidade}" min="1" required>
              </div>
              <div class="text-center mb-4">
                <div class="row justify-content-center">
                  <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <button type="submit" class="btn btn-custom w-100" style="background-color: #269447; color: white;">
                      <i class="fas fa-save"></i> Salvar Edição
                    </button>
                  </div>
                </div>
              </div>
          </form>
      </div>
  `;
};

// Salvar edição de talão
window.salvarEdicaoTalao = function (event, id) {
  event.preventDefault();

  // Obtém os valores do formulário
  const loja = document.getElementById("lojaTalaoEdit").value;
  const data = document.getElementById("dataTalaoEdit").value; // Obtém a data
  const hora = document.getElementById("horaTalaoEdit").value; // Obtém a hora
  const quantidade = parseInt(
    document.getElementById("quantidadeTalaoEdit").value,
    10
  );

  if (!loja || !data || !hora || isNaN(quantidade) || quantidade < 1) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  // Formata a data e hora
  const dataHora = new Date(`${data}T${hora}`).toISOString();

  // Chama o método de atualização passando os parâmetros corretos
  Talao.atualizarTalao(id, loja, dataHora, quantidade, null); // status permanece o mesmo, por isso passa null

  // Exibe a lista atualizada de talões
  showTaloes();
};

// Excluir talão
window.excluirTalao = function (id) {
  const confirmacao = confirm("Tem certeza que deseja excluir este talão?");
  if (confirmacao) {
    Talao.excluirTalao(id);
    showTaloes();
  }
};

// Solicitar talão
window.solicitarTalao = function () {
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
    <div class="form-container">
      <h1 class="h4 mb-4">Solicitar Talão</h1>
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
              <button type="submit" class="btn btn-custom w-100" style="background-color: #269447; color: white;" ${
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
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const dataHora = new Date(`${data}T${hora}`).toISOString();
  Talao.criarTalao(loja, dataHora, quantidade, usuarioLogado.nome); // Passa o nome do funcionário
  showTaloes();
};

// Função para registrar o envio
window.registrarEnvio = function () {
  const content = document.getElementById("mainContent");
  const taloes = Talao.listarTaloes();
  const taloesSolicitados = taloes.filter(
    (talao) => talao.status === "Solicitado"
  );

  if (taloesSolicitados.length === 0) {
    alert("Não há talões solicitados para registrar envio.");
    return;
  }

  let tableRows = "";
  taloesSolicitados.forEach((talao) => {
    const [data, hora] = formatarDataHora(talao.dataHora);
    tableRows += `
        <tr>
            <td>${talao.id}</td>
            <td>${talao.loja}</td>
            <td>${data}</td>
            <td>${hora}</td>
            <td>${talao.quantidade}</td>
            <td>
                <button class="btn btn-success" onclick="confirmarEnvio(${talao.id})">Confirmar Envio</button>
            </td>
        </tr>
      `;
  });

  content.innerHTML = `
        <h1 class="h4 mb-4">Registrar Envio</h1>
        <p>Confirme o envio dos talões solicitados.</p>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Loja</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
};

// Confirmar envio
window.confirmarEnvio = function (id) {
  const talao = Talao.buscarTalao(id);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // Adiciona o usuário logado
  if (talao) {
    Talao.atualizarTalao(
      id,
      talao.loja,
      talao.dataHora,
      talao.quantidade,
      "Enviado",
      usuarioLogado.nome // Passa o nome do funcionário para registrar o envio
    );
    alert("Talão registrado como enviado.");
    showTaloes();
  }
};

// Registrar recebimento
window.registrarRecebimento = function () {
  const content = document.getElementById("mainContent");
  const taloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const loja = usuarioLogado.loja;
  const isAdmin = usuarioLogado.perfil === "AdminRoot"; // Verifica se o usuário é o AdminRoot

  const taloesEnviados = taloes
    .filter(
      (talao) => isAdmin || talao.loja === loja // Admin pode ver todos, outros apenas sua loja
    )
    .filter((talao) => talao.status === "Enviado");

  if (taloesEnviados.length === 0) {
    alert("Não há talões enviados para registrar recebimento.");
    return;
  }

  let tableRows = "";
  taloesEnviados.forEach((talao) => {
    const [data, hora] = formatarDataHora(talao.dataHora);
    tableRows += `
        <tr>
            <td>${talao.id}</td>
            <td>${talao.loja}</td>
            <td>${data}</td>
            <td>${hora}</td>
            <td>${talao.quantidade}</td>
            <td>
                <button class="btn btn-success" onclick="confirmarRecebimento(${talao.id})">Confirmar Recebimento</button>
            </td>
        </tr>
      `;
  });

  content.innerHTML = `
        <h1 class="h4 mb-4">Registrar Recebimento</h1>
        <p>Confirme o recebimento dos talões enviados.</p>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Loja</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
};

// Confirmar recebimento
window.confirmarRecebimento = function (id) {
  const talao = Talao.buscarTalao(id);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // Adiciona o usuário logado
  if (talao) {
    Talao.atualizarTalao(
      id,
      talao.loja,
      talao.dataHora,
      talao.quantidade,
      "Recebido",
      usuarioLogado.nome // Passa o nome do funcionário para registrar o recebimento
    );
    alert("Recebimento confirmado.");
    showTaloes();
  }
};

// Função para exportar talão específico para CSV
window.exportarTalao = function (id) {
  const talao = Talao.buscarTalao(id);

  // Formata as datas e horas se disponíveis
  const dataHoraSolicitado = talao.timestamps.solicitado
    ? formatarDataHora(talao.timestamps.solicitado.dataHora)
    : ["", ""]; // Formata a data e hora de solicitação
  const funcionarioSolicitante = talao.timestamps.solicitado?.funcionario || "";

  const dataHoraEnviado = talao.timestamps.enviado
    ? formatarDataHora(talao.timestamps.enviado.dataHora)
    : ["", ""]; // Formata a data e hora de envio
  const funcionarioEnviou = talao.timestamps.enviado?.funcionario || "";

  const dataHoraRecebido = talao.timestamps.recebido
    ? formatarDataHora(talao.timestamps.recebido.dataHora)
    : ["", ""]; // Formata a data e hora de recebimento
  const funcionarioRecebeu = talao.timestamps.recebido?.funcionario || "";

  // Cabeçalho e dados do CSV organizados nas colunas corretas
  const csvContent =
    `ID,Loja,Data Solicitado,Hora Solicitado,Funcionario Solicitante,Data Enviado,Hora Enviado,Funcionario Enviou,Data Recebido,Hora Recebido,Funcionario Recebeu,Quantidade,Status\n` +
    `${talao.id},${talao.loja},${dataHoraSolicitado[0]},${dataHoraSolicitado[1]},${funcionarioSolicitante},${dataHoraEnviado[0]},${dataHoraEnviado[1]},${funcionarioEnviou},${dataHoraRecebido[0]},${dataHoraRecebido[1]},${funcionarioRecebeu},${talao.quantidade},${talao.status}`;

  // Função para baixar o arquivo CSV
  downloadCSV(csvContent, `talao_${talao.id}.csv`);
};

// Função para exportar todos os talões para CSV
window.exportarTodosTaloes = function () {
  const taloes = Talao.listarTaloes();
  if (taloes.length === 0) {
    alert("Nenhum talão disponível para exportação.");
    return;
  }

  // Cabeçalho do CSV
  let csvContent =
    "ID,Loja,Data Solicitado,Hora Solicitado,Funcionario Solicitante,Data Enviado,Hora Enviado,Funcionario Enviou,Data Recebido,Hora Recebido,Funcionario Recebeu,Quantidade,Status\n";

  taloes.forEach((talao) => {
    // Formatar a data e hora de cada evento
    const dataHoraSolicitado = talao.timestamps.solicitado
      ? formatarDataHora(talao.timestamps.solicitado.dataHora)
      : ["", ""]; // Formata a data e hora de solicitação
    const dataHoraEnviado = talao.timestamps.enviado
      ? formatarDataHora(talao.timestamps.enviado.dataHora)
      : ["", ""]; // Formata a data e hora de envio
    const dataHoraRecebido = talao.timestamps.recebido
      ? formatarDataHora(talao.timestamps.recebido.dataHora)
      : ["", ""]; // Formata a data e hora de recebimento

    // Montar a linha do CSV com os dados corretos em cada coluna
    csvContent += `${talao.id},${talao.loja},${dataHoraSolicitado[0]},${
      dataHoraSolicitado[1]
    },${talao.timestamps.solicitado?.funcionario || ""},${dataHoraEnviado[0]},${
      dataHoraEnviado[1]
    },${talao.timestamps.enviado?.funcionario || ""},${dataHoraRecebido[0]},${
      dataHoraRecebido[1]
    },${talao.timestamps.recebido?.funcionario || ""},${talao.quantidade},${
      talao.status
    }\n`;
  });

  // Função auxiliar para baixar o CSV
  downloadCSV(csvContent, "taloes.csv");
};

// Função auxiliar para download de CSV
function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para visualizar detalhes do talão
window.visualizarDetalhes = function (id) {
  const talao = Talao.buscarTalao(id);
  const [data, hora] = formatarDataHora(talao.dataHora);

  const dataSolicitado = talao.timestamps.solicitado
    ? new Date(talao.timestamps.solicitado.dataHora).toLocaleString("pt-BR")
    : "Não disponível";
  const funcionarioSolicitante =
    talao.timestamps.solicitado?.funcionario || "Não disponível";
  const dataEnviado = talao.timestamps.enviado
    ? new Date(talao.timestamps.enviado.dataHora).toLocaleString("pt-BR")
    : "Não disponível";
  const funcionarioEnviou =
    talao.timestamps.enviado?.funcionario || "Não disponível";
  const dataRecebido = talao.timestamps.recebido
    ? new Date(talao.timestamps.recebido.dataHora).toLocaleString("pt-BR")
    : "Não disponível";
  const funcionarioRecebeu =
    talao.timestamps.recebido?.funcionario || "Não disponível";

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <h1 class="h4 mb-4">Detalhes do Talão</h1>
    <p><strong>ID:</strong> ${talao.id}</p>
    <p><strong>Loja:</strong> ${talao.loja}</p>
    <p><strong>Data Solicitado:</strong> ${dataSolicitado}</p>
    <p><strong>Funcionario Solicitante:</strong> ${funcionarioSolicitante}</p>
    <p><strong>Data Enviado:</strong> ${dataEnviado}</p>
    <p><strong>Funcionario Enviou:</strong> ${funcionarioEnviou}</p>
    <p><strong>Data Recebido:</strong> ${dataRecebido}</p>
    <p><strong>Funcionario Recebeu:</strong> ${funcionarioRecebeu}</p>
    <p><strong>Quantidade:</strong> ${talao.quantidade}</p>
    <p><strong>Status:</strong> ${talao.status}</p>
  `;

  const modal = document.getElementById("detalhesModal");
  modal.style.display = "block";
};

// Função para buscar talões
window.buscarTalao = function () {
  const searchInput = document
    .getElementById("talaoSearchInput")
    .value.toLowerCase();
  const todosTaloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";

  const taloesFiltrados = todosTaloes.filter(
    (talao) =>
      (isAdminRootMatriz || talao.loja === usuarioLogado.loja) &&
      talao.id.toString().includes(searchInput)
  );

  if (searchInput) {
    showTaloes(1, taloesFiltrados); // Exibe os resultados filtrados
  } else {
    showTaloes(1); // Volta à listagem original
  }
};

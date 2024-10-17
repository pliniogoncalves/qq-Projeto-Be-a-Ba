import { Talao } from "../models/Talao.js";
import { Loja } from "../models/Loja.js";

// Função para formatar data e hora para os campos de input
function formatarDataHora(dataHoraISO) {
  const data = new Date(dataHoraISO);

  // Formatar data para yyyy-MM-dd, compatível com o input de data
  const dataFormatada = data.toISOString().split("T")[0];

  // Formatar hora para HH:mm, compatível com o input de hora
  const horaFormatada = data.toTimeString().split(":").slice(0, 2).join(":");

  return [dataFormatada, horaFormatada];
}


// Exibir talões na tela
window.showTaloes = function () {
  const content = document.getElementById("mainContent");
  const taloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  let tableRows = "";

  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";

  const taloesFiltrados = taloes.filter((talao) => {
    return isAdminRootMatriz || talao.loja === usuarioLogado.loja;
  });

  // Verificar se há talões para exibir
  if (taloesFiltrados.length === 0) {
    tableRows = `
      <tr>
        <td colspan="7" class="text-center">Nenhum talão encontrado.</td>
      </tr>`;
  } else {
    taloesFiltrados.forEach((talao) => {
      if (talao) {
        // Formatar data e hora no formato brasileiro (dd/mm/yyyy)
        const [data, hora] = formatarDataHora(talao.dataHora); // Formato brasileiro para data

        tableRows += `
              <tr>
                  <td>${talao.id}</td>
                  <td>${talao.loja}</td>
                  <td>${data}</td>
                  <td>${hora}</td>
                  <td>${talao.quantidade}</td>
                  <td><span class="badge ${
                    talao.status === "Solicitado"
                      ? "bg-warning"
                      : talao.status === "Recebido"
                      ? "bg-success"
                      : "bg-secondary"
                  }">${talao.status}</span></td>
                  <td>
                      <i class="fas fa-eye" 
                         style="cursor: pointer; margin-right: 10px;" 
                         onclick="visualizarDetalhes(${talao.id})" 
                         data-bs-toggle="tooltip" 
                         title="Detalhes"></i>
                      <i class="fas fa-edit" 
                         style="cursor: pointer; margin-right: 10px;" 
                         onclick="editarTalao(${talao.id})" 
                         data-bs-toggle="tooltip" 
                         title="Editar"></i>
                      <i class="fas fa-trash" 
                         style="cursor: pointer; margin-right: 10px;" 
                         onclick="excluirTalao(${talao.id})" 
                         data-bs-toggle="tooltip" 
                         title="Excluir"></i>
                      <i class="fas fa-file-export" 
                         style="cursor: pointer;" 
                         onclick="exportarTalao(${talao.id})" 
                         data-bs-toggle="tooltip" 
                         title="Exportar"></i>
                  </td>
              </tr>
          `;
      }
    });
  }

  content.innerHTML = `
        <div class="overlay" id="overlay"></div>
        <h1 class="text-center mb-4">Lista de Talões</h1>
        <p class="text-center mb-4">Veja a lista de talões e suas respectivas situações.</p>
  
        <div class="container mb-4">
            <div class="row justify-content-center">
                <div class="col-md-8 col-sm-12 mb-4">
                    <div class="input-group">
                        <input type="text" class="form-control" id="talaoSearchInput" placeholder="Procurar por talão" oninput="buscarTalao()">
                        <div class="input-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <button class="btn btn-outline-secondary" type="button" onclick="exportarTodosTaloes()">Exportar Todos</button>
                    </div>
                </div>
            </div>
        </div>
  
        <div class="table-responsive">
            <table class="table table-striped">
            <thead>
                <tr class="table-success"> <!-- Tabela com cor verde -->
                    <th>ID</th>
                    <th>Loja</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Quantidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="talaoTableBody">
                ${tableRows}
            </tbody>
            </table>
        </div>
        
        <div class="text-center mb-4">
            <button class="btn btn-custom btn-primary" type="button" onclick="solicitarTalao()">Solicitar Talão</button>
            <button class="btn btn-info" type="button" onclick="registrarEnvio()">Registrar Envio</button>
            <button class="btn btn-success" type="button" onclick="registrarRecebimento()">Registrar Recebimento</button>
        </div>
    `;

  // Inicializa tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

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
              <button type="submit" class="btn btn-submit">Salvar Edição</button>
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
  const quantidade = parseInt(document.getElementById("quantidadeTalaoEdit").value, 10);

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
        <button type="submit" class="btn btn-submit" ${
          lojasCadastradas.length === 0 ? "disabled" : ""
        }>
          Solicitar Talão
        </button>
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

  // Validação adicional
  if (!loja || !data || !hora || isNaN(quantidade) || quantidade < 1) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const dataHora = new Date(`${data}T${hora}`).toISOString();
  Talao.criarTalao(loja, dataHora, quantidade, "Solicitado");
  showTaloes();
};

// Função para registrar o envio
window.registrarEnvio = function () {
  const content = document.getElementById("mainContent");
  const taloes = Talao.listarTaloes();
  const taloesSolicitados = taloes.filter(talao => talao.status === "Solicitado");

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
  if (talao) {
    talao.status = "Enviado";
    Talao.atualizarTalao(id, talao.loja, talao.dataHora, talao.quantidade, "Enviado");
    alert("Talão registrado como enviado.");
    showTaloes(); // Atualiza a lista de talões
  }
};

// Registrar recebimento
window.registrarRecebimento = function () {
  const content = document.getElementById("mainContent");
  const taloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const loja = usuarioLogado.loja;
  const isAdmin = usuarioLogado.perfil === "AdminRoot"; // Verifica se o usuário é o AdminRoot

  const taloesEnviados = taloes.filter(talao =>
    isAdmin || talao.loja === loja // Admin pode ver todos, outros apenas sua loja
  ).filter(talao => talao.status === "Enviado");

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
  if (talao) {
    talao.status = "Recebido";
    Talao.atualizarTalao(id, talao.loja, talao.dataHora, talao.quantidade, "Recebido");
    alert("Recebimento confirmado.");
    showTaloes(); // Atualiza a lista de talões
  }
};


// Função para exportar talões para CSV
window.exportarTalao = function (id) {
  const talao = Talao.buscarTalao(id);

  const csvContent = `ID,Loja,Data,Hora,Quantidade,Status\n${talao.id},${
    talao.loja
  },${formatarDataHora(talao.dataHora).join(",")},${talao.quantidade},${
    talao.status
  }`;
  downloadCSV(csvContent, `talao_${talao.id}.csv`);
};

// Função para exportar todos os talões para CSV
window.exportarTodosTaloes = function () {
  const taloes = Talao.listarTaloes();
  if (taloes.length === 0) {
    alert("Nenhum talão disponível para exportação.");
    return;
  }

  let csvContent = "ID,Loja,Data,Hora,Quantidade,Status\n";
  taloes.forEach((talao) => {
    csvContent += `${talao.id},${talao.loja},${formatarDataHora(
      talao.dataHora
    ).join(",")},${talao.quantidade},${talao.status}\n`;
  });
  downloadCSV(csvContent, "taloes.csv");
};

// Função para buscar talões
window.buscarTalao = function () {
  const searchInput = document
    .getElementById("talaoSearchInput")
    .value.toLowerCase();
  const tableRows = document.querySelectorAll("#talaoTableBody tr");

  tableRows.forEach((row) => {
    const lojaCell = row.cells[1].textContent.toLowerCase();
    const idCell = row.cells[0].textContent.toLowerCase();
    if (lojaCell.includes(searchInput) || idCell.includes(searchInput)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
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

  // Prepara o conteúdo do modal
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <h1 class="h4 mb-4">Detalhes do Talão</h1>
    <p><strong>ID:</strong> ${talao.id}</p>
    <p><strong>Loja:</strong> ${talao.loja}</p>
    <p><strong>Data:</strong> ${data}</p>
    <p><strong>Hora:</strong> ${hora}</p>
    <p><strong>Quantidade:</strong> ${talao.quantidade}</p>
    <p><strong>Status:</strong> ${talao.status}</p>
    <button class="btn btn-primary" onclick="fecharModal()">Fechar</button>
  `;

  // Exibe o modal
  const modal = document.getElementById("detalhesModal");
  modal.style.display = "block";
};

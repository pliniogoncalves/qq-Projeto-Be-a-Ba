import { Talao } from "../models/Talao.js";
import { Loja } from "../models/Loja.js";
import { Usuario } from "../models/Usuario.js";

window.showTaloes = function (paginaAtual = 1, taloesFiltrados = null) {
  // Salva o estado atual para histórico de navegação
  historico.push({ funcao: showTaloes, args: [paginaAtual] });

  const content = document.getElementById("mainContent");
  const todosTaloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  let cardRows = "";

  // Define se o usuário tem perfil de AdminRoot e acesso à loja matriz
  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";

  let itensPorPagina = window.innerWidth >= 768 ? 3 : 1;

  // Filtra os talões conforme o perfil do usuário
  const taloes =
    taloesFiltrados ||
    todosTaloes.filter(
      (talao) => isAdminRootMatriz || talao.loja === usuarioLogado.loja
    );

  const totalPaginas = Math.ceil(taloes.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const taloesPaginados = taloes.slice(inicio, inicio + itensPorPagina);

  // Monta os cards de talões
if (taloesPaginados.length === 0) {
  cardRows = `<div class="col-12 text-center">
      <p>Nenhum talão encontrado.</p>
    </div>`;
} else {
  taloesPaginados.forEach((talao) => {
    const [data, hora] = formatarDataHora(talao.dataHora);

    // Define as classes de status para borda e badge
    let borderClass = "default"; // Classe padrão para borda
    let badgeClass = "badge-default"; // Classe padrão do badge
    
    if (talao.status === "Enviado") {
      borderClass = "enviado"; // Classe para status enviado
      badgeClass = "badge-enviado"; // Badge para status enviado
    } else if (talao.status === "Recebido") {
      borderClass = "recebido"; // Classe para status recebido
      badgeClass = "badge-recebido"; // Badge para status recebido
    }

    // Geração do card com os detalhes do talão
    cardRows += `<div class="col-md-4 col-sm-6 mb-4">
        <div class="card h-100 shadow-sm ${borderClass}">
          <div class="card-body">
            <h5 class="card-title">Talão ID: ${talao.id}</h5>
            <p class="card-text">
              <strong>Loja:</strong> ${talao.loja}<br>
              <strong>Data:</strong> ${data}<br>
              <strong>Hora:</strong> ${hora}<br>
              <strong>Quantidade:</strong> ${talao.quantidade}<br>
              <span class="badge ${badgeClass}">${talao.status}</span>
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


  // Paginação
  const paginacao = `
    <nav class="d-flex justify-content-center">
      <ul class="pagination custom-pagination">
        <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="showTaloes(${paginaAtual - 1})">&laquo;</a>
        </li>
        ${Array.from(
          { length: totalPaginas },
          (_, i) => `
          <li class="page-item ${i + 1 === paginaAtual ? "active" : ""}">
            <a class="page-link" href="#" onclick="showTaloes(${i + 1})">${i + 1}</a>
          </li>`
        ).join("")}
        <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="showTaloes(${paginaAtual + 1})">&raquo;</a>
        </li>
      </ul>
    </nav>`;

  // Montagem do conteúdo HTML
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
          <button class="btn btn-custom w-100" type="button" onclick="registrarEnvio()" aria-label="Registrar Envio">
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
            <i class="fas fa-file-export"></i> Exportar Dados
          </button>
        </div>
      </div>
    </div>`;

  // Define o botão ativo na interface
  setActiveButton("Talões");
};

// Função para registrar envio de talões
window.registrarEnvio = function () {
  // Salva o estado atual no histórico
  historico.push({ funcao: registrarEnvio });

  const content = document.getElementById("mainContent");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Verifica as lojas cadastradas
  const lojasCadastradas = Loja.listarLojas();

  let lojaInput = "";
  if (usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz") {
    // Permite que AdminRoot selecione uma loja
    if (lojasCadastradas.length > 0) {
      lojaInput = `
        <select class="form-select" id="lojaTalao" onchange="preencherQuantidadeNecessaria()" required>
          <option value="" disabled selected>Selecione uma loja</option>
          ${lojasCadastradas.map((loja) => `<option value="${loja.nome}">${loja.nome}</option>`).join("")}
        </select>`;
    } else {
      lojaInput = `
        <select class="form-select" id="lojaTalao" disabled>
          <option value="">Nenhuma loja cadastrada</option>
        </select>`;
    }
  } else {
    // Usuários que não são AdminRoot apenas visualizam a própria loja
    lojaInput = `
      <input type="text" class="form-control" id="lojaTalao" value="${usuarioLogado.loja}" readonly required>`;
  }

  // Monta o formulário de envio de talão
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button class="btn btn-voltar" onclick="voltar()">
        <i class="bi bi-arrow-left"></i> Voltar
      </button>
      <div class="w-100 text-center me-4 me-md-5">
        <h1>Registrar Envio</h1>
        <p>Preencha os dados abaixo para registrar o envio de um Talão.</p>
      </div>
    </div>
    <form id="talaoForm" onsubmit="salvarRegistroEnvio(event)">
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
        <input type="number" class="form-control" id="quantidadeTalao" placeholder="Quantidade necessária será preenchida automaticamente" min="1" required>
      </div>
      <div class="text-center mb-4">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-6 col-md-3 mb-2">
            <button type="submit" class="btn btn-custom w-100">
              <i class="fas fa-paper-plane"></i> Registrar Envio
            </button>
          </div>
        </div>
      </div>
      ${lojasCadastradas.length === 0 ? '<p class="text-danger mt-2">Nenhuma loja cadastrada. Por favor, cadastre uma loja para continuar.</p>' : ""}
    </form>
  `;
};


// Função para preencher a quantidade necessária de talões com base na loja selecionada
window.preencherQuantidadeNecessaria = function () {
  const lojaNome = document.getElementById("lojaTalao").value;
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const loja = lojas.find((l) => l.nome === lojaNome);
  
  if (loja) {
    // Calcula a quantidade necessária como diferença entre quantidade recomendada e mínima
    const quantidadeNecessaria = loja.quantidadeRecomendada - loja.quantidadeMinima;
    document.getElementById("quantidadeTalao").value = quantidadeNecessaria > 0 ? quantidadeNecessaria : 1;
  }
};


// Função para salvar registro de envio
window.salvarRegistroEnvio = function (event) {
  event.preventDefault();
  const loja = document.getElementById("lojaTalao").value;
  const data = document.getElementById("dataTalao").value;
  const hora = document.getElementById("horaTalao").value;
  const quantidade = parseInt(document.getElementById("quantidadeTalao").value, 10);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!loja || !data || !hora || isNaN(quantidade) || quantidade < 1) {
    mostrarModal("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const dataHoraEnvio = new Date(`${data}T${hora}`).toISOString();
  
  // Criar talão com status "Enviado" e data/hora de envio
  Talao.criarTalao(loja, dataHoraEnvio, quantidade, usuarioLogado.nome, "Enviado"); 
  mostrarModal(`Talão enviado para ${loja}.`);
  showTaloes(); // Atualiza a lista de talões
};


// Registrar recebimento
window.registrarRecebimento = function () {
  historico.push({ funcao: registrarRecebimento });

  const content = document.getElementById("mainContent");
  const taloes = Talao.listarTaloes();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const loja = usuarioLogado.loja;
  const isAdmin = usuarioLogado.perfil === "AdminRoot";

  const taloesEnviados = taloes
    .filter(talao => isAdmin || talao.loja === loja)
    .filter(talao => talao.status === "Enviado");

  if (taloesEnviados.length === 0) {
    mostrarModal("Não há talões enviados para registrar recebimento.");
    return;
  }

  let tableRows = "";
  taloesEnviados.forEach(talao => {
    const [data, hora] = formatarDataHora(talao.dataHora);
    tableRows += `
        <tr>
            <td>${talao.id}</td>
            <td>${talao.loja}</td>
            <td>${data}</td>
            <td>${hora}</td>
            <td>${talao.quantidade}</td>
            <td>
                <button class="btn btn-success" onclick="confirmarRecebimento(${talao.id})"><i class="fas fa-check"></i></button>
            </td>
        </tr>
      `;
  });

  content.innerHTML = `
        <div class="overlay" id="overlay"></div>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button class="btn btn-voltar" onclick="voltar()">Voltar</button>
          <div class="w-100 text-center me-4 me-md-5">
            <h1>Registrar Recebimento</h1>
            <p>Confirme o recebimento dos Talões enviados.</p>
          </div>
        </div>
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
            <tbody>${tableRows}</tbody>
        </table>
    `;
};

// Confirmar recebimento
window.confirmarRecebimento = function (id) {
  const talao = Talao.buscarTalao(id);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  
  if (talao) {
    // Atualiza o status do talão para "Recebido"
    Talao.atualizarTalao(
      id,
      talao.loja,
      talao.dataHora,
      talao.quantidade,
      "Recebido",
      usuarioLogado.nome
    );

    // Atualiza o estoque da loja com a quantidade de talões recebida
    atualizarEstoqueLoja(talao.loja, talao.quantidade);

    mostrarModal(`Recebimento do Talão ${talao.id} confirmado.`);
    showTaloes();
  }
};

// Função auxiliar para atualizar o estoque da loja após o recebimento dos talões
function atualizarEstoqueLoja(lojaNome, quantidadeRecebida) {
  const lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  const loja = lojas.find((l) => l.nome === lojaNome);

  if (loja) {
    // Atualiza o estoque mínimo da loja com a quantidade recebida
    loja.quantidadeMinima = loja.quantidadeRecomendada;
    
    // Atualiza o status do estoque para "Estoque adequado" após o recebimento
    loja.status = "Estoque adequado";

    // Salva as atualizações no localStorage
    localStorage.setItem("lojas", JSON.stringify(lojas));
  }
}


// Função para editar talão
window.editarTalao = function (id) {
  // Salva o estado atual da função no histórico, permitindo navegação reversa
  historico.push({ funcao: editarTalao });

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

  // Adiciona o campo de status para edição
  const statusOptions = `
    <select id="statusTalaoEdit" class="form-select" required>
      <option value="Enviado" ${talao.status === "Enviado" ? "selected" : ""}>Enviado</option>
      <option value="Recebido" ${talao.status === "Recebido" ? "selected" : ""}>Recebido</option>
    </select>`;

  // Monta o formulário de edição com o novo campo de status
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button class="btn btn-voltar" onclick="voltar()">
        <i class="bi bi-arrow-left"></i> Voltar
      </button>
      <div class="w-100 text-center me-4 me-md-5">
        <h1>Editar Talão</h1>
        <p>Atualize as informações do Talão conforme necessário.</p>
      </div>
    </div>
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
      <div class="mb-3">
        <label for="statusTalaoEdit" class="form-label">Status</label>
        ${statusOptions}
      </div>
      <div class="text-center mb-4">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-6 col-md-3 mb-2">
            <button type="submit" class="btn btn-custom w-100">
              <i class="fas fa-save"></i> Salvar Edição
            </button>
          </div>
        </div>
      </div>
    </form>
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
    mostrarModal("Por favor, preencha todos os campos corretamente.");
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
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuario = Usuario.usuarios.find((user) => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || usuarioLogado.perfil !== "AdminRoot") {
    mostrarModal("Você não tem permissão para excluir este usuário.");
    return;
  }

  mostrarConfirmacao("Tem certeza que deseja excluir este Talão?", function () {
    Talao.excluirTalao(id);
    showTaloes();
  });
};

// Função para exportar talão específico para CSV
window.exportarTalao = function (id) {
  const talao = Talao.buscarTalao(id);

  // Formata as datas e horas se disponíveis
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
    `ID,Loja,Data Enviado,Hora Enviado,Funcionario Enviou,Data Recebido,Hora Recebido,Funcionario Recebeu,Quantidade,Status\n` +
    `${talao.id},${talao.loja},${dataHoraEnviado[0]},${dataHoraEnviado[1]},${funcionarioEnviou},${dataHoraRecebido[0]},${dataHoraRecebido[1]},${funcionarioRecebeu},${talao.quantidade},${talao.status}`;

  // Função para baixar o arquivo CSV
  downloadCSV(csvContent, `talao_${talao.id}.csv`);
};

// Função para exportar todos os talões enviados e recebidos para CSV
window.exportarTodosTaloes = function () {
  const taloes = Talao.listarTaloes();
  if (taloes.length === 0) {
    mostrarModal("Nenhum talão disponível para exportação.");
    return;
  }

  // Cabeçalho do CSV
  let csvContent =
    "ID,Loja,Data Enviado,Hora Enviado,Funcionario Enviou,Data Recebido,Hora Recebido,Funcionario Recebeu,Quantidade,Status\n";

  taloes.forEach((talao) => {
    // Formatar a data e hora de cada evento
    const dataHoraEnviado = talao.timestamps.enviado
      ? formatarDataHora(talao.timestamps.enviado.dataHora)
      : ["", ""]; // Formata a data e hora de envio
    const dataHoraRecebido = talao.timestamps.recebido
      ? formatarDataHora(talao.timestamps.recebido.dataHora)
      : ["", ""]; // Formata a data e hora de recebimento

    // Montar a linha do CSV com os dados corretos em cada coluna
    csvContent += `${talao.id},${talao.loja},${dataHoraEnviado[0]},${
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
// Função para visualizar detalhes do talão
window.visualizarDetalhes = function (id) {
  const talao = Talao.buscarTalao(id);

  // Verifica e formata a data/hora de envio
  const dataEnviado = talao.timestamps.enviado
    ? new Date(talao.timestamps.enviado.dataHora).toLocaleString("pt-BR")
    : "Não disponível";
  const funcionarioEnviou = talao.timestamps.enviado?.funcionario || "Não disponível";

  // Verifica e formata a data/hora de recebimento
  const dataRecebido = talao.timestamps.recebido
    ? new Date(talao.timestamps.recebido.dataHora).toLocaleString("pt-BR")
    : "Não disponível";
  const funcionarioRecebeu = talao.timestamps.recebido?.funcionario || "Não disponível";

  // Monta o conteúdo do modal
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <h1 class="h4 mb-4">Detalhes do Talão</h1>
    <p><strong>ID:</strong> ${talao.id}</p>
    <p><strong>Loja:</strong> ${talao.loja}</p>
    <p><strong>Data de Envio:</strong> ${dataEnviado}</p>
    <p><strong>Funcionário que Enviou:</strong> ${funcionarioEnviou}</p>
    <p><strong>Data de Recebimento:</strong> ${dataRecebido}</p>
    <p><strong>Funcionário que Recebeu:</strong> ${funcionarioRecebeu}</p>
    <p><strong>Quantidade:</strong> ${talao.quantidade}</p>
    <p><strong>Status:</strong> ${talao.status}</p>
  `;

  // Exibe o modal
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
      (talao.status === "Enviado" || talao.status === "Recebido") && // Filtra apenas os talões "Enviados" e "Recebidos"
      talao.id.toString().includes(searchInput)
  );

  if (searchInput) {
    showTaloes(1, taloesFiltrados); // Exibe os resultados filtrados
  } else {
    showTaloes(1); // Volta à listagem original
  }
};

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

import { Talao } from "../models/Talao.js";

const lojas = ["Loja 1", "Loja 2", "Loja 3"]; // Lista de lojas

window.showTaloes = function () {
  const content = document.getElementById("mainContent");
  const taloes = JSON.parse(localStorage.getItem("taloes")) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  let tableRows = "";

  const isAdminRootMatriz =
    usuarioLogado.perfil === "AdminRoot" && usuarioLogado.loja === "Matriz";

  const taloesFiltrados = taloes.filter((talao) => {
    return isAdminRootMatriz || talao.loja === usuarioLogado.loja;
  });

  taloesFiltrados.forEach((talao) => {
    if (talao) {
      const [data, hora] = formatarDataHora(talao.data);
      tableRows += `
            <tr>
                <td>${talao.id}</td>
                <td>${talao.loja}</td>
                <td>${data}</td>
                <td>${hora}</td>
                <td>${talao.quantidade}</td>
                <td><span class="badge ${
                  talao.status === "Enviado" ? "bg-success" : "bg-warning"
                }">${talao.status}</span></td>
                <td>
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
    } else {
      console.error("Talão inválido encontrado: ", talao);
    }
  });

  content.innerHTML = `
        <h1 class="text-center">Lista de Talões</h1>
        <p class="text-center">Veja a lista de talões e suas respectivas situações.</p>
  
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-sm-12 mb-4">
                    <div class="input-group">
                        <input type="text" class="form-control" id="talaoSearchInput" placeholder="Procurar por talão">
                        <div class="input-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <button class="btn btn-custom" type="button" onclick="buscarTalao()">Buscar</button>
                    </div>
                </div>
            </div>
        </div>
  
        <div class="table-responsive">
            <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Loja</th>
                    <th>Data</th>
                    <th>Hora</th> <!-- Nova coluna para Hora -->
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
            <button class="btn btn-custom" type="button" onclick="cadastrarTalao()">Registrar Novo Talão</button>
        </div>
    `;

  setActiveButton("Talões");
};

window.cadastrarTalao = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
          <div class="form-container">
          <h1 class="h4 mb-4">Novo Talão</h1>
          <form id="talaoForm" onsubmit="salvarTalao(event)">
              <div class="mb-3">
                  <label for="lojaTalao" class="form-label">Loja</label>
                  <select class="form-select" id="lojaTalao" required>
                      ${lojas
                        .map(
                          (loja) => `<option value="${loja}">${loja}</option>`
                        )
                        .join("")}
                  </select>
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
              <button type="submit" class="btn btn-submit">Registrar Talão</button>
          </form>
      </div>
      `;
};

window.salvarTalao = function (event) {
  event.preventDefault();
  const loja = document.getElementById("lojaTalao").value;
  const data = document.getElementById("dataTalao").value; // Obtém a data
  const hora = document.getElementById("horaTalao").value; // Obtém a hora
  const quantidade = document.getElementById("quantidadeTalao").value;

  // Combina a data e a hora em um único string no formato ISO
  const dataHora = new Date(`${data}T${hora}`).toISOString();

  const taloes = JSON.parse(localStorage.getItem("taloes")) || [];
  const novoTalao = {
    id: taloes.length + 1, // Gera um ID sequencial simples
    loja,
    data: dataHora, // Armazena a data e hora combinadas
    quantidade, // Armazena a quantidade de talões
    status: "Enviado", // Define o status padrão como "Enviado"
  };

  taloes.push(novoTalao);
  localStorage.setItem("taloes", JSON.stringify(taloes));

  alert(
    `Talão registrado para ${loja} na data ${data} às ${hora} com quantidade ${quantidade}`
  );

  // Voltar para a lista de talões
  showTaloes();
};

window.editarTalao = function (id) {
  const taloes = JSON.parse(localStorage.getItem("taloes")) || [];
  const talao = taloes.find((t) => t.id === id);

  if (!talao) {
    alert("Talão não encontrado.");
    return;
  }

  const content = document.getElementById("mainContent");
  const [data, hora] = talao.data.split("T"); // Garante que estamos lidando com a data corretamente
  const horaFormatada = hora.substring(0, 5); // Obtém apenas a parte da hora

  content.innerHTML = `
        <div class="form-container">
            <h1 class="h4 mb-4">Editar Talão</h1>
            <form id="talaoForm" onsubmit="salvarEdicaoTalao(event, ${id})">
                <div class="mb-3">
                    <label for="lojaTalao" class="form-label">Loja</label>
                    <input type="text" class="form-control" id="lojaTalao" value="${talao.loja}" required>
                </div>
                <div class="mb-3">
                    <label for="dataTalao" class="form-label">Data</label>
                    <input type="date" class="form-control" id="dataTalao" value="${data}" required>
                </div>
                <div class="mb-3">
                    <label for="horaTalao" class="form-label">Hora</label>
                    <input type="time" class="form-control" id="horaTalao" value="${horaFormatada}" required>
                </div>
                <div class="mb-3">
                    <label for="quantidadeTalao" class="form-label">Quantidade de Talões</label>
                    <input type="number" class="form-control" id="quantidadeTalao" value="${talao.quantidade}" min="1" required>
                </div>
                <button type="submit" class="btn btn-submit">Salvar Alterações</button>
            </form>
        </div>
    `;
};

window.salvarEdicaoTalao = function (event, id) {
  event.preventDefault();
  const loja = document.getElementById("lojaTalao").value;
  const data = document.getElementById("dataTalao").value; // Obtém a data
  const hora = document.getElementById("horaTalao").value; // Obtém a hora
  const quantidade = document.getElementById("quantidadeTalao").value;

  // Combina a data e a hora em um único string no formato ISO
  const dataHora = new Date(`${data}T${hora}`).toISOString();

  const taloes = JSON.parse(localStorage.getItem("taloes")) || [];
  const talaoIndex = taloes.findIndex((t) => t.id === id);

  if (talaoIndex !== -1) {
    taloes[talaoIndex].loja = loja;
    taloes[talaoIndex].data = dataHora; // Atualiza a data e hora
    taloes[talaoIndex].quantidade = quantidade; // Atualiza a quantidade de talões
    taloes[talaoIndex].status = taloes[talaoIndex].status; // Mantém o status atual
    localStorage.setItem("taloes", JSON.stringify(taloes));

    alert(
      `Talão atualizado para ${loja} na data ${data} às ${hora} com quantidade ${quantidade}`
    );

    // Voltar para a lista de talões
    showTaloes();
  } else {
    alert("Talão não encontrado.");
  }
};

// Buscar talão
window.buscarTalao = function () {
  const searchInput = document
    .getElementById("talaoSearchInput")
    .value.toLowerCase();
  const tableBody = document.getElementById("talaoTableBody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const idTalao = rows[i]
      .getElementsByTagName("td")[0]
      .textContent.toLowerCase(); // Coluna ID
    const lojaTalao = rows[i]
      .getElementsByTagName("td")[1]
      .textContent.toLowerCase(); // Coluna Loja

    // Verifica se o input é um número (ID)
    if (searchInput && !isNaN(searchInput)) {
      // Se for um número, procura apenas pelo ID
      if (idTalao.includes(searchInput)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    } else {
      // Se não for um número, procura pelo nome da loja
      if (lojaTalao.includes(searchInput)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
};

window.excluirTalao = function (id) {
  const taloes = JSON.parse(localStorage.getItem("taloes")) || [];
  const talaoIndex = taloes.findIndex((t) => t.id === id);

  if (talaoIndex !== -1) {
    if (confirm("Você tem certeza que deseja excluir este talão?")) {
      taloes.splice(talaoIndex, 1); // Remove o talão do array
      localStorage.setItem("taloes", JSON.stringify(taloes)); // Atualiza o localStorage
      alert("Talão excluído com sucesso.");
      showTaloes(); // Atualiza a lista de talões
    }
  } else {
    alert("Talão não encontrado.");
  }
};

window.exportarTalao = function (id) {
  const taloes = JSON.parse(localStorage.getItem("taloes")) || [];
  const talao = taloes.find((t) => t.id === id);

  if (!talao) {
    alert("Talão não encontrado.");
    return;
  }

  // Criar o conteúdo CSV
  const csvContent =
    `data:text/csv;charset=utf-8,` +
    "ID,Loja,Data,Hora,Quantidade,Status\n" + // Cabeçalho
    `${talao.id},${talao.loja},${talao.data},${new Date(
      talao.data
    ).toLocaleTimeString("pt-BR")},${talao.quantidade},${talao.status}\n`;

  // Codifica o conteúdo CSV
  const encodedUri = encodeURI(csvContent);

  // Cria um link e simula o download
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `talao_${talao.id}.csv`);
  document.body.appendChild(link); // Necessário para o Firefox

  link.click(); // Simula o clique para download
  document.body.removeChild(link); // Remove o link do DOM
};

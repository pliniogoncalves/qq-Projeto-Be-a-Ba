// Função para mostrar a seção de Talões
window.showTaloes = function () {
    const content = document.getElementById("mainContent");
    content.innerHTML = `
      <h1 class="text-center">Gestão de Talões</h1>
      
      <!-- Seção de Envio de Talões -->
      <div class="section">
        <h2>Envio de Talões</h2>
        <div class="container mb-4">
            <div class="row justify-content-center">
                <div class="col-md-8 col-sm-12 mb-4">
                    <div class="input-group">
                        <input type="text" class="form-control" id="envioSearchInput" placeholder="Procurar por talão">
                        <button class="btn btn-custom" type="button" onclick="buscarEnvio()">Buscar</button>
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
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="envioTableBody">
                    <tr>
                        <td>1</td>
                        <td>Loja A</td>
                        <td>Dez 6, 2023</td>
                        <td><span class="badge bg-success">Enviado</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary" onclick="detalhesEnvio(1)">Detalhes</button>
                        </td>
                    </tr>
                    <!-- Adicione mais talões conforme necessário -->
                </tbody>
            </table>
        </div>
        <div class="text-center mb-4">
            <button class="btn btn-custom" type="button" onclick="cadastrarEnvio()">Registrar Novo Envio</button>
        </div>
      </div>
  
      <!-- Seção de Recebimento de Talões -->
      <div class="section">
        <h2>Recebimento de Talões</h2>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Loja</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="recebimentoTableBody">
                    <tr>
                        <td>1</td>
                        <td>Loja A</td>
                        <td>Dez 6, 2023</td>
                        <td><span class="badge bg-success">Recebido</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary" onclick="detalhesRecebimento(1)">Detalhes</button>
                        </td>
                    </tr>
                    <!-- Adicione mais talões conforme necessário -->
                </tbody>
            </table>
        </div>
        <div class="text-center mb-4">
            <button class="btn btn-custom" type="button" onclick="cadastrarRecebimento()">Registrar Novo Recebimento</button>
        </div>
      </div>
  
      <!-- Seção de Manutenção de Talões -->
      <div class="section">
        <h2>Manutenção de Talões</h2>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Loja</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="manutencaoTableBody">
                    <tr>
                        <td>1</td>
                        <td>Loja A</td>
                        <td>Dez 6, 2023</td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editarManutencao(1)">Editar</button>
                        </td>
                    </tr>
                    <!-- Adicione mais talões conforme necessário -->
                </tbody>
            </table>
        </div>
      </div>
    `;

    setActiveButton("Talões");
  };
  
  // Função para buscar envios
  window.buscarEnvio = function () {
    const searchInput = document.getElementById("envioSearchInput").value.toLowerCase();
    const tableBody = document.getElementById("envioTableBody");
    const rows = tableBody.getElementsByTagName("tr");
  
    for (let i = 0; i < rows.length; i++) {
      const loja = rows[i].getElementsByTagName("td")[1].textContent.toLowerCase();
  
      if (loja.includes(searchInput)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  };
  
  // Função para cadastrar novo envio
  window.cadastrarEnvio = function () {
    const content = document.getElementById("mainContent");
    content.innerHTML = `
          <div class="form-container">
          <h1 class="h4 mb-4">Novo Envio de Talão</h1>
          <form id="envioForm" onsubmit="salvarEnvio(event)">
              <div class="mb-3">
                  <label for="lojaEnvio" class="form-label">Loja</label>
                  <input type="text" class="form-control" id="lojaEnvio" placeholder="Digite o nome da loja" required>
              </div>
              <div class="mb-3">
                  <label for="dataEnvio" class="form-label">Data</label>
                  <input type="date" class="form-control" id="dataEnvio" required>
              </div>
              <button type="submit" class="btn btn-submit">Registrar Envio</button>
          </form>
      </div>
      `;
  };
  
  // Função para salvar envio
  window.salvarEnvio = function (event) {
    event.preventDefault();
    const loja = document.getElementById("lojaEnvio").value;
    const data = document.getElementById("dataEnvio").value;
  
    // Aqui você pode implementar a lógica para salvar os dados em um banco de dados ou array
    alert(`Envio registrado para ${loja} na data ${data}`);
  
    // Voltar para a lista de talões
    showTaloes();
  };
  
  // Função para detalhes do envio
  window.detalhesEnvio = function (id) {
    // Aqui você pode implementar a lógica para mostrar detalhes de um envio específico
    alert(`Mostrando detalhes do envio com ID: ${id}`);
  };
  
  // Função para cadastrar novo recebimento
  window.cadastrarRecebimento = function () {
    const content = document.getElementById("mainContent");
    content.innerHTML = `
          <div class="form-container">
          <h1 class="h4 mb-4">Novo Recebimento de Talão</h1>
          <form id="recebimentoForm" onsubmit="salvarRecebimento(event)">
              <div class="mb-3">
                  <label for="lojaRecebimento" class="form-label">Loja</label>
                  <input type="text" class="form-control" id="lojaRecebimento" placeholder="Digite o nome da loja" required>
              </div>
              <div class="mb-3">
                  <label for="dataRecebimento" class="form-label">Data</label>
                  <input type="date" class="form-control" id="dataRecebimento" required>
              </div>
              <button type="submit" class="btn btn-submit">Registrar Recebimento</button>
          </form>
      </div>
      `;
  };
  
  // Função para salvar recebimento
  window.salvarRecebimento = function (event) {
    event.preventDefault();
    const loja = document.getElementById("lojaRecebimento").value;
    const data = document.getElementById("dataRecebimento").value;
  
    // Aqui você pode implementar a lógica para salvar os dados em um banco de dados ou array
    alert(`Recebimento registrado para ${loja} na data ${data}`);
  
    // Voltar para a lista de talões
    showTaloes();
  };
  
  // Função para detalhes do recebimento
  window.detalhesRecebimento = function (id) {
    // Aqui você pode implementar a lógica para mostrar detalhes de um recebimento específico
    alert(`Mostrando detalhes do recebimento com ID: ${id}`);
  };
  
  // Função para editar manutenção
  window.editarManutencao = function (id) {
    // Aqui você pode implementar a lógica para editar a manutenção de um talão
    alert(`Editando manutenção do talão com ID: ${id}`);
  };
  
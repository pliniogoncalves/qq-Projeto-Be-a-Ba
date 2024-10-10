window.showTaloes = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
        <h1 class="text-center">Lista de Talões</h1>
        <p class="text-center">Veja a lista de Talões solicitados e suas respectivas situações.</p>

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
                        <th>talão</th>
                        <th>Talões</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Extrato</th>
                        <th>Relatório</th>
                    </tr>
                </thead>
                <tbody id="talaoTableBody">
                    <tr>
                        <td>talao 1</td>
                        <td>68</td>
                        <td>Dez 6, 2023</td>
                        <td><span class="badge bg-success">Talões Enviados</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary">Extrato</button>
                            
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-info">Relatório</button>
                        </td>
                    </tr>
                    <!-- Adicione mais talaos conforme necessário -->
                </tbody>
            </table>
        </div>

        <div class="text-center mb-4">
            <button class="btn btn-custom" type="button" onclick="cadastrarTalao()">Solicitar Talão</button>
        </div>
    `;

  setActiveButton("talaos");
};

window.buscarTalao = function () {
  const searchInput = document
    .getElementById("talaoSearchInput")
    .value.toLowerCase();
  const tableBody = document.getElementById("talaoTableBody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const nometalao = rows[i]
      .getElementsByTagName("td")[0]
      .textContent.toLowerCase();

    if (nometalao.includes(searchInput)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
};

window.cadastrarTalao = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
        <div class="form-container">
        <h1 class="h4 mb-4">Nova talao</h1>
        <form id="storeForm">
            <div class="mb-3">
                <label for="storeName" class="form-label">Nome do Talão</label>
                <input type="text" class="form-control" id="storeName" placeholder="Digite o nome da talao" required>
            </div>
            <div class="mb-3">
                <label for="storeAddress" class="form-label">Endereço</label>
                <input type="text" class="form-control" id="storeAddress" placeholder="Digite o endereço da talao" required>
            </div>
            <div class="mb-3">
                <label for="storeManager" class="form-label">Gerente da talao</label>
                <input type="text" class="form-control" id="storeManager" placeholder="Digite o nome do gerente" required>
            </div>
            <div class="mb-3">
                <label for="storeEmail" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="storeEmail" placeholder="Digite o e-mail da talao" required>
            </div>
            <div class="mb-3">
                <label for="storePhone" class="form-label">Telefone</label>
                <input type="text" class="form-control" id="storePhone" placeholder="Digite o telefone da talao" required>
            </div>
            <div class="mb-3">
                <label for="storeStatus" class="form-label">Status da talao</label>
                <select id="storeStatus" class="form-select">
                    <option selected>Selecione o status</option>
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Cadastrar talao</button>
        </form>
    </div>
    `;
};

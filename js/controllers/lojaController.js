window.showLojas = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h1 class="text-center">Lista de Lojas</h1>
        <p class="text-center">Veja a lista de Lojas cadastradas e suas respectivas situações.</p>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-sm-12 mb-4">
                    <div class="input-group">
                        <input type="text" class="form-control" id="lojaSearchInput" placeholder="Procurar por loja">
                        <button class="btn btn-custom" type="button" onclick="buscarLoja()">Buscar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Loja</th>
                        <th>Talões</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="lojaTableBody">
                    <tr>
                        <td>Loja 1</td>
                        <td>68</td>
                        <td>Dez 6, 2023</td>
                        <td><span class="badge bg-success">Talões Enviados</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary">Visualizar</button>
                            <button class="btn btn-sm btn-outline-secondary">Extrato</button>
                            <button class="btn btn-sm btn-outline-info">Relatório</button>
                        </td>
                    </tr>
                    <!-- Adicione mais lojas conforme necessário -->
                </tbody>
            </table>
        </div>

        <div class="text-center mb-4">
            <button class="btn btn-custom" type="button" onclick="cadastrarLoja()">Cadastrar Nova Loja</button>
        </div>
    `;

    setActiveButton('Lojas');
}

 window.buscarLoja = function() {
    const searchInput = document.getElementById('lojaSearchInput').value.toLowerCase();
    const tableBody = document.getElementById('lojaTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nomeLoja = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        
        if (nomeLoja.includes(searchInput)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

window.cadastrarLoja = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <div class="form-container">
        <h1 class="h4 mb-4">Nova Loja</h1>
        <form id="storeForm">
            <div class="mb-3">
                <label for="storeName" class="form-label">Nome da Loja</label>
                <input type="text" class="form-control" id="storeName" placeholder="Digite o nome da loja" required>
            </div>
            <div class="mb-3">
                <label for="storeAddress" class="form-label">Endereço</label>
                <input type="text" class="form-control" id="storeAddress" placeholder="Digite o endereço da loja" required>
            </div>
            <div class="mb-3">
                <label for="storeManager" class="form-label">Gerente da Loja</label>
                <input type="text" class="form-control" id="storeManager" placeholder="Digite o nome do gerente" required>
            </div>
            <div class="mb-3">
                <label for="storeEmail" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="storeEmail" placeholder="Digite o e-mail da loja" required>
            </div>
            <div class="mb-3">
                <label for="storePhone" class="form-label">Telefone</label>
                <input type="text" class="form-control" id="storePhone" placeholder="Digite o telefone da loja" required>
            </div>
            <div class="mb-3">
                <label for="storeStatus" class="form-label">Status da Loja</label>
                <select id="storeStatus" class="form-select">
                    <option selected>Selecione o status</option>
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Cadastrar Loja</button>
        </form>
    </div>
    `;
}
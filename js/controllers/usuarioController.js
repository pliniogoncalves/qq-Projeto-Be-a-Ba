window.showUsuarios = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h1 class="text-center">Lista de Usuários</h1>
        <p class="text-center">Veja a lista de usuários cadastrados e suas respectivas situações.</p>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-sm-12 mb-4">
                    <div class="input-group">
                        <input type="text" class="form-control" id="userSearchInput" placeholder="Procurar por usuário">
                        <button class="btn btn-custom" type="button" onclick="buscarUsuario()">Buscar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Função</th>
                        <th>Data</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="userTableBody">
                    <tr>
                        <td>Usuário 1</td>
                        <td>Logista</td>
                        <td>Feb 21, 2024</td>
                        <td>usuario1@verdecard.com.br</td>
                        <td>
                            <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarUsuario('Usuário 1')"></i>
                            <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirUsuario('Usuário 1')"></i>
                        </td>
                    </tr>
                    <!-- Adicione mais usuários conforme necessário -->
                </tbody>
            </table>
        </div>

        <div class="text-center mb-4">
            <button class="btn btn-custom" type="button" onclick="cadastrarUsuario()">Cadastrar Novo Usuário</button>
        </div>
    `;

    setActiveButton('Usuários');
}

window.buscarUsuario = function() {
    const searchInput = document.getElementById('userSearchInput').value.toLowerCase();
    const tableBody = document.getElementById('userTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nomeUsuario = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        
        if (nomeUsuario.includes(searchInput)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

window.cadastrarUsuario = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
    <div class="form-container">
        <h1 class="h4 mb-4">Novo Usuário</h1>
        <form id="userForm">
            <div class="mb-3">
                <label for="username" class="form-label">Nome do Usuário</label>
                <input type="text" class="form-control" id="username" placeholder="Digite o nome de usuário">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" placeholder="Digite o e-mail">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Senha</label>
                <input type="password" class="form-control" id="password" placeholder="Digite a senha">
            </div>
            <div class="mb-3">
                <label for="matricula" class="form-label">Matrícula</label>
                <input type="text" class="form-control" id="matricula" placeholder="Digite a Matrícula">
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Cargo</label>
                <input type="text" class="form-control" id="role" placeholder="Digite o cargo">
            </div>
            <div class="mb-3">
                <label for="function" class="form-label">Função</label>
                <select id="function" class="form-select">
                    <option selected>Selecione uma função</option>
                    <option value="1">Admin</option>
                    <option value="2">Usuário</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="company" class="form-label">Loja</label>
                <select id="company" class="form-select">
                    <option selected>Selecione uma empresa</option>
                    <option value="1">Loja 1</option>
                    <option value="2">Loja 2</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Cadastrar Usuário</button>
        </form>
    </div>
    `;
}
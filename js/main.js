function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    // Alterna a classe 'active' para mostrar/esconder a sidebar
    sidebar.classList.toggle('active');
    
    // Se a sidebar estiver ativa, o conteúdo será empurrado
    if (sidebar.classList.contains('active')) {
        mainContent.classList.add('active');
    } else {
        mainContent.classList.remove('active');
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    // Verifica se o menu está ativo e se o clique foi fora da sidebar ou do botão de toggle
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('active');
        document.getElementById('mainContent').classList.remove('active');
    }
});

function showLojas() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h1 class="h2">Lista de Lojas</h1>
        <p>Veja a lista de Lojas cadastradas e suas respectivas situações.</p>

        <div class="input-group mb-4">
            <input type="text" class="form-control" id="lojaSearchInput" placeholder="Procurar por loja">
            <button class="btn btn-custom" type="button" onclick="buscarLoja()">Buscar</button>
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Loja</th>
                    <th>Talões</th>
                    <th>Data do Pedido</th>
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
        
        <button class="btn btn-primary" onclick="cadastrarLoja()">Cadastrar Nova Loja</button>
    `;

    setActiveButton('Lojas');
}

function buscarLoja() {
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

function cadastrarLoja() {
    window.location.href = "cadastrar_loja.html"; // Redireciona para a página de cadastro de loja (caso exista)
}


function showUsuarios() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h1 class="h4 mb-4">Lista de Usuários</h1>
        
        <div class="input-group mb-4">
            <input type="text" class="form-control" id="userSearchInput" placeholder="Procurar por usuário">
            <button class="btn btn-custom" type="button" onclick="buscarUsuario()">Buscar</button>
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Função</th>
                    <th>Data de Cadastro</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="userTableBody">
                <tr>
                    <td>SupervisorESG</td>
                    <td>Supervisor</td>
                    <td>Feb 21, 2024</td>
                    <td>supervisorESG@sfiec.org.br</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary">Editar</button>
                        <button class="btn btn-sm btn-outline-danger">Excluir</button>
                    </td>
                </tr>
                <!-- Adicione mais usuários conforme necessário -->
            </tbody>
        </table>
        
        <button class="btn btn-primary" onclick="cadastrarUsuario()">Cadastrar Novo Usuário</button>
    `;

    setActiveButton('Usuários');
}

function buscarUsuario() {
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

function cadastrarUsuario() {
    window.location.href = "cadastrar_usuario.html";
}

function showPerfis() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Gestão de Perfis de Acesso</h2>
        <p>Gerencie os perfis de acesso dos usuários.</p>
    `;

    setActiveButton('Perfis de Acesso');
}

function showAjuda() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Ajuda</h2>
        <p>Encontre respostas para suas dúvidas.</p>
    `;

    setActiveButton('Ajuda');
}

function showConfiguracoes() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Configurações</h2>
        <p>Altere as configurações do sistema.</p>
    `;

    setActiveButton('Configurações');
}

function setActiveButton(activeSection) {
    // Remove a classe 'active' de todos os botões
    const buttons = document.querySelectorAll('.nav-item .btn-custom');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const bottomButtons = document.querySelectorAll('.bottom-links .btn-custom, .bottom-links .btn-danger');
    bottomButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Adiciona a classe 'active' ao botão da seção ativa
    const activeButton = [...buttons, ...bottomButtons].find(button => button.textContent.trim() === activeSection);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


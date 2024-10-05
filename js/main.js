function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        mainContent.classList.add('active');
    } else {
        mainContent.classList.remove('active');
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('active');
        document.getElementById('mainContent').classList.remove('active');
    }
});

function showDashboard() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Dashboard</h2>
        <p>Visualize o Dashboard.</p>
    `;

    setActiveButton('Dashboard');
}

function showLojas() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h1>Lista de Lojas</h1>
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
        
        <div class="text-center mb-4">
            <button class="btn btn-custom" type="button" onclick="cadastrarLoja()">Cadastrar Nova Loja</button>
        </div>
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
    window.location.href = "cadastrar_loja.html";
}


function showUsuarios() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h1>Lista de Usuários</h1>
<p>Veja a lista de usuários cadastrados e suas respectivas situações.</p>
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

<div class="text-center mb-4">
    <button class="btn btn-custom" type="button" onclick="cadastrarUsuario()">Cadastrar Novo Usuário</button>
</div>
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
    const buttons = document.querySelectorAll('.nav-item .btn-custom');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const bottomButtons = document.querySelectorAll('.bottom-links .btn-custom, .bottom-links .btn-danger');
    bottomButtons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = [...buttons, ...bottomButtons].find(button => button.textContent.trim() === activeSection);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


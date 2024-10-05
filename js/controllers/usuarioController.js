import { Usuario } from "../models/Usuario.js";

window.showUsuarios = function() {
    const content = document.getElementById('mainContent');
    const usuarios = Usuario.listarUsuarios();
    
    let tableRows = '';
    usuarios.forEach(user => {
      tableRows += `
        <tr>
          <td>${user.nome}</td>
          <td>${user.perfil}</td>
          <td>${user.matricula}</td>
          <td>${user.email}</td>
          <td>
            <i class="fas fa-edit" style="cursor: pointer; margin-right: 10px;" onclick="editarUsuario(${user.id})"></i>
            <i class="fas fa-trash" style="cursor: pointer;" onclick="excluirUsuario(${user.id})"></i>
          </td>
        </tr>
      `;
    });
  
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
              <th>Matricula</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="userTableBody">
            ${tableRows}
          </tbody>
        </table>
      </div>
      <div class="text-center mb-4">
        <button class="btn btn-custom" type="button" onclick="cadastrarUsuario()">Cadastrar Novo Usuário</button>
      </div>
    `;
  
    setActiveButton('Usuários');
}

window.cadastrarUsuario = function() {
    const content = document.getElementById('mainContent');
    
    content.innerHTML = `
      <div class="form-container">
        <h1 class="h4 mb-4">Novo Usuário</h1>
        <form id="userForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome do Usuário</label>
            <input type="text" class="form-control" id="nome" placeholder="Digite o nome de usuário">
          </div>
          <div class="mb-3">
            <label for="matricula" class="form-label">Matrícula</label>
            <input type="number" class="form-control" id="matricula" placeholder="Digite a Matrícula">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input type="text" class="form-control" id="email" placeholder="Digite o e-mail">
          </div>
          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
            <input type="password" class="form-control" id="senha" placeholder="Digite a senha">
          </div>
          <div class="mb-3">
            <label for="funcao" class="form-label">Função</label>
            <select id="funcao" class="form-select">
              <option value="Estoque">Estoque</option>
              <option value="Gerente">Gerente</option>
              <option value="AdminRoot">Admin Root</option>
            </select>
          </div>
          <button type="button" class="btn btn-submit" onclick="submitCadastro()">Cadastrar Usuário</button>
        </form>
      </div>
    `;
  }
  
window.submitCadastro = function() {
    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const perfil = document.getElementById('funcao').value;
  
    if (nome && matricula && email && senha) {
      Usuario.criarUsuario(nome, matricula, email, senha, perfil);
      showUsuarios();  // Voltar para a lista de usuários após o cadastro
    } else {
      alert("Preencha todos os campos.");
    }
}
  
window.editarUsuario = function(id) {
    const usuario = Usuario.usuarios.find(user => user.id === id);
    const content = document.getElementById('mainContent');
  
    content.innerHTML = `
      <div class="form-container">
        <h1 class="h4 mb-4">Editar Usuário</h1>
        <form id="userForm">
          <div class="mb-3">
            <label for="username" class="form-label">Nome do Usuário</label>
            <input type="text" class="form-control" id="username" value="${usuario.nome}">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" class="form-control" id="email" value="${usuario.email}">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input type="password" class="form-control" id="password" placeholder="Digite a nova senha (opcional)">
          </div>
          <div class="mb-3">
            <label for="role" class="form-label">Função</label>
            <select id="role" class="form-select">
              <option value="Estoque" ${usuario.perfil === 'Estoque' ? 'selected' : ''}>Estoque</option>
              <option value="Gerente" ${usuario.perfil === 'Gerente' ? 'selected' : ''}>Gerente</option>
              <option value="AdminRoot" ${usuario.perfil === 'AdminRoot' ? 'selected' : ''}>Admin Root</option>
            </select>
          </div>
          <button type="button" class="btn btn-submit" onclick="submitEdicao(${id})">Salvar Alterações</button>
        </form>
      </div>
    `;
}
  
window.submitEdicao = function(id) {
    const nome = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value || null;
    const perfil = document.getElementById('role').value;
  
    Usuario.atualizarUsuario(id, nome, email, senha, perfil);
    showUsuarios();  // Voltar para a lista de usuários após a edição
}

window.excluirUsuario = function(id) {
    if (confirm("Você tem certeza que deseja excluir este usuário?")) {
      Usuario.excluirUsuario(id);
      showUsuarios();  // Atualizar a lista de usuários após a exclusão
    }
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


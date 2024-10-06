import { Usuario } from "../models/Usuario.js";

window.showUsuarios = function() {
  const content = document.getElementById('mainContent');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));  
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []; 

  let tableRows = '';

  // Filtra usuários com base no perfil do usuário logado
  const usuariosFiltrados = usuarios.filter(user => {
      if (usuarioLogado.perfil === 'AdminRoot') {
          return true;  // AdminRoot vê todos os usuários
      } else {
          return user.loja === usuarioLogado.loja;  // Gerente e Estoque veem apenas os usuários da sua loja
      }
  });

  usuariosFiltrados.forEach(user => {
      if (user && user.perfil) {  // Verifica se 'user' existe e se 'perfil' está definido
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
      } else {
          console.error("Usuário inválido encontrado: ", user);  // Log para depuração
      }
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
                  <th>Matrícula</th>
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
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Controle de Acesso
  if (!usuarioLogado || (usuarioLogado.perfil !== 'AdminRoot' && usuarioLogado.perfil !== 'Gerente')) {
      alert("Você não tem permissão para cadastrar novos usuários.");
      return;
  }

  const isAdminRoot = usuarioLogado.perfil === 'AdminRoot';  // Verifica se o logado é AdminRoot

  const content = document.getElementById('mainContent');

  // Obter a lista de lojas do Local Storage (ou definir um array de lojas)
  const lojas = ['Loja 1', 'Loja 2', 'Loja 3'];

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
        <input type="email" class="form-control" id="email" placeholder="Digite o e-mail">
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
          <option value="AdminRoot" ${!isAdminRoot ? 'disabled' : ''}>Admin Root</option>
        </select>
      </div>
      <div class="mb-3" id="loja-container">
        <label for="loja" class="form-label">Loja</label>
        <select id="loja" class="form-select">
          ${isAdminRoot ? `
          <option value="Todas as lojas">Todas as lojas</option>
          ${lojas.map(loja => `<option value="${loja}">${loja}</option>`).join('')}
          ` : `
          <option value="${usuarioLogado.loja}" selected>${usuarioLogado.loja}</option>
          `}
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
  let loja = document.getElementById('loja').value;

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));  // Recupera o usuário logado

  // Definir a loja com base no perfil
  if (perfil === 'AdminRoot') {
      loja = 'Todas as lojas';  // AdminRoot deve ser "Todas as lojas"
  } else if (usuarioLogado.perfil === 'Gerente') {
      loja = usuarioLogado.loja;  // Gerente deve cadastrar na sua loja
  }

  // Verificar se todos os campos estão preenchidos
  if (!nome || !matricula || !email || !senha || !perfil || !loja) {
      alert("Preencha todos os campos.");
      return;
  }

  // Criar o novo usuário
  Usuario.criarUsuario(nome, matricula, email, senha, perfil, loja);
  showUsuarios();  // Exibir a lista de usuários após o cadastro
}
  
window.editarUsuario = function(id) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));  
  const usuario = Usuario.usuarios.find(user => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || (usuarioLogado.perfil !== 'AdminRoot' && usuarioLogado.perfil !== 'Gerente')) {
      alert("Você não tem permissão para editar este usuário.");
      return;
  }

  const content = document.getElementById('mainContent');

  // Armazenar a lista de lojas
  const lojas = ['Loja 1', 'Loja 2', 'Loja 3'];

  content.innerHTML = `
  <div class="form-container">
      <h1 class="h4 mb-4">Editar Usuário</h1>
      <form id="userForm">
          <div class="mb-3">
              <label for="nome" class="form-label">Nome do Usuário</label>
              <input type="text" class="form-control" id="nome" value="${usuario.nome}">
          </div>
          <div class="mb-3">
              <label for="matricula" class="form-label">Matrícula</label>
              <input type="text" class="form-control" id="matricula" value="${usuario.matricula}">
          </div>
          <div class="mb-3">
              <label for="email" class="form-label">E-mail</label>
              <input type="email" class="form-control" id="email" value="${usuario.email}">
          </div>
          <div class="mb-3">
              <label for="senha" class="form-label">Senha</label>
              <input type="password" class="form-control" id="senha" placeholder="Digite a nova senha (opcional)">
          </div>
          <div class="mb-3">
              <label for="funcao" class="form-label">Função</label>
              <select id="funcao" class="form-select">
                  ${usuarioLogado.perfil === 'AdminRoot' ? `
                  <option value="Estoque" ${usuario.perfil === 'Estoque' ? 'selected' : ''}>Estoque</option>
                  <option value="Gerente" ${usuario.perfil === 'Gerente' ? 'selected' : ''}>Gerente</option>
                  <option value="AdminRoot" ${usuario.perfil === 'AdminRoot' ? 'selected' : ''}>Admin Root</option>
                  ` : `
                  <option value="Estoque" ${usuario.perfil === 'Estoque' ? 'selected' : ''}>Estoque</option>
                  <option value="Gerente" ${usuario.perfil === 'Gerente' ? 'selected' : ''}>Gerente</option>
                  `}
              </select>
          </div>
          <div class="mb-3">
              <label for="loja" class="form-label">Loja</label>
              <select id="loja" class="form-select">
                  ${usuarioLogado.perfil === 'AdminRoot' ? `
                  <option value="Todas as lojas" ${usuario.loja === 'Todas as lojas' ? 'selected' : ''}>Todas as lojas</option>
                  ${lojas.map(loja => `
                  <option value="${loja}" ${usuario.loja === loja ? 'selected' : ''}>${loja}</option>
                  `).join('')}
                  ` : `
                  <option value="${usuario.loja}" selected>${usuario.loja}</option>
                  `}
              </select>
          </div>
          <button type="button" class="btn btn-submit" onclick="submitEdicao(${id})">Salvar Alterações</button>
      </form>
  </div>
  `;
}

window.submitEdicao = function(id) {
  const nome = document.getElementById('nome').value;
  const matricula = document.getElementById('matricula').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value || null; // Permite senha vazia
  const perfil = document.getElementById('funcao').value;
  const loja = document.getElementById('loja').value;

  // Verificar se todos os campos estão preenchidos
  if (!nome || !matricula || !email || !perfil || !loja) {
      alert("Preencha todos os campos.");
      return;
  }

  // Atualizar o usuário
  Usuario.atualizarUsuario(id, nome, matricula, email, senha, perfil, loja);
  showUsuarios();  // Exibir a lista de usuários após a edição
}

window.excluirUsuario = function(id) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usuario = Usuario.usuarios.find(user => user.id === id);

  // Controle de Acesso
  if (!usuarioLogado || (usuarioLogado.perfil !== 'AdminRoot' && usuarioLogado.perfil !== 'Gerente')) {
      alert("Você não tem permissão para excluir este usuário.");
      return;
  }

    if (confirm("Você tem certeza que deseja excluir este usuário?")) {
      Usuario.excluirUsuario(id);
      showUsuarios();
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


export class Usuario {
    static usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];  // Carregar do localStorage
  
    constructor(nome, matricula, email, senha, perfil, loja = null) {
      this.id = Usuario.usuarios.length + 1;  // Atribuir ID único
      this.nome = nome;
      this.matricula = matricula;
      this.email = email;
      this.senha = senha;
      this.perfil = perfil;  // 'Gerente', 'Estoque', 'AdminRoot'
      this.loja = loja;      // Loja específica (apenas para Gerentes e Estoque)
    }
  
    // Método para salvar usuários no localStorage
    static salvarNoLocalStorage() {
      localStorage.setItem('usuarios', JSON.stringify(Usuario.usuarios));
    }
  
    // CREATE: Adicionar um novo usuário
    static criarUsuario(nome, matricula, email, senha, perfil, loja = null) {
      const novoUsuario = new Usuario(nome, matricula, email, senha, perfil, loja);
      Usuario.usuarios.push(novoUsuario);
      Usuario.salvarNoLocalStorage();
      return novoUsuario;
    }
  
    // READ: Listar todos os usuários
    static listarUsuarios() {
      return Usuario.usuarios;
    }
  
    // UPDATE: Atualizar informações de um usuário existente
    static atualizarUsuario(id, novoNome, novaMatricula, novoEmail, novaSenha, novoPerfil, novaLoja = null) {
      const usuario = Usuario.usuarios.find(user => user.id === id);
      if (usuario) {
        usuario.nome = novoNome || usuario.nome;
        usuario.matricula = novaMatricula || usuario.matricula;
        usuario.email = novoEmail || usuario.email;
        usuario.senha = novaSenha || usuario.senha;
        usuario.perfil = novoPerfil || usuario.perfil;
        usuario.loja = novaLoja || usuario.loja;
        Usuario.salvarNoLocalStorage();
      }
    }
  
    // DELETE: Remover um usuário
    static excluirUsuario(id) {
      Usuario.usuarios = Usuario.usuarios.filter(user => user.id !== id);
      Usuario.salvarNoLocalStorage();
    }
  }
  
export class Usuario {
  static usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  static nextId = Usuario.usuarios.length > 0 ? Math.max(...Usuario.usuarios.map(u => u.id)) + 1 : 1;

  constructor(nome, matricula, email, senha, perfil = null, loja = null) {
    this.id = Usuario.nextId;
    this.nome = nome;
    this.matricula = matricula;
    this.email = email;
    this.senha = senha;
    this.perfil = perfil; 
    this.loja = loja; 
    Usuario.nextId++;
  }

  // Método para salvar usuários no localStorage
  static salvarNoLocalStorage() {
    localStorage.setItem("usuarios", JSON.stringify(Usuario.usuarios));
  }

  // Validação de dados únicos: verificar duplicação de matrícula ou email
  static validarDuplicidade(matricula, email) {
    return Usuario.usuarios.some(user => user.matricula === matricula || user.email === email);
  }

  // CREATE: Adicionar um novo usuário com validação
  static criarUsuario(nome, matricula, email, senha, perfil = null, loja = null) {
    if (Usuario.validarDuplicidade(matricula, email)) {
      mostrarModal("Matrícula ou email já cadastrados.");
      return null;
    }

    const novoUsuario = new Usuario(nome, matricula, email, senha, perfil, loja);
    Usuario.usuarios.push(novoUsuario);
    Usuario.salvarNoLocalStorage();
    mostrarModal(`Usuário ${nome} criado com sucesso!`);
    return novoUsuario;
  }

  // READ: Listar todos os usuários
  static listarUsuarios() {
    return Usuario.usuarios;
  }

  // UPDATE: Atualizar informações de um usuário existente
  static atualizarUsuario(id, novoNome, novaMatricula, novoEmail, novaSenha, novoPerfil = null, novaLoja = null, senhaAtual) {
    const usuario = Usuario.usuarios.find(user => user.id === id);
    if (!usuario) {
      mostrarModal("Usuário não encontrado.");
      return;
    }

    // Verificar se a senha atual está correta antes de permitir mudanças sensíveis
    if (senhaAtual && usuario.senha !== senhaAtual) {
      mostrarModal("Senha atual incorreta.");
      return;
    }

    // Verificar duplicação de email ou matrícula
    if ((novaMatricula && novaMatricula !== usuario.matricula && Usuario.validarDuplicidade(novaMatricula, null)) ||
      (novoEmail && novoEmail !== usuario.email && Usuario.validarDuplicidade(null, novoEmail))) {
      mostrarModal("Matrícula ou email já cadastrados.");
      return;
    }

    usuario.nome = novoNome || usuario.nome;
    usuario.matricula = novaMatricula || usuario.matricula;
    usuario.email = novoEmail || usuario.email;
    usuario.senha = novaSenha || usuario.senha;
    usuario.perfil = novoPerfil || usuario.perfil;
    usuario.loja = novaLoja || usuario.loja;
    Usuario.salvarNoLocalStorage();
    mostrarModal(`Usuário ${usuario.nome} atualizado com sucesso!`);
  }

  // DELETE: Remover um usuário
  static excluirUsuario(id) {
    Usuario.usuarios = Usuario.usuarios.filter(user => user.id !== id);
    Usuario.salvarNoLocalStorage();
    mostrarModal("Usuário removido com sucesso!");
  }

  // Método para garantir que sempre exista um AdminRoot no sistema
  static inicializarAdmin() {
    const adminExists = Usuario.usuarios.some(user => user.perfil === "AdminRoot");
    if (!adminExists) {
      Usuario.criarUsuario("Admin", "000000", "admin@admin.com", "admin", "AdminRoot", "Matriz");
      console.log("Usuário AdminRoot padrão criado!");
    }
  }
}

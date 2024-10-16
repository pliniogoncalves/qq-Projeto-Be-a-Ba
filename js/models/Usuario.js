export class Usuario {
  static usuarios = JSON.parse(localStorage.getItem("usuarios")) || []; // Carregar do localStorage

  constructor(nome, matricula, email, senha, perfil, loja = null) {
    this.id = Usuario.usuarios.length + 1; // Atribuir ID único
    this.nome = nome;
    this.matricula = matricula;
    this.email = email;
    this.senha = senha;
    this.perfil = perfil; // 'Gerente', 'Estoque', 'AdminRoot'
    this.loja = loja; // Loja específica (apenas para Gerentes e Estoque)
  }

  // Método para salvar usuários no localStorage
  static salvarNoLocalStorage() {
    localStorage.setItem("usuarios", JSON.stringify(Usuario.usuarios));
  }

  // CREATE: Adicionar um novo usuário
  static criarUsuario(nome, matricula, email, senha, perfil, loja = null) {
    const novoUsuario = new Usuario(
      nome,
      matricula,
      email,
      senha,
      perfil,
      loja
    );
    Usuario.usuarios.push(novoUsuario);
    Usuario.salvarNoLocalStorage();
    alert(`Usuário ${nome} criado com sucesso!`);
    return novoUsuario;
  }

  // READ: Listar todos os usuários
  static listarUsuarios() {
    return Usuario.usuarios;
  }

  // UPDATE: Atualizar informações de um usuário existente
  static atualizarUsuario(
    id,
    novoNome,
    novaMatricula,
    novoEmail,
    novaSenha,
    novoPerfil,
    novaLoja = null
  ) {
    const usuario = Usuario.usuarios.find((user) => user.id === id);
    if (usuario) {
      usuario.nome = novoNome || usuario.nome;
      usuario.matricula = novaMatricula || usuario.matricula;
      usuario.email = novoEmail || usuario.email;
      usuario.senha = novaSenha || usuario.senha;
      usuario.perfil = novoPerfil || usuario.perfil;
      usuario.loja = novaLoja || usuario.loja;
      Usuario.salvarNoLocalStorage();
      alert(`Usuário ${usuario.nome} atualizado com sucesso!`);
    }
  }

  // DELETE: Remover um usuário
  static excluirUsuario(id) {
    Usuario.usuarios = Usuario.usuarios.filter((user) => user.id !== id);
    Usuario.salvarNoLocalStorage();
    alert(`Usuário removido com sucesso!`);
  }

  //Função para removerperfil do usuario
  static removerPerfil(id) {
    const usuario = Usuario.usuarios.find((user) => user.id === id);
    if (usuario) {
      usuario.perfil = null; // Ou atribuir um valor padrão
      Usuario.salvarNoLocalStorage();
      alert(`Perfil removido do usuário ${usuario.nome} com sucesso!`);
    } else {
      alert(`Usuário com ID ${id} não encontrado.`);
    }
  }

  //Função para vincular perfil ao usuário
  static vincularPerfil(usuarioId, perfilId) {
    const usuario = Usuario.usuarios.find((u) => u.id === usuarioId);
    if (usuario) {
      usuario.perfil = perfilId; // Atualiza o perfil do usuário
      Usuario.salvarNoLocalStorage(); // Salva as alterações
      alert(
        `Perfil com ID ${perfilId} vinculado ao usuário ${usuario.nome} com sucesso!`
      );
    } else {
      alert(`Usuário com ID ${usuarioId} não encontrado.`);
    }
  }

  // Função para solicitar talões
  solicitarTalao(quantidade) {
    console.log(
      `${this.nome} solicitou ${quantidade} talões para a loja ${
        this.loja || "todas as lojas"
      }.`
    );
  }

  // Função para verificar o estoque
  verificarEstoque(quantidadeAtual) {
    console.log(
      `Estoque atual de talões na loja ${
        this.loja || "todas as lojas"
      }: ${quantidadeAtual}`
    );
  }

  // Função para confirmar o recebimento de talões
  receberTalao(quantidade) {
    console.log(
      `${this.nome} confirmou o recebimento de ${quantidade} talões na loja ${
        this.loja || "todas as lojas"
      }.`
    );
  }

  // Método para garantir que sempre exista um AdminRoot no sistema
  static inicializarAdmin() {
    if (Usuario.usuarios.length === 0) {
      // Se não houver usuários, cria um AdminRoot padrão
      Usuario.criarUsuario(
        "Admin",
        "000000",
        "admin@admin.com",
        "admin",
        "AdminRoot",
        "Todas as lojas"
      );
      console.log("Usuário AdminRoot padrão criado!");
    }
  }
}

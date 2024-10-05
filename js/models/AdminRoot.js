import { Usuario } from "../models/Usuario.js";

class AdminRoot extends Usuario {
    constructor(nome, matricula, email, senha) {
      super(nome, matricula, email, senha, 'AdminRoot');  // Chama o construtor da classe pai
    }
  
    // Admin pode adicionar funcionários em qualquer loja
    adicionarFuncionario(nome, matricula, email, senha, perfil, loja = null) {
      Usuario.criarUsuario(nome, matricula, email, senha, perfil, loja);
      console.log(`Funcionário ${nome} adicionado com sucesso.`);
    }
  
    // Admin pode listar todos os usuários
    listarTodosUsuarios() {
      console.log("Lista de todos os usuários:");
      Usuario.listarUsuarios().forEach(user => {
        console.log(`ID: ${user.id}, Nome: ${user.nome}, Perfil: ${user.perfil}, Loja: ${user.loja || 'N/A'}`);
      });
    }
  
    // Admin pode excluir qualquer funcionário
    excluirFuncionario(id) {
      Usuario.excluirUsuario(id);
      console.log(`Funcionário com ID ${id} removido com sucesso.`);
    }
  
    // Admin pode atualizar qualquer usuário
    atualizarFuncionario(id, novoNome, novaMatricula, novoEmail, novaSenha, novoPerfil, novaLoja) {
      Usuario.atualizarUsuario(id, novoNome, novaMatricula, novoEmail, novaSenha, novoPerfil, novaLoja);
      console.log(`Funcionário com ID ${id} atualizado com sucesso.`);
    }
  }
  
import { Usuario } from "../models/Usuario.js";

class Gerente extends Usuario {
  constructor(nome, matricula, email, senha, loja) {
    super(nome, matricula, email, senha, "Gerente", loja);
  }

  // Método para adicionar um novo funcionário
  adicionarFuncionario(nome, email, senha, perfil) {
    if (perfil === "Estoque" || perfil === "Gerente") {
      Usuario.criarUsuario(nome, matricula, email, senha, perfil, this.loja);
      console.log(
        `Funcionário ${nome} adicionado com sucesso na ${this.loja}.`
      );
    } else {
      console.error("Perfil não permitido.");
    }
  }

  // Método para modificar o perfil de um funcionário
  modificarPerfilFuncionario(idFuncionario, novoPerfil) {
    const funcionario = Usuario.usuarios.find(
      (user) => user.id === idFuncionario
    );

    if (funcionario && funcionario.loja === this.loja) {
      if (novoPerfil === "Estoque" || novoPerfil === "Gerente") {
        funcionario.perfil = novoPerfil;
        Usuario.salvarNoLocalStorage();
        console.log(
          `Perfil de ${funcionario.nome} alterado para ${novoPerfil}.`
        );
      } else {
        console.error("Perfil inválido.");
      }
    } else {
      console.error("Funcionário não encontrado ou de outra loja.");
    }
  }
}

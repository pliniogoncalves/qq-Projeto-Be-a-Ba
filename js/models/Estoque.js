import { Usuario } from "../models/Usuario.js";

class Estoque extends Usuario {
  constructor(nome, matricula, email, senha) {
    super(nome, matricula, email, senha, "Estoque", loja);
  }
}

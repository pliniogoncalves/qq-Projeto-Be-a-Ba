// Estoque.js

export class Estoque {
  constructor(id_estoque, id_loja, quantidade_recomendada, quantidade_minima, quantidade_atual, frequenciaAlerta = "mensal") {
    this.id_estoque = id_estoque;
    this.id_loja = id_loja;
    this.quantidade_recomendada = quantidade_recomendada;
    this.quantidade_minima = quantidade_minima;
    this.quantidade_atual = quantidade_atual;  // Nova propriedade
    this.frequenciaAlerta = frequenciaAlerta;
    this.status = this.verificarEstoque(); // Status inicial
  }

  // Verifica se o estoque está baixo
  estoqueBaixo() {
    return this.quantidade_atual <= this.quantidade_minima;
  }

   // Verifica se o estoque é médio
   estoqueMedio() {
    return this.quantidade_atual > this.quantidade_minima && this.quantidade_atual < this.quantidade_recomendada;
  }

   // Verifica se o estoque está adequado
   estoqueAdequado() {
    return this.quantidade_atual >= this.quantidade_recomendada;
  }

  // Configurações de alerta de estoque
  definirFrequenciaAlerta(frequencia) {
    this.frequenciaAlerta = frequencia;
  }

  obterFrequenciaAlerta() {
    switch (this.frequenciaAlerta) {
      case "semanal":
        return 7;
      case "quinzenal":
        return 15;
      case "mensal":
        return 30;
      default:
        return null;
    }
  }

   // Verifica o nível do estoque
   verificarEstoque() {
    if (this.estoqueBaixo()) {
      return "Estoque baixo";
    } else if (this.estoqueMedio()) {
      return "Estoque médio";
    } else {
      return "Estoque adequado";
    }
  }

  // Atualiza o status para "estoque baixo"
  atualizarStatus(novoStatus) {
    this.status = novoStatus;
  }
}

export class Estoque {
  constructor(id_estoque, id_loja, quantidade_recomendada, quantidade_minima, frequenciaAlerta = "mensal") {
    this.id_estoque = id_estoque; // Identificador único do estoque
    this.id_loja = id_loja; // Identificador da loja associada
    this.quantidade_recomendada = quantidade_recomendada;
    this.quantidade_minima = quantidade_minima;
    this.frequenciaAlerta = frequenciaAlerta; // "semanal", "quinzenal" ou "mensal"
  }

  // Verifica se o estoque está baixo
  estoqueBaixo() {
    return this.quantidade_minima < this.quantidade_recomendada;
  }

  // Configurações de alerta de estoque
  definirFrequenciaAlerta(frequencia) {
    this.frequenciaAlerta = frequencia; // Opções: semanal, quinzenal, mensal
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

  // Exibe mensagem de alerta com a frequência configurada
  verificarEstoque() {
    if (this.estoqueBaixo()) {
      const diasParaAlerta = this.obterFrequenciaAlerta();
      return `Alerta: Estoque abaixo do recomendado! Atualize em ${diasParaAlerta} dias.`;
    } else {
      return `Estoque em nível adequado.`;
    }
  }
}

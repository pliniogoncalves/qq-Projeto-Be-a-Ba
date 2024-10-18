export class Estoque {
  constructor(
    id_estoque,
    id_loja,
    quantidade_recomendada,
    quantidade_minima,
    quantidade_atual
  ) {
    this.id_estoque = id_estoque; // Identificador único do estoque
    this.id_loja = id_loja; // Identificador da loja associada
    this.quantidade_recomendada = quantidade_recomendada;
    this.quantidade_minima = quantidade_minima;
    this.quantidade_atual = quantidade_atual;
  }

  estoqueBaixo() {
    return this.quantidade_atual <= this.quantidade_minima;
  }

  estoqueMedio() {
    return (
      this.quantidade_atual > this.quantidade_minima &&
      this.quantidade_atual < this.quantidade_recomendada
    );
  }

  estoqueSuficiente() {
    return this.quantidade_atual >= this.quantidade_recomendada;
  }

  // Função para reduzir o estoque
  reduzirEstoque(quantidade) {
    if (this.quantidade_atual - quantidade < 0) {
      return `Erro: Quantidade insuficiente em estoque.`;
    } else {
      this.quantidade_atual -= quantidade;

      // Retornar o status atualizado do estoque
      if (this.estoqueBaixo()) {
        return "Estoque Baixo";
      } else if (this.estoqueMedio()) {
        return "Estoque Médio";
      } else {
        return "Estoque Suficiente";
      }
    }
  }

  // Atualiza as quantidades do estoque
  atualizarEstoque(
    novaQuantidadeAtual,
    novaQuantidadeMinima,
    novaQuantidadeRecomendada
  ) {
    this.quantidade_atual = novaQuantidadeAtual;
    this.quantidade_minima = novaQuantidadeMinima;
    this.quantidade_recomendada = novaQuantidadeRecomendada;
  }

  // Retorna uma mensagem se o estoque está abaixo do mínimo
  verificarEstoque() {
    if (this.estoqueBaixo()) {
      return `Alerta: Estoque baixo! Quantidade atual: ${this.quantidade_atual}, mínimo recomendado: ${this.quantidade_minima}.`;
    } else if (this.estoqueMedio()) {
      return `Atenção: Estoque médio. Quantidade atual: ${this.quantidade_atual}, recomendado: ${this.quantidade_recomendada}.`;
    } else {
      return `Estoque em nível adequado. Quantidade atual: ${this.quantidade_atual}.`;
    }
  }

  // Simulação de uma transação para reduzir o estoque
  reduzirEstoque(quantidade) {
    if (this.quantidade_atual - quantidade < 0) {
      return `Erro: Não é possível reduzir. Quantidade insuficiente em estoque.`;
    } else {
      this.quantidade_atual -= quantidade;
      return `Estoque atualizado. Quantidade atual: ${this.quantidade_atual}`;
    }
  }

  // Simulação de uma transação para adicionar ao estoque
  adicionarEstoque(quantidade) {
    this.quantidade_atual += quantidade;
    return `Estoque atualizado. Quantidade atual: ${this.quantidade_atual}`;
  }
}

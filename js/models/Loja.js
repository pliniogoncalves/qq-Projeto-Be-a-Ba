export class Loja {
  static lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  static nextId = Loja.lojas.length > 0 ? Math.max(...Loja.lojas.map((l) => l.id)) + 1 : 1;

  constructor(nome, numero, quantidadeMinima = 0, quantidadeRecomendada = 0, frequenciaAlerta = "mensal") {
    this.id = Loja.nextId;
    this.nome = nome;
    this.numero = numero; // supondo que o número é uma string
    this.quantidadeMinima = quantidadeMinima;
    this.quantidadeRecomendada = quantidadeRecomendada;
    this.quantidadeAtual = quantidadeAtual;
    this.frequenciaAlerta = frequenciaAlerta; // "semanal", "quinzenal" ou "mensal"
    Loja.nextId++;
  }

  // Método para salvar lojas no localStorage
  static salvarNoLocalStorage() {
    localStorage.setItem("lojas", JSON.stringify(Loja.lojas));
  }

  // CREATE: Adicionar uma nova Loja
  static criarLoja(nome, numero, quantidadeMinima = 0, quantidadeRecomendada = 0, quantidadeAtual = 0, frequenciaAlerta = "mensal") {
    const novaLoja = new Loja(nome, numero, quantidadeMinima, quantidadeRecomendada, quantidadeAtual, frequenciaAlerta);
    Loja.lojas.push(novaLoja);
    Loja.salvarNoLocalStorage();
    mostrarModal(`${nome} criada com sucesso!`);
    return novaLoja;
  }

  // READ: Listar todas as lojas
  static listarLojas() {
    return Loja.lojas;
  }

  // UPDATE: Atualizar uma Loja existente
  static atualizarLoja(id, novoNome, novoNumero, novaQuantidadeMinima, novaQuantidadeRecomendada, novaQuantidadeAtual, novaFrequenciaAlerta) {
    const loja = Loja.lojas.find((l) => l.id === id);
    if (!loja) {
      mostrarModal("Loja não encontrada.");
      return;
    }

    loja.nome = novoNome || loja.nome;
    loja.numero = novoNumero || loja.numero;
    loja.quantidadeMinima = novaQuantidadeMinima !== undefined ? novaQuantidadeMinima : loja.quantidadeMinima;
    loja.quantidadeRecomendada = novaQuantidadeRecomendada !== undefined ? novaQuantidadeRecomendada : loja.quantidadeRecomendada;
    loja.quantidadeAtual = novaQuantidadeAtual !== undefined ? novaQuantidadeAtual : loja.quantidadeAtual;
    loja.frequenciaAlerta = novaFrequenciaAlerta || loja.frequenciaAlerta;

    Loja.salvarNoLocalStorage();
    mostrarModal(`${loja.nome} atualizada com sucesso!`);
  }

  // DELETE: Remover uma Loja
  static excluirLoja(id) {
    Loja.lojas = Loja.lojas.filter((l) => l.id !== id);
    Loja.salvarNoLocalStorage();
    mostrarModal("Loja removida com sucesso!");
  }
}

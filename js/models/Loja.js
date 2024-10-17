export class Loja {
    static lojas = JSON.parse(localStorage.getItem("lojas")) || [];
    static nextId = Loja.lojas.length > 0 ? Math.max(...Loja.lojas.map((l) => l.id)) + 1 : 1;
  
    constructor(nome, numero) {
      this.id = Loja.nextId;
      this.nome = nome;
      this.numero = numero; // supondo que o número é uma string
      Loja.nextId++;
    }
  
    // Método para salvar lojas no localStorage
    static salvarNoLocalStorage() {
      localStorage.setItem("lojas", JSON.stringify(Loja.lojas));
    }
  
    // CREATE: Adicionar um novo Loja
    static criarLoja(nome, numero) {
      const novaLoja = new Loja(nome, numero);
      Loja.lojas.push(novaLoja);
      Loja.salvarNoLocalStorage();
      alert(`Loja ${nome} criada com sucesso!`);
      return novaLoja;
    }
  
    // READ: Listar todas as lojas
    static listarLojas() {
      return Loja.lojas;
    }
  
    // UPDATE: Atualizar uma Loja existente
    static atualizarLoja(id, novoNome, novonumero) {
      const loja = Loja.lojas.find((l) => l.id === id);
      if (!loja) {
        alert("Loja não encontrada.");
        return;
      }
  
      loja.nome = novoNome || loja.nome;
      loja.numero = novonumero || loja.numero; // Atualiza apenas se novonumero for fornecido
      Loja.salvarNoLocalStorage();
      alert(`Loja ${loja.nome} atualizada com sucesso!`);
    }
  
    // DELETE: Remover uma Loja
    static excluirLoja(id) {
      Loja.lojas = Loja.lojas.filter((l) => l.id !== id);
      Loja.salvarNoLocalStorage();
      alert("Loja removida com sucesso!");
    }
  }
  
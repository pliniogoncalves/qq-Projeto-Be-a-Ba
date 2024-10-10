export class Talao {
  static taloes = JSON.parse(localStorage.getItem("taloes")) || []; // Carregar do localStorage

  constructor(loja, data, quantidade, status = "Enviado") {
    // Se não houver talões, iniciar o ID como 1
    this.id = Talao.taloes.length > 0 ? Talao.taloes[Talao.taloes.length - 1].id + 1 : 1; 
    this.loja = loja;
    this.data = data; // Data e hora já devem ser armazenadas no formato ISO
    this.quantidade = quantidade; // Armazenar a quantidade de talões
    this.status = status; // Status do talão (Enviado, Recebido, etc.)
  }

  // Método para salvar talões no localStorage
  static salvarNoLocalStorage() {
    localStorage.setItem("taloes", JSON.stringify(Talao.taloes));
  }

  // CREATE: Adicionar um novo talão
  static criarTalao(loja, data, quantidade, status = "Enviado") {
    const novoTalao = new Talao(loja, data, quantidade, status);
    Talao.taloes.push(novoTalao);
    Talao.salvarNoLocalStorage();
    alert(`Talão criado para a loja ${loja} na data ${data} com quantidade ${quantidade}!`);
    return novoTalao;
  }

  // READ: Listar todos os talões
  static listarTaloes() {
    return Talao.taloes;
  }

  // UPDATE: Atualizar informações de um talão existente
  static atualizarTalao(id, novaLoja, novaData, novaQuantidade, novoStatus) {
    const talao = Talao.taloes.find((t) => t.id === id);
    if (talao) {
      talao.loja = novaLoja || talao.loja;
      talao.data = novaData || talao.data; // Atualiza a data e hora
      talao.quantidade = novaQuantidade || talao.quantidade; // Atualiza a quantidade de talões
      talao.status = novoStatus || talao.status;
      Talao.salvarNoLocalStorage();
      alert(`Talão da loja ${talao.loja} atualizado com sucesso!`);
    } else {
      alert("Talão não encontrado.");
    }
  }

  // DELETE: Remover um talão
  static excluirTalao(id) {
    const talaoIndex = Talao.taloes.findIndex(t => t.id === id);
    if (talaoIndex !== -1) {
      Talao.taloes.splice(talaoIndex, 1); // Remove o talão do array
      Talao.salvarNoLocalStorage();
      alert(`Talão removido com sucesso!`);
    } else {
      alert("Talão não encontrado.");
    }
  }
}

export class Talao {
  static taloes = JSON.parse(localStorage.getItem("taloes")) || []; // Carregar do localStorage

  constructor(loja, dataHora, quantidade, status = "Enviado") {
    this.id = Talao.gerarId(); // Gera um ID único
    this.loja = loja;
    this.dataHora = dataHora; // Data e hora no formato ISO
    this.quantidade = quantidade; // Quantidade de talões
    this.status = status; // Status do talão (Solicitado, Enviado, Recebido)
    this.timestamps = {
      solicitado: null,
      enviado: dataHora, // Definido no momento de criação
      recebido: null,
    };
  }

  // Método para gerar um ID único
  static gerarId() {
    const ids = Talao.taloes.map((t) => t.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  // Método para salvar talões no localStorage
  static salvarNoLocalStorage() {
    localStorage.setItem("taloes", JSON.stringify(Talao.taloes));
  }

  // CREATE: Adicionar um novo talão
  static criarTalao(loja, dataHora, quantidade, status = "Enviado") {
    const novoTalao = new Talao(loja, dataHora, quantidade, status);
    Talao.taloes.push(novoTalao);
    Talao.salvarNoLocalStorage();
    alert(
      `Talão criado para a loja ${loja} na data ${new Date(
        dataHora
      ).toLocaleString()} com quantidade ${quantidade}!`
    );
    return novoTalao;
  }

  // READ: Listar todos os talões
  static listarTaloes() {
    return Talao.taloes;
  }

  // Método para buscar um talão pelo ID
  static buscarTalao(id) {
    return Talao.taloes.find((talao) => talao.id === id);
  }

  // UPDATE: Atualizar informações de um talão existente
  static atualizarTalao(
    id,
    novaLoja,
    novaDataHora,
    novaQuantidade,
    novoStatus
  ) {
    const talao = Talao.taloes.find((t) => t.id === id);
    if (talao) {
      talao.loja = novaLoja || talao.loja;
      talao.dataHora = novaDataHora || talao.dataHora;
      talao.quantidade = novaQuantidade || talao.quantidade;

      if (novoStatus && novoStatus !== talao.status) {
        talao.status = novoStatus;
        talao.timestamps[novoStatus.toLowerCase()] = new Date().toISOString();
      }

      Talao.salvarNoLocalStorage();
      alert(`Talão da loja ${talao.loja} atualizado com sucesso!`);
    } else {
      alert("Talão não encontrado.");
    }
  }

  // DELETE: Remover um talão
  static excluirTalao(id) {
    const talaoIndex = Talao.taloes.findIndex((t) => t.id === id);
    if (talaoIndex !== -1) {
      Talao.taloes.splice(talaoIndex, 1); // Remove o talão do array
      Talao.salvarNoLocalStorage();
      alert(`Talão removido com sucesso!`);
    } else {
      alert("Talão não encontrado.");
    }
  }

  // EXPORT: Exportar todos os talões para CSV
  static exportarTodosTaloesCSV() {
    if (Talao.taloes.length === 0) {
      alert("Não há talões para exportar.");
      return;
    }

    const header = "ID,Loja,Data,Hora,Quantidade,Status\n";
    const rows = Talao.taloes
      .map((talao) => {
        const data = new Date(talao.dataHora);
        const dataStr = data.toLocaleDateString("pt-BR");
        const horaStr = data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${talao.id},${talao.loja},${dataStr},${horaStr},${talao.quantidade},${talao.status}`;
      })
      .join("\n");

    const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `taloes_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  }
}

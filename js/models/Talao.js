export class Talao {
  static taloes = JSON.parse(localStorage.getItem("taloes")) || []; // Carregar do localStorage

  constructor(loja, dataHora, quantidade, funcionario, status = "Solicitado") {
    this.id = Talao.gerarId(); // Gera um ID único
    this.loja = loja;
    this.dataHora = dataHora; // Data e hora no formato ISO
    this.quantidade = quantidade; // Quantidade de talões
    this.status = status; // Status do talão (Solicitado, Enviado, Recebido)
    this.timestamps = {
      solicitado: {
        dataHora: dataHora,
        funcionario: funcionario,
      },
      enviado: null,
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
  static criarTalao(
    loja,
    dataHora,
    quantidade,
    funcionario,
    status = "Solicitado"
  ) {
    const novoTalao = new Talao(
      loja,
      dataHora,
      quantidade,
      funcionario,
      status
    );
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
    return Talao.taloes.find((talao) => talao.id === Number(id));
  }

  // UPDATE: Atualizar informações de um talão existente
  static atualizarTalao(
    id,
    novaLoja,
    novaDataHora,
    novaQuantidade,
    novoStatus,
    funcionario
  ) {
    const talao = Talao.taloes.find((t) => t.id === Number(id));
    if (talao) {
      talao.loja = novaLoja || talao.loja;
      talao.dataHora = novaDataHora || talao.dataHora;
      talao.quantidade = novaQuantidade || talao.quantidade;

      if (novoStatus && novoStatus !== talao.status) {
        talao.status = novoStatus;
        const agora = new Date().toISOString();
        if (novoStatus === "Enviado") {
          talao.timestamps.enviado = {
            dataHora: agora,
            funcionario: funcionario,
          };
        } else if (novoStatus === "Recebido") {
          talao.timestamps.recebido = {
            dataHora: agora,
            funcionario: funcionario,
          };
        }
      }

      Talao.salvarNoLocalStorage();
      alert(`Talão da loja ${talao.loja} atualizado com sucesso!`);
    } else {
      alert("Talão não encontrado.");
    }
  }

  // DELETE: Remover um talão
  static excluirTalao(id) {
    const talaoIndex = Talao.taloes.findIndex((t) => t.id === Number(id));
    if (talaoIndex !== -1) {
      Talao.taloes.splice(talaoIndex, 1);
      Talao.salvarNoLocalStorage();
      alert(`Talão removido com sucesso!`);
    } else {
      alert("Talão não encontrado.");
    }
  }

  // EXPORT: Exportar todos os talões para CSV, incluindo as atualizações
  static exportarTodosTaloesCSV() {
    if (Talao.taloes.length === 0) {
      alert("Não há talões para exportar.");
      return;
    }

    const header =
      "ID,Loja,Data Solicitado,Funcionario Solicitante,Data Enviado,Funcionario Enviou,Data Recebido,Funcionario Recebeu,Quantidade,Status\n";
    const rows = Talao.taloes
      .map((talao) => {
        const dataSolicitado = talao.timestamps.solicitado
          ? new Date(talao.timestamps.solicitado.dataHora).toLocaleString(
              "pt-BR"
            )
          : "";
        const funcionarioSolicitante =
          talao.timestamps.solicitado?.funcionario || "";

        const dataEnviado = talao.timestamps.enviado
          ? new Date(talao.timestamps.enviado.dataHora).toLocaleString("pt-BR")
          : "";
        const funcionarioEnviou = talao.timestamps.enviado?.funcionario || "";

        const dataRecebido = talao.timestamps.recebido
          ? new Date(talao.timestamps.recebido.dataHora).toLocaleString("pt-BR")
          : "";
        const funcionarioRecebeu = talao.timestamps.recebido?.funcionario || "";

        return `${talao.id},${talao.loja},${dataSolicitado},${funcionarioSolicitante},${dataEnviado},${funcionarioEnviou},${dataRecebido},${funcionarioRecebeu},${talao.quantidade},${talao.status}`;
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

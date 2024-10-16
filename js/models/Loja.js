export class Loja {
    static lojas = JSON.parse(localStorage.getItem("lojas")) || []; // Carregar lojas do localStorage
    static nextId = Loja.lojas.length > 0 ? Math.max(...Loja.lojas.map(l => l.id)) + 1 : 1; // Gerar próximo ID único

    constructor(nome, endereco) {
        this.id = Loja.nextId; // Atribuir ID único
        this.nome = nome;
        this.endereco = endereco; // Array com os endereços da Loja
        Loja.nextId++; // Incrementa o próximo ID para o próximo Loja
    }

    // Método para salvar lojas no localStorage
    static salvarNoLocalStorage() {
        localStorage.setItem("lojas", JSON.stringify(Loja.lojas));
    }

    // CREATE: Adicionar um novo Loja
    static criarLoja(nome, endereco) {
        const novoLoja = new Loja(nome, endereco);
        Loja.lojas.push(novoLoja);
        Loja.salvarNoLocalStorage();
        alert(`Loja ${nome} criado com sucesso!`);
        return novoLoja;
    }

    // READ: Listar todos os lojas
    static listarlojas() {
        return Loja.lojas;
    }

    // UPDATE: Atualizar um Loja existente
    static atualizarLoja(id, novoNome, novoEndereco) {
        const Loja = Loja.lojas.find((l) => l.id === id);
        if (Loja) {
            Loja.nome = novoNome || Loja.nome;
            Loja.endereco = novoEndereco || Loja.endereco;
            Loja.salvarNoLocalStorage();
            alert(`Loja ${Loja.nome} atualizado com sucesso!`);
        } else {
            alert(`Loja com ID ${id} não encontrado.`);
        }
    }

    // DELETE: Remover um Loja
    static excluirLoja(id) {
        Loja.lojas = Loja.lojas.filter((l) => l.id !== id);
        Loja.salvarNoLocalStorage();
        alert(`Loja removido com sucesso!`);
    }
}

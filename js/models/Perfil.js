export class Perfil {
    static perfis = JSON.parse(localStorage.getItem("perfis")) || []; // Carregar perfis do localStorage
    static nextId = Perfil.perfis.length > 0 ? Math.max(...Perfil.perfis.map(p => p.id)) + 1 : 1; // Gerar próximo ID único

    constructor(nome, permissoes) {
        this.id = Perfil.nextId; // Atribuir ID único
        this.nome = nome;
        this.permissoes = permissoes; // Array de permissões
        Perfil.nextId++; // Incrementa o próximo ID para o próximo perfil
    }

    // Método para salvar perfis no localStorage
    static salvarNoLocalStorage() {
        localStorage.setItem("perfis", JSON.stringify(Perfil.perfis));
    }

    // CREATE: Adicionar um novo perfil
    static criarPerfil(nome, permissoes) {
        const novoPerfil = new Perfil(nome, permissoes);
        Perfil.perfis.push(novoPerfil);
        Perfil.salvarNoLocalStorage();
        alert(`Perfil ${nome} criado com sucesso!`);
        return novoPerfil;
    }

    // READ: Listar todos os perfis
    static listarPerfis() {
        return Perfil.perfis;
    }

    // READ: Obter um perfil por ID
    static obterPerfilPorId(id) {
        const perfil = Perfil.perfis.find(p => p.id === id);
        if (!perfil) {
            throw new Error('Perfil não encontrado');
        }
        return perfil;
    }

    // UPDATE: Atualizar um perfil existente
    static atualizarPerfil(id, novoNome, novasPermissoes) {
        const perfil = Perfil.perfis.find((p) => p.id === id);
        if (perfil) {
            perfil.nome = novoNome || perfil.nome;
            perfil.permissoes = novasPermissoes || perfil.permissoes;
            Perfil.salvarNoLocalStorage();
            alert(`Perfil ${perfil.nome} atualizado com sucesso!`);
        } else {
            alert(`Perfil com ID ${id} não encontrado.`);
        }
    }

    // DELETE: Remover um perfil
    static excluirPerfil(id) {
        Perfil.perfis = Perfil.perfis.filter((p) => p.id !== id);
        Perfil.salvarNoLocalStorage();
        alert(`Perfil removido com sucesso!`);
    }
}

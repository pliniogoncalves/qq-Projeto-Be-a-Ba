export class Perfil {
    static perfis = JSON.parse(localStorage.getItem("perfis")) || [];
    static nextId = Perfil.perfis.length > 0 ? Math.max(...Perfil.perfis.map(p => p.id)) + 1 : 1;
  
    constructor(nome, permissoes) {
      this.id = Perfil.nextId;
      this.nome = nome;
      this.permissoes = Array.isArray(permissoes) ? permissoes : []; // Garantir que seja um array
      Perfil.nextId++;
    }
  
    // Método para salvar perfis no localStorage
    static salvarNoLocalStorage() {
      localStorage.setItem("perfis", JSON.stringify(Perfil.perfis));
    }
  
    // CREATE: Adicionar um novo perfil com validação
    static criarPerfil(nome, permissoes) {
      if (!Array.isArray(permissoes) || permissoes.length === 0) {
        alert("Permissões inválidas. Por favor, adicione pelo menos uma permissão.");
        return null;
      }
  
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
        throw new Error("Perfil não encontrado");
      }
      return perfil;
    }
  
    // UPDATE: Atualizar um perfil existente
    static atualizarPerfil(id, novoNome, novasPermissoes) {
      const perfil = Perfil.perfis.find(p => p.id === id);
      if (!perfil) {
        alert("Perfil não encontrado.");
        return;
      }
  
      perfil.nome = novoNome || perfil.nome;
      perfil.permissoes = Array.isArray(novasPermissoes) ? novasPermissoes : perfil.permissoes;
      Perfil.salvarNoLocalStorage();
      alert(`Perfil ${perfil.nome} atualizado com sucesso!`);
    }
  
    // DELETE: Remover um perfil
    static excluirPerfil(id) {
      Perfil.perfis = Perfil.perfis.filter(p => p.id !== id);
      Perfil.salvarNoLocalStorage();
      alert("Perfil removido com sucesso!");
    }
  }
  
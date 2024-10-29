// Dados simulados para o dashboard
const dadosDashboard = {
  usuariosTotal: 120,
  usuariosPorPerfil: {
      admin: 10,
      gerente: 30,
      colaborador: 80
  },
  lojas: 5,
  taloesEstoque: 350,
  taloesEnviados: [
      { data: '2024-10-01', loja: 'Loja 1', quantidade: 50 },
      { data: '2024-10-05', loja: 'Loja 2', quantidade: 30 },
      { data: '2024-10-10', loja: 'Loja 3', quantidade: 40 }
  ],
  taloesRecebidos: [
      { data: '2024-10-03', loja: 'Loja 1', quantidade: 45 },
      { data: '2024-10-07', loja: 'Loja 2', quantidade: 35 }
  ],
  estoqueMinimo: 100,  // Estoque mínimo recomendado
  autenticacao: {
      sessoesAtivas: 12,
      timeout: "15 minutos"
  }
};

// Função para exibir o dashboard
window.showDashboard = function () {
  historico.push({ funcao: showDashboard });
  const content = document.getElementById("mainContent");

  // Atualiza a seção principal com dados do dashboard
  content.innerHTML = `
      <div class="overlay" id="overlay"></div>
      <h1 class="text-center">Dashboard Administrativo</h1>
      <p class="text-center">Resumo das atividades e status do sistema.</p>

      <!-- Cards de Visão Geral -->
      <div class="container my-4">
          <div class="row">
              <div class="col-md-3 mb-4">
                  <div class="card bg-primary text-white">
                      <div class="card-body">
                          <h5>Usuários Cadastrados</h5>
                          <p id="usuariosTotal">${dadosDashboard.usuariosTotal}</p>
                          <small>Admin: ${dadosDashboard.usuariosPorPerfil.admin}</small><br>
                          <small>Gerentes: ${dadosDashboard.usuariosPorPerfil.gerente}</small><br>
                          <small>Colaboradores: ${dadosDashboard.usuariosPorPerfil.colaborador}</small>
                      </div>
                  </div>
              </div>
              <div class="col-md-3 mb-4">
                  <div class="card bg-success text-white">
                      <div class="card-body">
                          <h5>Lojas Registradas</h5>
                          <p id="lojasTotal">${dadosDashboard.lojas}</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-3 mb-4">
                  <div class="card bg-warning text-white">
                      <div class="card-body">
                          <h5>Talões em Estoque</h5>
                          <p id="taloesEstoque">${dadosDashboard.taloesEstoque}</p>
                          ${dadosDashboard.taloesEstoque < dadosDashboard.estoqueMinimo ? 
                          '<small class="text-danger">Estoque baixo!</small>' : 
                          '<small class="text-info">Estoque suficiente</small>'}
                      </div>
                  </div>
              </div>
              <div class="col-md-3 mb-4">
                  <div class="card bg-info text-white">
                      <div class="card-body">
                          <h5>Sessões Ativas</h5>
                          <p id="sessoesAtivas">${dadosDashboard.autenticacao.sessoesAtivas}</p>
                          <small>Timeout: ${dadosDashboard.autenticacao.timeout}</small>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Tabela de Envios de Talões -->
      <div class="container my-4">
          <h3>Histórico de Envios de Talões</h3>
          <div class="table-responsive">
              <table class="table table-striped">
                  <thead>
                      <tr>
                          <th>Data</th>
                          <th>Loja</th>
                          <th>Quantidade</th>
                      </tr>
                  </thead>
                  <tbody id="taloesEnviadosTableBody">
                      ${dadosDashboard.taloesEnviados.map((envio) => `
                          <tr>
                              <td>${envio.data}</td>
                              <td>${envio.loja}</td>
                              <td>${envio.quantidade}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Tabela de Recebimento de Talões -->
      <div class="container my-4">
          <h3>Histórico de Recebimento de Talões</h3>
          <div class="table-responsive">
              <table class="table table-striped">
                  <thead>
                      <tr>
                          <th>Data</th>
                          <th>Loja</th>
                          <th>Quantidade</th>
                      </tr>
                  </thead>
                  <tbody id="taloesRecebidosTableBody">
                      ${dadosDashboard.taloesRecebidos.map((recebimento) => `
                          <tr>
                              <td>${recebimento.data}</td>
                              <td>${recebimento.loja}</td>
                              <td>${recebimento.quantidade}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Exportação de Relatório -->
      <div class="text-center my-4">
          <button class="btn btn-secondary" onclick="exportarCSV()">Exportar Relatório CSV</button>
      </div>
  `;


setActiveButton("Dashboard");
};

// Função para exportar o histórico de envios e recebimentos em CSV
window.exportarCSV = function () {
  let csvContent = 'Data,Loja,Quantidade,Tipo\n';
  
  // Adiciona envios de talões
  dadosDashboard.taloesEnviados.forEach((envio) => {
      csvContent += `${envio.data},${envio.loja},${envio.quantidade},Envio\n`;
  });
  
  // Adiciona recebimentos de talões
  dadosDashboard.taloesRecebidos.forEach((recebimento) => {
      csvContent += `${recebimento.data},${recebimento.loja},${recebimento.quantidade},Recebimento\n`;
  });

  // Criação do arquivo CSV
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'relatorio_taloes.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Inicializa o dashboard ao carregar a página
document.addEventListener('DOMContentLoaded', showDashboard);
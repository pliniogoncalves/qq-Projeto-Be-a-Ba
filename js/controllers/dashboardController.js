// Função para recuperar dados do localStorage
function recuperarDadosLocalStorage() {
    const lojas = JSON.parse(localStorage.getItem('lojas') || '[]');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const taloes = JSON.parse(localStorage.getItem('taloes') || '[]');
    const perfis = JSON.parse(localStorage.getItem('perfis') || '[]');
    return { lojas, usuarios, taloes, perfis };
}

// Função para exibir o dashboard
window.showDashboard = function () {
    const content = document.getElementById("mainContent");
    const { lojas, usuarios, taloes, perfis } = recuperarDadosLocalStorage();

    // Contagem de usuários por perfil
    const usuariosPorPerfil = perfis.reduce((acc, perfil) => {
        acc[perfil.nome] = usuarios.filter(user => user.perfil === perfil.nome).length;
        return acc;
    }, {});

    // Total de usuários e lojas
    const totalUsuarios = usuarios.length;
    const totalLojas = lojas.length;

    // Calcular estoque total de talões e verificar estoque por loja
    const taloesEmEstoque = lojas.reduce((acc, loja) => acc + (loja.quantidadeAtual || 0), 0);
    const estoqueMinimo = 100; // Exemplo de estoque mínimo

    // Definir valores de sessões ativas e timeout, caso não estejam salvos no localStorage
    const sessoesAtivas = JSON.parse(localStorage.getItem('sessoesAtivas') || '0');
    const timeout = localStorage.getItem('timeout') || '15 minutos';

    // Gerar conteúdo HTML do dashboard
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
                            <p id="usuariosTotal">${totalUsuarios}</p>
                            ${Object.keys(usuariosPorPerfil).map(perfil => `
                                <small>${perfil}: ${usuariosPorPerfil[perfil]}</small><br>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h5>Lojas Registradas</h5>
                            <p id="lojasTotal">${totalLojas}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <h5>Talões em Estoque</h5>
                            <p id="taloesEstoque">${taloesEmEstoque}</p>
                            ${taloesEmEstoque < estoqueMinimo ? 
                            '<small class="text-danger">Estoque baixo!</small>' : 
                            '<small class="text-info">Estoque suficiente</small>'}
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h5>Sessões Ativas</h5>
                            <p id="sessoesAtivas">${sessoesAtivas}</p>
                            <small>Timeout: ${timeout}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráfico de Estoque de Talões por Loja -->
        <div class="container my-4">
            <h3>Estoque de Talões por Loja</h3>
            <canvas id="graficoEstoqueLojas"></canvas>
        </div>

        <!-- Tabela de Envios e Recebimentos de Talões -->
        <div class="container my-4">
            <h3>Histórico de Envios e Recebimentos de Talões</h3>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Loja</th>
                            <th>Quantidade</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody id="historicoTaloesTableBody">
                        ${taloes.map(talao => `
                            <tr>
                                <td>${new Date(talao.dataHora).toLocaleDateString()}</td>
                                <td>${talao.loja}</td>
                                <td>${talao.quantidade}</td>
                                <td>${talao.status}</td>
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
    exibirGraficoEstoque(lojas);
};


// Função para exibir o gráfico de estoque de talões por loja
function exibirGraficoEstoque(lojas) {
    const ctx = document.getElementById('graficoEstoqueLojas').getContext('2d');
    const labels = lojas.map(loja => loja.nome);
    const data = lojas.map(loja => loja.quantidadeAtual);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estoque Atual de Talões',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Função para exportar o histórico de talões em CSV
window.exportarCSV = function () {
    let csvContent = 'Data,Loja,Quantidade,Tipo\n';

    // Adiciona envios e recebimentos de talões
    const { taloes } = recuperarDadosLocalStorage();
    taloes.forEach(talao => {
        csvContent += `${new Date(talao.dataHora).toLocaleDateString()},${talao.loja},${talao.quantidade},${talao.status}\n`;
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

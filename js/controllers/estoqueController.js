window.showEstoque = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
    <div class="overlay" id="overlay"></div>
    <h1 class="text-center">Gestão de Estoque</h1>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Loja</th>
            <th>Quantidade em Estoque</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="estoqueTableBody">
          <tr>
            <td>Loja A</td>
            <td>150</td>
            <td><span class="badge bg-success">Suficiente</span></td>
          </tr>
          <!-- Adicione mais lojas conforme necessário -->
        </tbody>
      </table>
    </div>
  `;

  setActiveButton("Estoque");
};

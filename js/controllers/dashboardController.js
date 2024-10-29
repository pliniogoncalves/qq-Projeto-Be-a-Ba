window.showDashboard = function () {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
        <div class="overlay" id="overlay"></div>
        <h2>Dashboard</h2>
        <p>Visualize o DashBoard</p>
    `;

  setActiveButton("Dashboard");
};

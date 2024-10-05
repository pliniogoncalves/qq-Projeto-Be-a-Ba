window.showDashboard = function() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2>Dashboard</h2>
        <p>Visualize o Dashboard.</p>
    `;

    setActiveButton('Dashboard');
}
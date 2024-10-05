function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        mainContent.classList.add('active');
    } else {
        mainContent.classList.remove('active');
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('active');
        document.getElementById('mainContent').classList.remove('active');
    }
});

function setActiveButton(activeSection) {
    const buttons = document.querySelectorAll('.nav-item .btn-custom');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const bottomButtons = document.querySelectorAll('.bottom-links .btn-custom, .bottom-links .btn-danger');
    bottomButtons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = [...buttons, ...bottomButtons].find(button => button.textContent.trim() === activeSection);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


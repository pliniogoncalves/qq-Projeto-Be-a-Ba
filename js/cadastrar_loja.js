document.getElementById('storeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const storeName = document.getElementById('storeName').value;
    const storeAddress = document.getElementById('storeAddress').value;
    const storeManager = document.getElementById('storeManager').value;
    const storeEmail = document.getElementById('storeEmail').value;
    const storePhone = document.getElementById('storePhone').value;
    const storeStatus = document.getElementById('storeStatus').value;

    // Simulação de envio de dados (logar no console)
    console.log({
        storeName, storeAddress, storeManager, storeEmail, storePhone, storeStatus
    });

    // Redireciona para a lista de lojas após o cadastro
    window.location.href = "index.html"; // Redireciona para a página inicial do dashboard
});

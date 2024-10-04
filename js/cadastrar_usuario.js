document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cpf = document.getElementById('cpf').value;
    const role = document.getElementById('role').value;
    const funcao = document.getElementById('function').value;
    const empresa = document.getElementById('company').value;

    console.log({
        username, email, password, cpf, role, funcao, empresa
    });

    window.location.href = "exibir_usuario.html";
});

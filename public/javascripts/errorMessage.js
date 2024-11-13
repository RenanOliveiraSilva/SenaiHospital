document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    const userEmail = document.getElementById('userEmail').value;
    const userPass = document.getElementById('userPass').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail, userPass }),
        });

        if (!response.ok) {
            // Se a resposta não for bem sucedida, mostra a mensagem de erro
            const errorData = await response.json(); // Lê a mensagem de erro do backend
            const errorMessage = document.getElementById('errorMessage');

            errorMessage.textContent = errorData.mensagem;
            errorMessage.classList.remove('invisible');

        } else {
            const data = await response.json();
            const token = data.token; // O servidor deve enviar o token JWT no campo 'token'

            console.log(token);

            // Armazenar o token no localStorage
            localStorage.setItem('token', token);

            // Redirecionar o usuário ou realizar outra ação
            window.location.href = '../home/index'; // Redirecionar para uma página protegida

        }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = 'Usuário ou senha incorretos.';
            errorMessage.classList.remove('invisible');

            localStorage.clear();

        }
});

async function autenticar(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
  
    const userEmail = document.getElementById("userEmail").value;
    const userPass = document.getElementById("userPass").value;
    
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, userPass }),
      });
     
      
    if (response.ok) {
        const data = await response.json();
        localStorage.clear();

        // Armazena o token no localStorage
        localStorage.setItem("authorization", data.token);
        console.log("A")

        // Redireciona para a página do menu do aluno
        window.location.href = data.redirectTo;
        console.log("B")

    } else {
        
        const errorData = await response.json();
        const errorMessage = document.getElementById('errorMessage');

        errorMessage.textContent = errorData.mensagem;
        errorMessage.classList.remove('invisible');
     
      }
      
    } catch (error) {
        console.error('Erro ao enviar dados:', error);

        
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Usuário ou senha incorretos.';
        errorMessage.classList.remove('invisible');

        localStorage.clear();
    }
  }

// Adiciona o evento de submit ao formulário de login
document.getElementById("loginForm").addEventListener("submit", autenticar);
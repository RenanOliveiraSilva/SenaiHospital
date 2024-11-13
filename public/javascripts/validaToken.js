const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            
        } else {
            fetch('/home/index', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    window.location.href = '/login';
                }
            })
            .catch(error => {
                console.error('Erro ao verificar o token:', error);
                window.location.href = '/login';
            });
        }

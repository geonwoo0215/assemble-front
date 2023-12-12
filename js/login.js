document.addEventListener('DOMContentLoaded',function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit',function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        fetch('http://localhost:8080/member/login',{
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Login filed');
            }

            const token = response.headers.get('Authorization');
            console.log(token);

            if (token) {
                localStorage.setItem('token',token);
            }

            console.log('Login successful');
            window.location.href = "../html/index.html";
        })
        .catch(error => {
            console.error('Error', error);
            alert(error.message);
        });
    });
});
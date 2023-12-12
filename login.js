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

            console.log('Login successful');
        })
        .catch(error => {
            console.error('Error', error);
            alert(error.message);
        });
    });
});
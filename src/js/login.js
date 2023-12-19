document.addEventListener('DOMContentLoaded', function () {
    console.log("apasdf");
    const button = document.getElementById('loginButton');
    console.log(button);
    button.addEventListener('click', function () {
        submitLogin();
    });

    function submitLogin() {
        const loginId = document.getElementById('loginId').value;
        const password = document.getElementById('password').value;

        const data = {
            loginId: loginId,
            password: password
        };

        fetch('http://localhost:8080/member/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }

            const token = response.headers.get('Authorization');
            console.log(token);

            if (token) {
                localStorage.setItem('token', token);
            }

            console.log('Login successful');
        })
        .catch(error => {
            console.error('Error', error);
            alert(error.message);
        });
    }
});
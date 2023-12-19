import Component from "/src/components/Component.js";

export default class LoginForm extends Component {

    template() {
        return `
            <div id="login-form">
                <label for="loginId">아이디:</label>
                <input type="text" id="loginId">
                <label for="password">비밀번호:</label>
                <input type="password" id="password">
                <button id="loginButton">로그인</button>
            </div>
        `;
    }

    setEvent() {
        this.target.querySelector('#loginButton').addEventListener('click', this.loginUser.bind(this));
    }

    async loginUser() {
        const loginId = this.target.querySelector('#loginId').value;
        const password = this.target.querySelector('#password').value;

        const formData = new URLSearchParams();
        formData.append('loginId', loginId);
        formData.append('password', password);
        try {
            const response = await fetch('http://localhost:8080/member/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (response.ok) {
                const token = response.headers.get('Authorization');
                console.log(token);
                if (token) {
                    localStorage.setItem('token', token);
                }
                console.log('로그인 성공');
                window.history.back();
            } else {
                console.error('로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류', error);
        }
    }
}
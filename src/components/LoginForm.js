import Component from "/src/components/Component.js";

export default class LoginForm extends Component {

    constructor(target) {
        super(target);
        this.render();
        this.setEvent();
    }

    template() {
        return `
        <div id="login-form">

            <p class="login-top-text">로그인</p>

            <div class="input-group">
                <label for="loginId"></label>
                <input type="text" id="loginId" class="input-box" placeholder="아이디">
        
                <label for="password"></label>
                <input type="password" id="password" class="input-box" placeholder="비밀번호">
            
                <button id="loginButton">로그인</button>

                <button id="registerButton">회원가입</button>
            </div>

        </div>
        `;
    }

    setEvent() {
        this.target.querySelector('#loginButton').addEventListener('click', this.loginUser.bind(this));
        this.target.querySelector('#registerButton').addEventListener('click', e => {
            window.history.pushState({},"",'/members');
            window.route(e);
        });
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
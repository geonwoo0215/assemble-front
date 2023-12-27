import Component from "/src/components/Component.js";
import Regiter from "/src/components/Register.js";

export default class LoginForm extends Component {

    constructor(target) {
        super(target);
        this.render();
        this.setEvent();
    }

    template() {
        return `
        <div class ="default-form">
            <p class="top-text-middle">로그인</p>
            <div class="login-input">
                <label for="loginId"></label>
                <input type="text" id="loginId" class="input-box" placeholder="아이디">
        
                <label for="password"></label>
                <input type="password" id="password" class="input-box" placeholder="비밀번호">
            
                <button class="loginButton">로그인</button>
                <button class="registerButton">회원가입</button>
            </div>
        </div>
        `;
    }

    setEvent() {
        this.target.querySelector('.loginButton').addEventListener('click', this.loginUser.bind(this));
        this.target.querySelector('.registerButton').addEventListener('click', () => {
            window.history.pushState({},"",'/members');
            const componentInstance = new Regiter(this.target);
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
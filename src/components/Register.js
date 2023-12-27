import Component from "/src/components/Component.js";

export default class Register extends Component {

    static instance;

    constructor(target) {
        if (Register.instance) {
            Register.instance.render();
            return Register.instance;
        }

        super(target);
        this.render();
        this.setEvent();

        Register.instance = this;
    }

    template() {
        return `
        <div class ="default-form">
            <p class = "top-text-middle">Assemble</p>
            <p class = "top-text-middle">회원가입</p>

            <div class="register-input">

                <p>아이디<span>*</span></p>
                <label for="loginId"></label>
                <input type="text" id="loginId" class="registerput-box" placeholder="아이디 입력" required>
            
           
                <p>비밀번호<span>*</span></p>
                <label for="password"></label>
                <input type="password" id="password" class="registerput-box" placeholder="비밀번호" required>
                
                <label for="verifyPassword"></label>
                <input type="password" id="verifyPassword" class="registerput-box" placeholder="비밀번호 확인" required>
        
                <p>이메일<span>*</span></p>
                <label for="email"></label>
                <input type="email" id="email" class="registerput-box" placeholder="이메일" required>
            
                <p>닉네임<span>*</span></p>
                <label for="nickname"></label>
                <input type="text" id="nickname" class="registerput-box" placeholder="닉네임" required>
            
                <button class="registerButton">회원가입</button>
                
            </div>
        </div>

        `;
    }

    setEvent() {
        this.target.querySelector('.registerButton').addEventListener('click', this.register.bind(this))
    }

    async register() {
        try {

            const loginId = this.target.querySelector('#loginId').value;
            const password = this.target.querySelector('#password').value;
            const verifyPassword = this.target.querySelector('#verifyPassword').value;
            const email = this.target.querySelector('#email').value;
            const nickname = this.target.querySelector('#nickname').value;

            const memberSignUpDTO = {
                loginId: loginId,
                password: password,
                email: email,
                nickname: nickname
            };

            if (password !== verifyPassword) {
                console.error('비밀번호 확인이 일치하지 않습니다.');
                return;
            }

            const response = await fetch('http://localhost:8080/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberSignUpDTO),
            });

            if (response.ok) {
                console.log('회원가입 성공');
                window.history.back();
            } else {
                console.error('회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 오류', error);
        }
    }
}
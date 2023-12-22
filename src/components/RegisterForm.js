import Component from "/src/components/Component.js";

export default class RegisterForm extends Component {

    constructor(target) {
        super(target);
        this.render();
        this.setEvent();
    }

    template() {
        return `
        <div id="registration-form">
            <p class = "registration-top-text">Assemble</p>
            <p class = "registration-top-text">회원가입</p>

            <div class="input-group2">

                <p>아이디<span>*</span></p>
                <label for="loginId"></label>
                <input type="text" id="loginId" class="input-box2" placeholder="아이디 입력" required>
            
           
                <p>비밀번호<span>*</span></p>
                <label for="password"></label>
                <input type="password" id="password" class="input-box2" placeholder="비밀번호" required>
                
                <label for="verifyPassword"></label>
                <input type="password" id="verifyPassword" class="input-box2" placeholder="비밀번호 확인" required>
          

            
                <p>이메일<span>*</span></p>
                <label for="email"></label>
                <input type="email" id="email" class="input-box2" placeholder="이메일" required>
            
            
                <p>닉네임<span>*</span></p>
                <label for="nickname"></label>
                <input type="text" id="nickname" class="input-box2" placeholder="닉네임" required>
            
                <button id="registerButton2">회원가입</button>
                
            </div>
        </div>

        `;
    }

    setEvent() {
        this.target.querySelector('#registerButton2').addEventListener('click', this.register.bind(this))
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
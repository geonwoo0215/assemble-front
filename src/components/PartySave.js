import Component from "/src/components/Component.js";

export default class PartySave extends Component {

    static instance;

    constructor(target){

        if (PartySave.instance) {
            PartySave.instance.render();
            PartySave.instance.setEvent();
            return PartySave.instance;
        }

        super(target);
        this.render();
        this.setEvent();
        PartySave.instance = this;
    }

    template() {
        return `
        <div class="default-form">

            <p class="top-text-left">Assemble</p>
            <p class="top-text-left">모임 생성</p>

            <div class="party-input">

                <div class="party-name-input">
                    <label for="name">제목</label>
                    <input type="text" id="name" class="party-name-box" placeholder="제목을 입력해주세요!" required>
                </div>

                    <label for="eventDate">날짜</label>
                    <input type="date" id="eventDate" class="party-save-calender-box"  placeholder="연도-월-일" required>

                <div class="party-content-input">
                    <label for="content">내용</label>
                    <textarea id="content" class="party-content-box"></textarea>
                </div>
                
                
            </div>
            <button class="saveButton">모임 생성하기</button>

        </div>
        `;
    }

    setEvent() {
        this.target.querySelector('.saveButton').addEventListener('click', this.saveParty.bind(this));
    }

    async saveParty() {
        const token = localStorage.getItem("token");

        const name = this.target.querySelector('#name').value;
        const eventDate = this.target.querySelector('#eventDate').value;
        const content = this.target.querySelector('#content').value;

        const partySaveDTO = {
            name: name,
            eventDate: eventDate,
            content: content
        };

        try {
            const response = await fetch('http://localhost:8080/partys' , {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partySaveDTO),
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
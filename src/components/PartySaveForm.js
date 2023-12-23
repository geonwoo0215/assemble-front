import Component from "/src/components/Component.js";

export default class PartySaveForm extends Component {

    constructor(target){
        super(target);
        this.render();
        this.setEvent();
    }

    template() {
        return `
        <div id="party-save-form">

            <h4 class="party-save-top-text">Assemble</h4>

            <p class="party-save-top-text">모임 생성</p>

            <div class="input-group3">
                <div class="input-group">
                    <label for="title"></label>
                    <input type="text" id="title"  placeholder="제목을 입력해주세요!" required>
                </div>
                
                <div class="input-group">
                    <label for="date">날짜</label>
                    <input type="date" id="date"  placeholder="연도-월-일" required>
                </div>

                <div class="accordion">
                    <label for="content">내용</label>
                    <button class="accordion-toggle" aria-expanded="false">^</button>
                    <div class="accordion-content">
                    <textarea id="content"></textarea>
                    </div>
                </div>
                
            </div>
            <button id="partySaveButton">모임 생성하기</button>

        </div>
        `;
    }

    setEvent() {
        const accordionContent = this.target.querySelector('.accordion-content');
        const accordionToggle = this.target.querySelector('.accordion-toggle');
        
        accordionToggle.addEventListener('click', () => {
            const expanded = accordionToggle.getAttribute('aria-expanded') === 'true' || false;
            accordionContent.classList.toggle('active', !expanded);
            accordionToggle.setAttribute('aria-expanded', (!expanded).toString());
            accordionToggle.textContent = expanded ? '^' : 'v';
        });

        this.target.querySelector('#partySaveButton').addEventListener('click', this.saveParty.bind(this));
    }

    async saveParty() {
        const token = localStorage.getItem("token");

        const name = this.target.querySelector('#title').value;
        const date = this.target.querySelector('#date').value;
        const content = this.target.querySelector('#content').value;

        const partySaveDTO = {
            name: name,
            date: date,
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
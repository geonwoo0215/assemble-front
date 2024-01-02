import Component from "/src/components/Component.js";

export default class ExpenseSave extends Component {

    static instance;
    partyId;
    partyMembers;
    constructor(target, partyId){
        if (ExpenseSave.instance) {
            ExpenseSave.instance.setup();
            return ExpenseSave.instance;
        }
        super(target);
        this.partyId = partyId;
        this.setup();

        ExpenseSave.instance = this;
    }

    async setup() {
        this.partyMembers = await this.loadPartyMemberData();
        this.render();
        this.setEvent();
    }

    template() {

        const { partyMembers } = this.partyMembers;

        return `
        <div class="default-form">

            <p class="top-text-left">Assemble</p>
            <p class="top-text-left">모임 생성</p>

            <div class="expense-input">

                <div class="expense-price-input">
                    <label for="expense">가격</label>
                    <input type="text" id="expense" class="expense-price-box" placeholder="0" required>
                </div>
                
                <div class="party-member-list">
                    <div>
                        <p class="top-text-left">결제자</p>
                        <p>${partyMembers.currentMemberNickname}</p>
                        <input type="hidden" id="currentMemberPartyMemberId" value="${partyMembers.currentMemberPartyMemberId}">
                    </div>
                    <p class="top-text-left">참여 인원</p>
                        ${partyMembers.partyMemberDTOList.map(partyMember => `
                        <label>
                            <input type="checkbox" name="selectedPartyMember" value="${partyMember.id}">
                            ${partyMember.nickname}
                        </label>
                        `).join('')}
                </div>


                <div class="expense-content-input">
                    <label for="content">내용</label>
                    <textarea id="content" class="expense-content-box"></textarea>
                </div>
                

                <div class="file-box">
                    <input class="file-name" placeholder="첨부파일" readonly>
                    <label for="file">파일찾기</label> 
                    <input type="file" id="file" multiple>
                </div>


            </div>
            <button class="saveButton">비용 생성하기</button>

        </div>

        `;
    }

    setEvent() {
        this.target.querySelector('#expense').addEventListener('input',this.validateInput);
        this.target.querySelector('.saveButton').addEventListener('click',this.saveExpense.bind(this));
        this.target.querySelector('#file').addEventListener('change', this.displayFileName.bind(this));
    }

    displayFileName() {
        const fileInput = document.getElementById('file');
        const fileNameInput = document.querySelector('.file-name');

        if (fileInput.files.length > 0) {
            const totalFiles = fileInput.files.length;
            const firstFileName = fileInput.files[0].name;

            if (totalFiles === 1) {
                fileNameInput.value = `${firstFileName}`;
            } else {
                const remainingFiles = totalFiles - 1;
                fileNameInput.value = `${firstFileName} 외 ${remainingFiles}개`;
            }
        } else {
            fileNameInput.value = '';
        }
    }


    validateInput() {
        const expenseInput = document.getElementById("expense");
        const inputValue = expenseInput.value;
    
        if (/^[0-9]+$/.test(inputValue)) {
        } else {
            expenseInput.value = inputValue.replace(/[^0-9]/g, '');
        }
    }

    async saveExpense() {
        
        const partyId = this.partyId;
        const token = localStorage.getItem("token");

        const expensePrice = document.getElementById('expense').value;
        const expenseContent = document.getElementById('content').value;

        const selectedPartyMembers = document.querySelectorAll('input[name="selectedPartyMember"]:checked');
        const partyMemberIds = Array.from(selectedPartyMembers).map(checkbox => checkbox.value);
        const payerPartyMemberId = document.getElementById('currentMemberPartyMemberId').value;
        
        const uploadUrlList = await this.saveImage()

        const expenseSaveDTO = {
            payerPartyMemberId : payerPartyMemberId,
            price : parseInt(expensePrice),
            content : expenseContent,
            partyMemberIds :partyMemberIds,
            imageUrls : uploadUrlList
        };

        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/expense` , {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseSaveDTO),
            });

            if (response.ok) {
                console.log('비용 저장 성공');
                window.history.back();
            } else {
                console.error('비용 저장 실패');
            }
        } catch (error) {
            console.error('비용 저장 오류', error);
        }
    }

    async saveImage() {
        const fileInput = document.getElementById('file');
        
        if (fileInput.files.length === 0) {
            console.error('이미지가 선택되지 않았습니다.');
            return;
        }
    
        const token = localStorage.getItem("token");
        const formData = new FormData();
    
        for (const file of fileInput.files) {
            formData.append('multipartFiles', file);
        }
    
        try {
            const response = await fetch(`http://localhost:8080/file/multiparty-files`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                const uploadUrlList = data.data;
                console.log('이미지 저장 성공');
                return uploadUrlList;
            } else {
                console.error('이미지 저장 실패');
            }
        } catch (error) {
            console.error('이미지 저장 오류', error);
        }
    }

    async loadPartyMemberData() {
        const partyId = this.partyId;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/partyMembers`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const partyMembers = data.data;
                console.log(partyMembers);
                console.log("모임원 조회 성공");
                return {partyMembers};
            } else {
                console.error('모임원 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('모임원 조회 오류', error);
            return [];
        }
    }
}
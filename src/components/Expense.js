import ExpenseDetail from "/src/components/ExpenseDetail.js";
import Component from "/src/components/Component.js";
import ExpenseSave from "/src/components/ExpenseSave.js";

export default class Expense extends Component {

    partyId;
    partyMemberId;
    static instance;
    constructor(target, partyId, partyMemberId){

        if (Expense.instance) {
            Expense.instance.setup();
            return Expense.instance;
        }

        super(target);
        this.partyId = partyId;
        this.partyMemberId = partyMemberId;
        this.setup();
        this.preSetEvent()
        Expense.instance = this;
    }

    async setup() {
        this.state = await this.loadExpenseData();
        this.render();
        this.setEvent();
    }


    template() {
        const { expenseList } = this.state;

        return `
        <div class="default-form">
            <p class="top-text-left">Assemble</p>
            <p class="top-text-left">비용 리스트</p>

            <button class="createButton">비용 생성하기</button>

            ${expenseList.map(expense => `
            <div class="expense" expense-id="${expense.id}">
                <p>${expense.content}</p>
                <p>${expense.price}원</p>
            </div>
            `).join('')}

        </div>
        `;
    }

    setEvent() {
        this.target.querySelector('.createButton').addEventListener('click', () => {
            window.history.pushState({},"",'/expense');
            const componentInstance = new ExpenseSave(this.target,this.partyId);
        });
    }

    preSetEvent() {
        const partyId = this.partyId;
        const partyMemberId = this.partyMemberId;
        this.target.addEventListener('click', (e) => {
            const partyElement = e.target.closest('.expense');
            if (partyElement) {
                const expenseId = partyElement.getAttribute('expense-id');
                window.history.pushState({}, "", '/expense/detail');
                const componentInstance = new ExpenseDetail(this.target,partyId,expenseId,partyMemberId);
            }
        });
    }

    async loadExpenseData() {
        const token = localStorage.getItem("token");
        const partyId = this.partyId;
        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/expense`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const expenseList = data.data;
                console.log(expenseList);
                console.log("비용 리스트 조회 성공");
                return {expenseList};
            } else {
                console.error('비용 리스트 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('비용 리스트 조회 오류', error);
            return [];
        }
    }
}
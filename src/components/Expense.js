import Component from "/src/components/Component.js";
import ExpenseSave from "/src/components/ExpenseSave.js";

export default class Expense extends Component {

    partyId;
    static instance;
    constructor(target, partyId){

        if (Expense.instance) {
            Expense.instance.setup();
            return Expense.instance;
        }

        super(target);
        this.partyId = partyId;
        this.setup();
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
            <div class="expense-info">
                <p>${expense.content}</p>
                <p>${expense.price}</p>
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
                console.log("모임 조회 성공");
                return {expenseList};
            } else {
                console.error('모임 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('모임 조회 오류', error);
            return [];
        }
    }
}
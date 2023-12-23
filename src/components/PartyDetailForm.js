import Component from "/src/components/Component.js";

export default class PartyDetailForm extends Component {

    partyList;

    constructor(target, params){
        super(target);
        this.id = params.id;  // params 객체에서 id를 받아옴
        this.setup();
    }

    template() {
        const { party } = this.state;
        const { partyList } = this.partyList;
        return `
        <div id="party-detail">
            <h4 class="party-top-text">Assemble</h4>

            <p class="party-top-text">모임 리스트</p>
            <div id="party-info">
                <div class="title">
                    <p>${party.name}</p>
                </div>

                <div class="date">
                    <p>${party.date}</p>
                </div>

                <div class="content">
                    <p>${party.content}</p>
                </div>
                ${partyList.map(party => `
                <div class="party-member-group">
                    <div class="partyMember">
                        <p>${party.memberId}</p>
                    </div>
                </div>
                `).join('')}
                
                <button id="expenseButton">결제내역 보기</button>
            </div>
        </div>
        `;
    }

    setEvent() {
        const partyId = this.id;
        this.target.querySelector('#expenseButton').addEventListener('click', e=> {
            window.history.pushState({},"",`/partys/${partyId}/expense`);
            console.log("asdf");
            window.route(e);
        })
    }

    async setup() {
        this.state = await this.loadPartyData();
        this.partyList = await this.loadPartyMemberData();
        this.render();
        this.setEvent();
    }

    async loadPartyData() {
        const id = this.id;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys/${id}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const party = data.data;
                console.log(party);
                console.log("모임 조회 성공");
                return {party};
            } else {
                console.error('모임 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('모임 조회 오류', error);
            return [];
        }
    }

    async loadPartyMemberData() {
        const id = this.id;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys/${id}/partyMembers`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const partyList = data.data;
                console.log(partyList);
                console.log("모임 조회 성공");
                return {partyList};
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
import Component from "/src/components/Component.js";
import Expense from "/src/components/Expense.js";

export default class PartyDetail extends Component {

    partyId;
    partyMemberId;
    partyMembers;
    invieCode;
    static instance;
    constructor(target, partyId){
        if (PartyDetail.instance) {
            PartyDetail.instance.setup();
                        return PartyDetail.instance;
        }
        super(target);
        this.partyId = partyId;
        this.setup();

        PartyDetail.instance = this;
    }

    template() {
        const { party } = this.state;
        const { partyMembers } = this.partyMembers;
        return `
        <div class="default-form">
            <p class="top-text-left">Assemble</p>
            <p class="top-text-left">모임 상세정보</p>
            
            <div class="party-info">
                <p class="party-name">${party.name}</p>
                <p class="party-date">${party.eventDate}</p>
                <p class="party-content">${party.content}</p>

                <button class="inviteCodeButton">초대 코드 생성</button>

                <div class="party-member-list">
                    <p class="top-text-left">참여 인원</p>
                    <p>${partyMembers.currentMemberNickname}</p>
                    ${partyMembers.partyMemberDTOList.map(partyMember => `
                    <p>${partyMember.nickname}</p>
                    `).join('')}
                </div>
                
                <button class="expenseButton">결제내역 보기</button>
            </div>
        </div>
        `;
    }

    setEvent() {
        this.target.querySelector('.expenseButton').addEventListener('click', () => {
            window.history.pushState({},"",'/partys/detail/expense');
            const componentInstance = new Expense(this.target,this.partyId, this.partyMemberId);
        })

        this.target.querySelector('.inviteCodeButton').addEventListener('click', this.invieCode = this.createInviteCode.bind(this))
    }

    async setup() {
        this.state = await this.loadPartyData();
        this.partyMembers = await this.loadPartyMemberData();
        this.render();
        this.setEvent();
    }

    async loadPartyData() {
        const partyId = this.partyId;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const party = data.data;
                console.log("모임 상세 조회 성공");
                return {party};
            } else {
                console.error('모임 상세 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('모임 상세 조회 오류', error);
            return [];
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
                this.partyMemberId = partyMembers.currentMemberPartyMemberId
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

    async createInviteCode() {
        const partyId = this.partyId;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/invitation`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const invieCode = data.data;
                console.log(invieCode);
                console.log("초대코드 생성 성공");
                return invieCode;
            } else {
                console.error('초대코드 생성 실패');
                return [];
            }
        } catch (error) {
            console.error('초대코드 생성 오류', error);
            return [];
        }
    }
}
import Component from "/src/components/Component.js";

export default class Invite extends Component {


    constructor(target){
        super(target);
        this.validateInviteCode();
        
    }

    async validateInviteCode() {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/{inviteCode}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const partyId = data.data;
                console.log("모임 조회 성공");
                await this.createPartyMember(partyId);
                const componentInstance = new PartyDetail(this.target,partyId);
            } else {
                console.error('모임 조회 실패');
                const componentInstance = new Party(this.target);
            }
        } catch (error) {
            console.error('모임 조회 오류', error);
            return [];
        }
    }

    async createPartyMember(partyId) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080//partys/${partyId}/partyMembers`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("모임원 생성 성공");
            } else {
                console.error('모임원 생성 실패');
            }
        } catch (error) {
            console.error('모임원 생성 오류', error);
            return [];
        }
    }

    
}
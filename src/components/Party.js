import Component from "/src/components/Component.js";
import PartySave from "/src/components/PartySave.js";
import PartyDetail from "/src/components/PartyDetail.js"

export default class Party extends Component {

    page = 0;
    size = 10;
    static instance;
    constructor(target){
        if (Party.instance) {
            Party.instance.setup();
            return Party.instance;
        }

        super(target);
        this.preSetEvent()
        this.setup();

        Party.instance = this;
    }

    preRender() {
        this.target.innerHTML = this.preHTML();
    }

    render() {
        this.target.insertAdjacentHTML('beforeend', this.template());
    }

    setEvent() {
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 300));
        //this.target.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 300));
        this.target.querySelector('.createButton').addEventListener('click', () => {
            window.history.pushState({},"",'/partys');
            const componentInstance = new PartySave(this.target);
        });
        
    }

    preSetEvent() {

        this.target.addEventListener('click', (e) => {
            const partyElement = e.target.closest('.party');
            if (partyElement) {
                const partyId = partyElement.getAttribute('party-id');
                window.history.pushState({ partyId }, "", '/partys/detail');
                const componentInstance = new PartyDetail(this.target,partyId);
            }
        });
    }

    preHTML() {
        return `
        <div class="default-form">

            <p class="top-text-left">Assemble</p>
            <p class="top-text-left">모임 리스트</p>

            <div class="calender-search">
                <label for="startDate"></label>
                <input type="date" id="startDate" class="calender-box" placeholder="연도-월-일">
                <p>-</p>
                <label for="endDate"></label>
                <input type="date" id="endDate" class="calender-box" placeholder="연도-월-일">

                <button class="searchButton">조회하기</button>
            </div>

            <button class="createButton">모임 생성하기</button>
        </div>
        `
    }

    template() {
        const { partyList } = this.state;
        console.log(this.state);
        const html = `
            ${partyList.map(party => `
            <div class="party"  party-id="${party.id}">
                    <p>${party.name}</p>

                    <p>모임 날짜 : ${party.eventDate}</p>
            </div>
        `).join('')}
        `
        return html;
    }

    async setup() {
        this.preRender();
        this.state = await this.loadData(0,10);
        this.render();
        this.setEvent();
    }

    async loadData(page, size) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const partyList = data.data;
                console.log("모임 조회 성공");
                this.page++;
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

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.scrollRender();
    }

    scrollRender() {
        this.target.insertAdjacentHTML('beforeend', this.template());
    }

    async handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 100) {
    
            const newPartyList = await this.loadData(this.page, this.size);
            this.setState(newPartyList);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function () {
            const context = this,
                args = arguments;
            const later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
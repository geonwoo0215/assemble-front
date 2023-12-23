import Component from "/src/components/Component.js";

export default class Party extends Component {

    page = 0;
    size = 10;

    constructor(target){
        super(target);
        this.setup();
        this.setEvent();
    }

    preRender() {
        this.target.innerHTML = this.preHTML();
    }

    render() {
        this.target.insertAdjacentHTML('beforeend', this.template());
    }

    setEvent() {
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 300));
        this.target.querySelector('#createButton').addEventListener('click', e => {
            window.history.pushState({},"",'/partys');
            window.route(e);
        });
        this.target.addEventListener('click', (e) => {
            const partyElement = e.target.closest('.party-group');
            if (partyElement) {
                const partyId = partyElement.getAttribute('data-party-id');
                window.history.pushState({}, "", `/partys/${partyId}`)
                console.log(`Clicked on party with ID: ${partyId}`);
                window.route(e);
            }
        });
    }

    preHTML() {
        return `
        <div id="party-form">

            <h4 class="party-top-text">Assemble</h4>

            <p class="party-top-text">모임 리스트</p>

            <div class="calender-search">
                <label for="startDate"></label>
                <input type="date" id="startDate"  placeholder="연도-월-일">
                <p>-</p>
                <label for="endDate"></label>
                <input type="date" id="endDate"  placeholder="연도-월-일">

                <button id="searchButton">조회하기</button>
            </div>

            <button id="createButton">모임 생성하기</button>
        </div>
        `
    }

    template() {
        const { partyList } = this.state;
        console.log(this.state);
        const html = `
            ${partyList.map(party => `
            <div class="party-group"  data-party-id="${party.id}">
                <div class="party">

                    <div class="title">
                        <p>${party.name}</p>
                    </div>

                    <div class="date">
                        <p>모임 날짜 : ${party.date}</p>
                    </div>
                    
                </div>
            </div>
        `).join('')}
        `
        return html;
    }

    async setup() {
        this.preRender();
        this.state = await this.loadData(0,10);
        this.render();
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
                console.log(partyList);
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
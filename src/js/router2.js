import LoginForm from '/src/components/LoginForm.js';
import Party from '/src/components/Party.js';
import RegisterForm from '/src/components/RegisterForm.js';
import PartySaveForm from '/src/components/PartySaveForm.js';
import PartyDetailForm from '/src/components/PartyDetailForm.js';
import ExpenseDetailForm from '/src/components/ExpenseDetailForm.js';


const routes = {
    '/': Party,
    '/login': LoginForm,
    '/members' : RegisterForm,
    '/partys' : PartySaveForm,
    '/partys/:id' : PartyDetailForm,
    '/partys/:id/expense' : ExpenseDetailForm
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    handleLocation(); 
}
const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    
    if(!token){
        window.history.pushState({}, "", '/login');
        const routeComponent = routes['/login'] || routes['/404'];
        const componentInstance = new routeComponent(document.getElementById('app'));
    }
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const token = localStorage.getItem("token");
    if (path !== '/members') {
        isAuthenticated();
    }
    if (token || path === '/members') {
        console.log(path);

        // '/partys/:id/expense'와 일치하는지 확인
        const expenseMatch = path.match(/^\/partys\/(\d+)\/expense$/);
        if (expenseMatch) {
            const routeComponent = routes['/partys/:id/expense'];
            const componentInstance = new routeComponent(document.getElementById('app'), { id: expenseMatch[1] });
        } else {
            // 다른 라우트를 확인
            const match = path.match(/^\/partys\/(\d+)$/);
            const routeComponent = match ? routes['/partys/:id'] : routes[path] || routes['/404'];
            const componentInstance = match
                ? new routeComponent(document.getElementById('app'), { id: match[1] })
                : new routeComponent(document.getElementById('app'));
        }
    }

};
window.onpopstate = handleLocation;
window.route = route;

handleLocation();
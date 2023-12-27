import Login from '/src/components/Login.js';
import Party from '/src/components/Party.js';
import Register from '/src/components/Register.js';
import PartySave from '/src/components/PartySave.js';
import PartyDetail from '/src/components/PartyDetail.js';
import Expense from '/src/components/Expense.js';
import Invite from '/src/components/Invite.js';


const routes = {
    '/': Party,
    '/login': Login,
    '/members' : Register,
    '/partys' : PartySave,
    '/partys/detail' : PartyDetail,
    '/partys/detail/expense' : Expense,
    '/invite/:inviteCode' : Invite,
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
    isAuthenticated();
    const token = localStorage.getItem("token");
    if(token) {
        const isInvitePath = path.startsWith('/invite/');
        
        if (isInvitePath) {
            const inviteCode = path.replace('/invite/', '');
            
            const routeComponent = routes['/invite/:inviteCode'] || routes['/404'];
            const componentInstance = new routeComponent(document.getElementById('app'), { inviteCode });
        } else {
            const routeComponent = routes[path] || routes['/404'];
            const componentInstance = new routeComponent(document.getElementById('app'));
        }
    }
};
window.onpopstate = handleLocation;
window.route = route;

handleLocation();
import LoginForm from '/src/components/LoginForm.js';
import Party from '/src/components/Party.js';
import RegisterForm from '/src/components/RegisterForm.js';


const routes = {
    '/': Party,
    '/login': LoginForm,
    '/members' : RegisterForm
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
    if(token || path ==='/members'){
    const routeComponent = routes[path] || routes['/404']; 
    const componentInstance = new routeComponent(document.getElementById('app'));
    }

};
window.onpopstate = handleLocation;
window.route = route;

handleLocation();
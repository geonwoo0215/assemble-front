import Dashboard from '/src/components/Dashboard.js';
import LoginForm from '/src/components/LoginForm.js';


const routes = {
    '/': Dashboard,
    '/login': LoginForm,
};

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if(!token){
        return false;
    }
    return true; // 로그인이 되어 있는 경우
};

const handleLocation = async () => {
    const path = isAuthenticated() ? window.location.pathname : '/login';

    const routeComponent = routes[path] || routes['/404']; 

    const componentInstance = new routeComponent(document.getElementById('app'));
    componentInstance.render();
    window.history.pushState(null, null, path);
};

window.onpopstate = handleLocation;

handleLocation();
const routes = {
    404: {
        template: "/src/html/404.html",
        title: "404",
    },
    "/": {
        template: "/index.html",
        title: "Assemble",
    },
    "/login": {
        template: "/src/html/login.html",
        title: "로그인 | Assemble",
    }
};

const checkLoginAndNavigate = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        await handleLocation();
    } else {
        window.history.pushState({}, "", "/login");
        await handleLocation("/login");
    }
};

const route = async(event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const routeInfo = routes[path] || routes[404];
    const html = await fetch(routeInfo.template).then((response) => response.text());
    document.getElementById("app").innerHTML = html;
    document.title = routeInfo.title;
};

window.onpopstate = handleLocation;
window.route = route;
handleLocation();

checkLoginAndNavigate();
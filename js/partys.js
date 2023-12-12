document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    console.log(token);

    if(!token) {
        window.location.href = "../html/login.html";
    } else {
        fetch("http://localhost:8080/partys", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(response => {
            if(!response.ok) {
                throw new Error("Faile")
            }
            return response.json();
        })
        .then(data => {
            renderPartyPage(data);
        })
        .catch(error => {
            console.error("Error during party data fetch:", error);
        });
    }
});

function renderPartyPage(partyDataList) {
    const appContainer = document.getElementById("app");

    partyDataList.forEach(partyData => {
        const partyElement = createPartyElement(partyData);
        appContainer.appendChild(partyElement);
    });
}

function createPartyElement(partyData) {
    const partyElement = document.createElement("div");
    partyElement.classList.add("party");

    partyElement.innerHTML = `
        <h2>${partyData.name}</h2>
        <p>${partyData.content}</p>
        <p>Start Date: ${partyData.startDate}</p>
    `;

    return partyElement;
}
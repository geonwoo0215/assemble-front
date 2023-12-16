document.addEventListener("DOMContentLoaded", function () {
    const partyId = sessionStorage.getItem("selectPartyId");
    const partyData = JSON.parse(sessionStorage.getItem(`partyDetails_${partyId}`));
    if (partyId) {
        const partyDetailsContainer = document.getElementById("partyDetailsContainer");
        partyDetailsContainer.innerHTML = `
            <h1>${partyData.name}</h1>
            <p>${partyData.content}</p>
            <p>모임 날짜: ${partyData.startDate}</p>
        `;
    } else {
        console.error('Selected party ID not found in hidden field.');
    }
});
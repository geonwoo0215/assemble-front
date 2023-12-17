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

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/partys/${partyId}/partyMembers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to check party membership");
            }
            return response.json();
        })
        .then(partyMembers => {
            renderPartyPage(partyMembers.data);
        })
        .catch(error => {
            console.error("Error:", error);
        });

        function renderPartyPage(partyDataList) {
            console.log("Party Data List:", partyDataList);
            const appContainer = document.getElementById("partyMemberContainer");
      
            partyDataList.forEach(partyData => {
              const partyElement = createPartyElement(partyData);
              appContainer.appendChild(partyElement);
            });
        }
          function createPartyElement(partyData) {
            const partyElement = document.createElement("div");
            partyElement.classList.add("party");
      
            partyElement.innerHTML = `
                <h2>모임 참여자</h2>
                <p>${partyData.memberId}</p>
            `;
      
            return partyElement;
        }
});
document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    const partyId = localStorage.getItem('invitePartyId');
    const joinPartyBtn = document.getElementById('joinPartyBtn');

    joinPartyBtn.addEventListener("click", function() {
        fetch(`http://localhost:8080/partys/${partyId}/partyMembers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed");
            } 
            return response.json();
        })
        .then(data => {
            console.log("Success:", data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
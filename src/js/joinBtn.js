document.addEventListener("DOMContentLoaded", function() {
 
    const token = localStorage.getItem("token");

    const getUserIdFromToken = () => {
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            return tokenData.userId;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const currentUserId = getUserIdFromToken();

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
            const currentUserIsPartyMember = partyMembers.some(member => member.memberId === currentUserId);
            
            if (!currentUserIsPartyMember) {
                joinPartyBtn.style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
);
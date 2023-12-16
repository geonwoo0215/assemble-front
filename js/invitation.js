document.addEventListener("DOMContentLoaded", function () {
    const generateInvitationButton = document.querySelector('button[type="button"]');
    const partyId = sessionStorage.getItem("selectPartyId");
    console.log(partyId);
    generateInvitationButton.addEventListener("click", function () {
        event.preventDefault();
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/partys/${partyId}/invitation`,{
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
              },
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Invitation failed');
            }
            return response.json();
        })
        .then(data => {
            alert(`초대코드: ${data.data}`);
        })
        .catch(error => {
            console.error('Error', error);
        });

    });
});
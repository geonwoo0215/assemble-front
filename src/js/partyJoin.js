document.addEventListener("DOMContentLoaded", function() {
    handleRoute();
  
    function handleRoute() {
      const inviteCode = getInviteCodeFromURL();
      if (inviteCode) {
        const apiUrl = `http://localhost:8080/${inviteCode}`;
  
        fetch(apiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            const partyId = data.data;
            console.log('Party ID:', partyId);
            localStorage.setItem('invitePartyId', partyId);
            const partyDataApiUrl = `http://localhost:8080/partys/${partyId}`;
            return fetch(partyDataApiUrl);
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(partyData => {
            console.log('Party Data:', partyData);
  
          })
          .catch(error => {
            console.error('API 호출 중 오류 발생:', error);
          });
      }
    }
  
    function getInviteCodeFromURL() {
        const url = new URL(window.location.href);
        const path = url.pathname;
        const inviteCode = path.substring(1); 
        return inviteCode;
      }
  });
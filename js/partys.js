document.addEventListener("DOMContentLoaded", function () {
    let page = 0;
    const size = 10;
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "../html/login.html";
    } else {
      function infiniteScroll() {
  
        fetch(`http://localhost:8080/partys?page=${page}&size=${size}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed");
          }
  
          return response.json();
        })
        .then(data => {
          renderPartyPage(data.data);
          page++;
        })
        .catch(error => {
          console.error("Error during party data fetch:", error);
        });
      }
  
      function renderPartyPage(partyDataList) {
        console.log("Party Data List:", partyDataList);
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
            <p>모임 날짜: ${partyData.startDate}</p>
        `;
  
        return partyElement;
      }
  
      infiniteScroll();

      window.addEventListener('scroll', debounce(function () {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          infiniteScroll();
        }
      }, 300));
    }
  

    function debounce(func, wait) {
      let timeout;
      return function () {
        const context = this,
          args = arguments;
        const later = function () {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  });
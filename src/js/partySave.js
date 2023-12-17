document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    const partyForm = document.getElementById("partyForm");

    partyForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(partyForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        fetch("http://localhost:8080/partys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Faile")
            } 
            return response.json();
        })
        .then(data => {
            window.location.href = "/src/html/index.html";
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
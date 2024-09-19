// NAVBAR
function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if (i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
}

//CAROSEUL
const imageCaroseul = document.querySelectorAll(".imageCaroseul")

async function fetchCatImages() {
    const url = 'https://api.thecatapi.com/v1/images/search?limit=10';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        for (let i = 0 ; i<3 ; i++){
            imageCaroseul[i].src = data[i].url
        }
        
    } catch (error) {
        console.error('Error fetching cat images:', error);
    }
}

fetchCatImages();


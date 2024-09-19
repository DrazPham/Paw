const boxes = document.querySelectorAll(".boxGame");
const replay = document.getElementById("replay");
let tracking = [];
let win = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]
let totalArr =[];
let blueArr = [];
let redArr = [];
const gameRun = function(){
    count = 0;
    boxes.forEach((e)=>{
        e.addEventListener("click",()=>{
        const currentBlock = e;
        if (count%2 ==0){
            if(totalArr.indexOf(parseInt(e.id)) == -1 && count<9){
                blueArr.push(parseInt(e.id))
                totalArr.push(parseInt(e.id));
                currentBlock.style.backgroundImage ="url(/img/tomFace.png)";
                count++;
            }
        }
        else {
            if(totalArr.indexOf(parseInt(e.id)) == -1 && count<9){
                redArr.push(parseInt(e.id));
                totalArr.push(parseInt(e.id));
                currentBlock.style.backgroundImage ="url(/img/oggyFace.png)";
                count++;
            }
        }

        win.forEach((e)=>{
            if(e.every(element => blueArr.includes(element))){
                e.forEach((event)=>{
                    boxes[event].style.backgroundColor = "blue";
                    count =9;
                }
                )
                var audio = document.getElementById("myAudio");
                audio.play();
            }
            if(e.every(element => redArr.includes(element))){
                e.forEach((event)=>{
                    boxes[event].style.backgroundColor = "red";
                    count = 9;
                }
                )
                var audio = document.getElementById("myAudio");
                audio.play();
            }
        })
        })
    })
}
const replaygame = function() {
    totalArr =[];
    blueArr = [];
    redArr = [];
    boxes.forEach((e)=>{
        e.style.backgroundImage="";
        e.style.backgroundColor = "rgb(252, 233, 226)";
    })
    gameRun();
}
replay.addEventListener("click", replaygame);
gameRun();






////FLIP CARD

const card = document.querySelectorAll(".cardContainer");
const back = document.querySelectorAll(".back");
const replayFlip =document.querySelector("#replayFlip");
const img_list =[
    "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg",
    "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
    "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
    "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg",
    "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D)",
    "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D)",
    "https://www.cdc.gov/importation/images/cat.jpg?_=18560",
    "https://www.cdc.gov/importation/images/cat.jpg?_=18560"
];

function shuffleArr(array){
    let length = array.length;
    let randomIndex;
    while (length !=0 ){
        randomIndex= Math.floor(Math.random() * length);
        length--;
        [array[randomIndex],array[length]] = [array[length],array[randomIndex]];
    }
    return array;
}
function cardImage(){
let cnt = 0;
    let image_array = [...shuffleArr(img_list)];
    back.forEach((e)=>{
        const card_index = e;
        card_index.style.backgroundImage = `url(${image_array[cnt]}`;
        card_index.classList.add(`${image_array[cnt]}`);
        cnt++;
    })
}
cardImage();
var currEle;
var prevEle;
var currEle_container;
var prevEle_container;
let flipCount = 0;
let comparing = false;
let activeCard = null;

card.forEach((e)=>{
    e.addEventListener("click",()=>{
        if (comparing || e.classList.contains("active")) return;
        let backSide = e.querySelector(".back");
        let currEle = backSide;
        e.classList.add("active");
        currEle_container = e;
        flipCount++;
        if( flipCount == 2){
            comparing = true;
            let currEle_string = currEle.className;
            let prevEle_string = prevEle.className;
            if (currEle_string == prevEle_string){
                setTimeout(() => {
                    prevEle.style.display = "none";
                    currEle.style.display = "none";
                    currEle = "";
                    prevEle = "";
                    comparing = false; // Reset flag
                }, 2000);
            }
            else{
                setTimeout(()=>{    
                    currEle_container.classList.remove("active");
                    prevEle_container.classList.remove("active");
                    comparing = false; // Reset flag
                },2000);
            }
            flipCount = 0;
        }
        else{ 
            prevEle = backSide;
            prevEle_container = currEle_container;
        }
    })
})

// Function to reset the game
function resetGame() {
    // Hide all cards
    document.querySelectorAll(".cardContainer").forEach((e) => {
        e.querySelector(".back").style.display = "block"; // Show all cards
        e.classList.remove("active"); // Remove the "active" class
    });

    // Reshuffle the images
    cardImage();
}

// Event listener for the replay button
replayFlip.addEventListener("click", () => {
    resetGame(); // Call the reset function
});
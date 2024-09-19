//IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

//FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyA8CNldNPLeZd3k8uua3CWlwjrEHGk1zHI",
    authDomain: "pawtheproject.firebaseapp.com",
    projectId: "pawtheproject",
    storageBucket: "pawtheproject.appspot.com",
    messagingSenderId: "721677130048",
    appId: "1:721677130048:web:73de1b13a4c06ccd73c2a5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

////BREED CAT 
//DEFINE
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("btn");
const CANVAS_WIDTH = canvas.width = 2400;
const CANVAS_HEIGHT = canvas.height = 400;
let progress_bar = document.getElementById("progress_bar");
let levelDisplaying = document.getElementById("levelDisplaying");
const spriteHeight = 400 / 2;
const spriteWidth = 400;
let size = 2;
const catImage = new Image();
catImage.src = "/img/catBreedAnimation.png";
const levelArr = [0, 3, 5, 7, 10, 14, 18, 20];
let FrameY = 0;
let gameFrame = 0;
const staggerFrames = 15;
var grow = 0;
let xPosition = CANVAS_WIDTH; // Start from the right side of the canvas


//FUNCTION
function animate() {
    let move = Math.random() * 10 + 3;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(catImage, 0, FrameY * spriteHeight, spriteWidth, spriteHeight, xPosition, 200, spriteWidth * 1.5 * size, spriteHeight / 3 * size);
    if (gameFrame % staggerFrames == 0) {
        FrameY++;
        if (FrameY > 11) FrameY = 0;
    }
    gameFrame++;
    xPosition -= move;
    if (xPosition < -spriteWidth * 1.5 * 2) {
        xPosition = CANVAS_WIDTH;
    }
    requestAnimationFrame(animate);
}
animate();


function startTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight

    const remainingTime = midnight - now;
    let timer = Math.floor(remainingTime / 1000);
    
    const interval = setInterval(function () {
        let hours = Math.floor(timer / 3600);
        let minutes = Math.floor((timer % 3600) / 60);
        let seconds = timer % 60;

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer').textContent = hours + ":" + minutes + ":" + seconds;
        
        if (timer <= 0) {
            clearInterval(interval);
            updateDoc(doc(db, "users", uid), {
                checkBreed: true,
            });
            btn.disabled = false;
            // Restart the timer for the next day
            startTimer();
        }
        timer--;
    }, 1000);

    // Check for date change every minute
    setInterval(function () {
        const currentDate = new Date();
        if (currentDate.getDate() !== now.getDate()) {
            updateDoc(doc(db, "users", uid), {
                checkBreed: true,
            });
            btn.disabled = false;
            // Restart the timer for the next day
            startTimer();
        }
    }, 60000); // 60000 ms = 1 minute
}



window.onload = startTimer;
console.log(timer);
// btn.disabled= false;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        //GET DATA
        const uid = user.uid;
        // updateDoc(doc(db, "users", uid), {
        //     checkBreed: true,
        //     level:1,
        //     levelTracking:0
        // });
        const docRef = doc(db, "users", uid);        
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(data);
        } else {
            console.log("No such document!");
        }
        const data = docSnap.data();
        
        localStorage.setItem("Username",data.Username);
        localStorage.setItem("UserID",data.UserID);
        localStorage.setItem("UserData",JSON.stringify(data));

        //BUTTON CHECK
        if (data.checkBreed == true)
            btn.style.backgroundColor = "#d8b49a";
        else btn.style.backgroundColor = "gray";

        let currentLev = data.level;
        let levelTracking = data.levelTracking;


        //DEFINE PROGRESS
        progress_bar.style.width = `${levelTracking}%`;
        if (levelTracking <= 25)
            progress_bar.style.backgroundColor = "red";
        else if (levelTracking <= 50)
            progress_bar.style.backgroundColor = "yellow";
        else if (levelTracking <= 75)
            progress_bar.style.backgroundColor = "lightblue";
        else
            progress_bar.style.backgroundColor = "green";
        levelDisplaying.innerHTML = `${currentLev}`


        //BREED
        btn.addEventListener("click", () => {
            
            if (data.checkBreed == true) {
                grow += 1;
                console.log(grow);
                
                levelTracking += (100 / (levelArr[currentLev] + 1))
                
                progress_bar.style.width = `${levelTracking}%`;
                if (levelTracking <= 25)
                    progress_bar.style.backgroundColor = "red";
                else if (levelTracking <= 50)
                    progress_bar.style.backgroundColor = "yellow";
                else if (levelTracking <= 75)
                    progress_bar.style.backgroundColor = "lightblue";
                else
                    progress_bar.style.backgroundColor = "green";

                if (grow > levelArr[currentLev]) {
                    size += 0.2;
                    grow = 0;
                    currentLev += 1;
                    levelDisplaying.innerHTML = `${currentLev}`
                    progress_bar.style.width = `0%`;
                    levelTracking = 0;
                }
                console.log(levelTracking);

                updateDoc(doc(db, "users", uid), {
                    level: currentLev,
                    levelTracking: levelTracking,
                    checkBreed: false
                });

                btn.style.backgroundColor = "gray";
                btn.disabled = true;
            }
        })

    }
});


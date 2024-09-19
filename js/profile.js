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




let userInfo = JSON.parse(localStorage.getItem("UserData"))
const usernameInput = document.getElementById("usernameInput");
const userIDInput = document.getElementById("userIDInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const phoneInput = document.getElementById("phoneInput");
const birthdayInput = document.getElementById("birthdayInput");
const bioInput = document.getElementById("bioInput");
const saveChange = document.getElementById("saveChange");
const currentPasswordInput = document.getElementById("currentPasswordInput");
const passwordInputCheck = document.getElementById("passwordInputCheck");
const inputSpace = document.querySelectorAll(".inputSpace");



saveChange.disabled = true;
inputSpace.forEach(e => {
    e.onchange = (event) => {
    saveChange.disabled = false;
    e.style.color = "rgba(0,0,0,1)";
    };
});

onAuthStateChanged(auth, async (user) => {
    const fetchData = async () => {        
        const docRef = doc(db, "users", user.uid);        
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log(data);
        usernameInput.value = `${data.Username}`;
        userIDInput.value = `${data.UserID}`;
        emailInput.value = `${data.email}`;
        currentPasswordInput.value = `${data.password}`;
        
        phoneInput.value = `${data.phone}`;
        birthdayInput.value = `${data.birthday}`;
        bioInput.value = `${data.bio}`;
    };

    await fetchData();

    saveChange.addEventListener("click", async (e) => {
        e.preventDefault();
        if (passwordInput.value == passwordInputCheck.value && passwordInput.value != ""){
            await updateDoc(doc(db, "users", user.uid), {
                email: emailInput.value,
                password: passwordInput.value,
                Username: usernameInput.value,
                UserID: userIDInput.value,
                phone: phoneInput.value,
                birthday: birthdayInput.value,
                bio: bioInput.value,
            });
            currentPasswordInput.value = `${passwordInput.value}`
            
            saveChange.disabled = true;
            inputSpace.forEach(e => {
                e.style.color = "rgba(0,0,0,0.5)";
            });            
        }
        
    });
});

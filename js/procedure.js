//IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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


//DEFINE
const signUp_email = document.getElementById("signUp_email");
const signUp_password = document.getElementById("signUp_password");
const signUp_button = document.getElementById("signUp_button");
const signIn_email = document.getElementById("signIn_email");
const signIn_password = document.getElementById("signIn_password");
const signIn_button = document.getElementById("signIn_button");
const UsernameInput = document.getElementById("UsernameInput");
const UserIDInput = document.getElementById("UserIDInput");
const noti = document.getElementById("noti");
let role = "user"


signUp_button.addEventListener("click", () => {
    if (signUp_email.value.includes("admin"))
        role = "admin"
    if (signUp_email.value && signUp_password.value && UsernameInput.value && UserIDInput.value != "")
        createUserWithEmailAndPassword(auth, signUp_email.value, signUp_password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                let UserInfo = {
                    email: user.email,
                    password: signUp_password.value,
                    Username: UsernameInput.value,
                    UserID: UserIDInput.value,
                    role : role,
                    phone: "",
                    birthday:"",
                    bio:"",
                }
                localStorage.setItem("userID",JSON.stringify(UserInfo))
                if (role == "admin")
                    setTimeout(()=>{location.replace("/content/Admin/admin-home.html");},1000);
                else
                    setTimeout(()=>{location.replace("/content/User/user-home.html");},1000);
                return setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    password: signUp_password.value,
                    Username: UsernameInput.value,
                    UserID: UserIDInput.value,
                    phone: "",
                    birthday:"",
                    bio:"",
                    role:role,
                    checkBreed: true,
                    level:1,
                    levelTracking:0,
                    createdAt: new Date()
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error creating user: ", errorCode, errorMessage);
                signUp_email.value = ``;
                signUp_password.value = ``;
                UsernameInput.value = ``;
                UserIDInput.value = ``;
                noti.innerHTML = `Email has been used`;
                noti.style.color = "red";
                setTimeout(()=>{
                    noti.innerHTML = ``;
                    noti.style.color = "white";
                },3000)
            });
    else {
        noti.innerHTML = `Please fill all the blank`;
        noti.style.color = "red";
        signUp_email.value = ``;
        signUp_password.value = ``;
        UsernameInput.value = ``;
        UserIDInput.value = ``;
        setTimeout(()=>{
            noti.innerHTML = ``;
            noti.style.color = "white";
        },3000)
    }
});

signIn_button.addEventListener("click", () => {
    if (signIn_email.value.includes("admin"))
        role = "admin"
    signInWithEmailAndPassword(auth, signIn_email.value, signIn_password.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if (role == "admin"){
                location.replace("/content/Admin/admin-home.html");
                console.log("error");
            }
            else
                location.replace("/content/User/user-home.html");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            noti.innerHTML = `Wrong email or password`;
            noti.style.color = "red";
            signIn_email.value = ``;
            signIn_password.value = ``;
            setTimeout(()=>{
                noti.innerHTML = ``;
                noti.style.color = "white";
            },3000)
        });
});

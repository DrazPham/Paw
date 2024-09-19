//IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, deleteDoc, updateDoc, collection, getDocs, getDoc, query, orderBy, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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


let textarea = document.getElementById('textArea');
let progressbar = document.getElementById("progress_bar");
let progressbarcount = document.getElementById("progress_bar").querySelector("span");
let latestPosts = document.getElementById("latestPosts")

textarea.addEventListener('change', resizeTextArea);
textarea.addEventListener('keyup', resizeTextArea);
textarea.addEventListener('keyup', progress_check);

function resizeTextArea() {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}
let word_limit = 280;
function progress_check() {
    progressbar.style.width = `${(textarea.value.length / word_limit) * 100}%`;
    progressbarcount.innerHTML = `${word_limit - textarea.value.length}`;
    if ((textarea.value.length / word_limit) * 100 < 33)
        progressbar.style.backgroundColor = "green";
    else if ((textarea.value.length / word_limit) * 100 < 66)
        progressbar.style.backgroundColor = "yellow";
    else progressbar.style.backgroundColor = "red";
}




//UPDATE INFORMATION
let userInfo = JSON.parse(localStorage.getItem("UserData"))

//INITIALIZATION
//UPDATING PREVIOUS POSTS
const forumCollection = collection(db, "forum");
const q = query(forumCollection, orderBy("postedTime", "desc"));
const querySnapshot = await getDocs(q);
await querySnapshot.forEach((doc) => {
    let data = doc.data();
    let newPost = document.createElement("div");
    newPost.innerHTML =
        `
                <div class = "col_1">
                    <div class="avatar"></div>
                </div>
                <div class ="col_2">
                    <div class = "info">
                        <span class = "authorName">
                            <b>${data.Username}</b>
                        </span>
                        <span class = "authortag">@${data.UserID}</span>
                        ·
                        <span class = "postDate">${String(data.postedTime.toDate()).slice(0, 24)}</span>
                    </div>
                    <div class = "textInputDiv">
                        <textarea class ="textInput" charswidth="23"style="resize:none" disabled>${data.textContent}</textarea>
                        <button class = "confirmEdit">Confirm</button>
                    </div>
                    <img src="" alt="">
                    <div class="reaction">
                        <div class="heartContainer">
                            <a href="" >
                                <i class="bi bi-heart heartEmpty"></i>
                                <i class="bi bi-heart-fill heartFull"></i>
                            </a>
                            <span class = "likeCount">${data.like}</span>
                        </div>
                        <div class="commentContainer">
                            <a href="" >
                                <i class="bi bi-chat"></i>
                            </a>
                            <span class = "commentCount">0</span>
                        </div>
                        <div class="repostContainer">
                            <a href="" >
                                <i class="bi bi-repeat"></i>
                            </a>
                            <span class = "repostCount">0</span>
                        </div>
                            <a href="">
                                <i class="bi bi-bookmark bookmarkEmpty"></i>
                                <i class="bi bi-bookmark-fill bookmarkFull"></i>
                            </a>
                        <div class="viewContainer">
                            <a href="">
                                <i class="bi bi-bar-chart-fill"></i>
                            </a>
                            <span class = "viewCount">0</span>
                        </div>
                    </div>
                </div>
                <span class ="userOptions">:</span>
                <ul class = "optionLists">
                    <li class = "editPosts">Edit Post</li>
                    <li class = "deletePosts">Delete Post</li>
                </ul>
    `;
    newPost.classList.add("postItems");
    newPost.setAttribute("id", `${doc.id}`);
    latestPosts.append(newPost);
});

///POST 

let postButton = document.querySelector("#post");
postButton.addEventListener("click", async () => {
    if (textarea.value.length != 0) {
        latestPosts.innerHTML = '';
        let newPost = document.createElement("div");
        newPost.innerHTML =
            `
                <div class = "col_1">
                    <div class="avatar"></div>
                </div>
                <div class ="col_2">
                    <div class = "info">
                        <span class = "authorName">
                            <b>${userInfo.Username}</b>
                        </span>
                        <span class = "authortag">@${userInfo.UserID}</span>
                        ·
                        <span class = "postDate">${String(new Date()).slice(0, 24)}</span>
                    </div>
                    <div class = "textInputDiv">
                        <textarea class ="textInput" charswidth="23"style="resize:none" disabled>${textarea.value}</textarea>
                        <button class = "confirmEdit">Confirm</button>
                    </div>
                    <img src="" alt="">
                    <div class="reaction">
                        <div class="heartContainer">
                            <a href="" >
                                <i class="bi bi-heart heartEmpty"></i>
                                <i class="bi bi-heart-fill heartFull"></i>
                            </a>
                            <span class = "likeCount">0</span>
                        </div>
                        <div class="commentContainer">
                            <a href="" >
                                <i class="bi bi-chat"></i>
                            </a>
                            <span class = "commentCount">0</span>
                        </div>
                        <div class="repostContainer">
                            <a href="" >
                                <i class="bi bi-repeat"></i>
                            </a>
                            <span class = "repostCount">0</span>
                        </div>
                            <a href="">
                                <i class="bi bi-bookmark bookmarkEmpty"></i>
                                <i class="bi bi-bookmark-fill bookmarkFull"></i>
                            </a>
                        <div class="viewContainer">
                            <a href="">
                                <i class="bi bi-bar-chart-fill"></i>
                            </a>
                            <span class = "viewCount">0</span>
                        </div>
                    </div>
                </div>
                <span class ="userOptions">:</span>
                <ul class = "optionLists">
                    <li class = "editPosts">Edit Post</li>
                    <li class = "deletePosts">Delete Post</li>
                </ul>
            `;
        newPost.classList.add("postItems");
        latestPosts.append(newPost);
        //UPDATING PREVIOUS POSTS
        const forumCollection = collection(db, "forum");
        const q = query(forumCollection, orderBy("postedTime", "desc"));
        const querySnapshot = await getDocs(q);
        await querySnapshot.forEach((doc) => {
            let data = doc.data();
            let newPost = document.createElement("div");
            newPost.innerHTML =
                `
            <div class = "col_1">
                <div class="avatar"></div>
            </div>
            <div class ="col_2">
                <div class = "info">
                    <span class = "authorName">
                        <b>${data.Username}</b>
                    </span>
                    <span class = "authortag">@${data.UserID}</span>
                    ·
                    <span class = "postDate">${String(data.postedTime.toDate()).slice(0, 24)}</span>
                </div>
                <p class ="textInput">${data.textContent}</p>
                <img src="" alt="">
                <div class="reaction">
                    <div class="heartContainer">
                        <a href="" >
                            <i class="bi bi-heart heartEmpty"></i>
                            <i class="bi bi-heart-fill heartFull"></i>
                        </a>
                        <span class = "likeCount">${data.like}</span>
                    </div>
                    <div class="commentContainer">
                        <a href="" >
                            <i class="bi bi-chat"></i>
                        </a>
                        <span class = "commentCount">0</span>
                    </div>
                    <div class="repostContainer">
                        <a href="" >
                            <i class="bi bi-repeat"></i>
                        </a>
                        <span class = "repostCount">0</span>
                    </div>
                        <a href="">
                            <i class="bi bi-bookmark bookmarkEmpty"></i>
                            <i class="bi bi-bookmark-fill bookmarkFull"></i>
                        </a>
                    <div class="viewContainer">
                        <a href="">
                            <i class="bi bi-bar-chart-fill"></i>
                        </a>
                        <span class = "viewCount">0</span>
                    </div>
                </div>
            </div>
            `;
            newPost.classList.add("postItems");
            latestPosts.append(newPost);
        });
        await addDoc(collection(db, "forum"), {
            Username: userInfo.Username,
            UserID: userInfo.UserID,
            postedTime: new Date(),
            textContent: textarea.value,
            like: 0
        })
        textarea.value = "";
        progressbar.style.width = 0;
        progressbarcount.innerHTML = 0;
    }
})

const heartEmpty = document.querySelectorAll(".heartEmpty");
heartEmpty.forEach((e) => {
    const heartEmptyIcon = e;
    const heartFullIcon = heartEmptyIcon.parentElement.querySelector(".heartFull");
    const reactCount = e.parentElement.parentElement.querySelector(".likeCount");
    const parentDivID = e.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    heartEmptyIcon.addEventListener("click", async (event) => {
        event.preventDefault();
        await updateDoc(doc(db, "forum", parentDivID), {
            like: increment(1)
        });
        let info = (await getDoc(doc(db, "forum", parentDivID))).data().like
        reactCount.innerHTML = `${info}`;
        heartEmptyIcon.style.display = "none";
        heartFullIcon.style.display = "inline-block";
        heartFullIcon.addEventListener("click", async (event) => {
            event.preventDefault();
            heartFullIcon.style.display = "none";
            heartEmptyIcon.style.display = "inline-block";
            await updateDoc(doc(db, "forum", parentDivID), {
                like: increment(-1)
            });
            info = (await getDoc(doc(db, "forum", parentDivID))).data().like
            reactCount.innerHTML = `${info}`;
        })
    })
})


const userOptions = document.querySelectorAll(".userOptions");
userOptions.forEach((e) => {
    e.addEventListener("click", (event) => {
        const parentDivID = e.parentElement.id;
        const divParent = e.parentElement;
        const textArea = divParent.querySelector(".textInput");
        const list = divParent.querySelector(".optionLists");
        const confirmEdit = divParent.querySelector(".confirmEdit");
        const editPosts = list.querySelector(".editPosts");
        const deletePosts = list.querySelector(".deletePosts");
        list.style.display = "block";
        list.addEventListener("click", (event) => {
            list.style.display = "none";
        })
        editPosts.addEventListener("click", (event) => {
            textArea.disabled = false;
            textArea.style.border = "1px solid black";
            textArea.style.backgroundColor = "white";
            confirmEdit.style.display = "block"
        })
        confirmEdit.addEventListener("click", async function () {
            textArea.disabled = true;
            textArea.style.border = "none";
            textArea.style.backgroundColor = "#fcf4ee";
            confirmEdit.style.display = "none";
            await updateDoc(doc(db, "forum",parentDivID), {
                textContent: textArea.value
            });
        })
        deletePosts.addEventListener("click", async (event) => {
            await deleteDoc(doc(db, "forum", parentDivID));
            setTimeout(location.reload(),500);
        })
    })
})

const postItems = document.querySelectorAll(".postItems");
postItems.forEach((e) => {
    let username = userInfo.Username;
    let divUserName = e.querySelector(".authorName b").textContent 
    let role = userInfo.role;
    if (role == "user"){
        if (divUserName === username)
        e.querySelector(".userOptions").style.display = "block";
    }
    else e.querySelector(".userOptions").style.display = "block";
})
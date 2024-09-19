import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8CNldNPLeZd3k8uua3CWlwjrEHGk1zHI",
    authDomain: "pawtheproject.firebaseapp.com",
    projectId: "pawtheproject",
    storageBucket: "pawtheproject.appspot.com",
    messagingSenderId: "721677130048",
    appId: "1:721677130048:web:73de1b13a4c06ccd73c2a5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
    const postsCollection = collection(db, "blogPosts");
    const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(postsQuery);
    querySnapshot.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        createPostElement(post);
    });
});

function createPostElement(post) {
    const blogGrid = document.getElementById("blogGrid");
    const postElement = document.createElement("article");
    postElement.classList.add("blog-post");

    postElement.innerHTML = `
        <img src="${post.image}" alt="${post.title}" style="width:100%; height:auto;">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-excerpt">${post.content}</p>
    `;

    blogGrid.appendChild(postElement);
}

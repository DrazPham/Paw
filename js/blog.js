import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"; 
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
        const post = doc.data();
        const postId = doc.id;
        createPostElement(post.title, post.content, post.image, postId);
    });
});

const createPostBtn = document.getElementById("createPostBtn");

createPostBtn.addEventListener("click", async () => {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const image = document.getElementById("postImage").value;

    if (title && content && image) {
        try {
            const docRef = await addDoc(collection(db, "blogPosts"), {
                title: title,
                content: content,
                image: image,
                createdAt: new Date()
            });
            createPostElement(title, content, image, docRef.id); 
            clearForm();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    } else {
        alert("Please fill in all fields.");
    }
});

function createPostElement(title, content, image, postId) {
    const blogGrid = document.getElementById("blogGrid");
    const post = document.createElement("article");
    post.classList.add("blog-post");

    post.innerHTML = `
        <img src="${image}" alt="${title}">
        <h2 class="post-title">${title}</h2>
        <p class="post-excerpt">${content}</p>
        <button class="edit-post" id="editPostbtn">Edit Post</button>
        <button class="delete-post" id="deletePostbtn">Delete Post</button>
    `;

    blogGrid.appendChild(post);

    const editBtn = post.querySelector("#editPostbtn");
    editBtn.addEventListener("click", function() {
        editPost(postId, post);
    });

    const deleteBtn = post.querySelector("#deletePostbtn");
    deleteBtn.addEventListener("click", function() {
        deletePost(postId, post);
    });
}

async function editPost(postId, post) {
    const title = post.querySelector(".post-title").innerHTML;
    const content = post.querySelector(".post-excerpt").innerHTML;
    const newTitle = prompt("Edit Title:", title);
    const newContent = prompt("Edit Content:", content);

    if (newTitle !== null || newContent !== null) {
        try {
            const postRef = doc(db, "blogPosts", postId); 
            await updateDoc(postRef, {
                title: newTitle || title,
                content: newContent || content
            });
            post.querySelector(".post-title").innerHTML = newTitle || title;
            post.querySelector(".post-excerpt").innerHTML = newContent || content;
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }
}

async function deletePost(postId, post) {
    if (confirm("Are you sure you want to delete this post?")) {
        try {
            const postRef = doc(db, "blogPosts", postId);  
            await deleteDoc(postRef);
            post.remove();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }
}

function clearForm() {
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("postImage").value = "";
}
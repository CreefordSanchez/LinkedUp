'use strict';

import {getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();

export async function newPost(userId, description, photo) {
    await addDoc(collection(db, 'Posts'), {
        UserId: userId,
        Description: description,
        Photo: photo == null ? '' : photo,
        Likes: 0
    });
}

export async function GetAllPost() {
    const docPost = await getDocs(collection(db, 'Posts'));
    const posts = docPost.docs.map(doc => doc.data());

    return posts;
}

/*
 <div class="post-box">
    <div class="post-header">
        <div class="profile"></div>
        <p class='user-post-name'>Example</p>
    </div>    
    <p class="post-text">Whats up guys!</p>                           
    <img src="./src/img/login-img.jpg" alt="" class='post-image'>
    <p class="like-counter">counter</p>
    <div class="post-buttons">
        <button class="like-btn">
            <i class="fa-solid fa-thumbs-up"></i>
            <p>Like</p>
        </button>
        <button class="comment-btn">
            <i class="fa-solid fa-comment"></i>
            <p>Comment</p>
        </button>
    </div>
</div>   */
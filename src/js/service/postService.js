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

export async function getAllPost() {
    return await getDocs(collection(db, 'Posts'));
}

export async function getPostById(id) {
    return await getDoc(db, 'Posts', 'id');
}

export async function updatePost(post, id) {
    
}
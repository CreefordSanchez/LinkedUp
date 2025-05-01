'use strict';

import {getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();
const ref = collection(db, 'Posts');

export async function newPost(userId, description, photo) {
    return await addDoc(ref, {
        UserId: userId,
        Description: description,
        Photo: photo == null ? '' : photo
    });
}

export async function getAllPost() {
    return await getDocs(ref);
}

export async function getPostById(id) {
    return await getDoc(doc(db, 'Posts', id));
}

export async function getUserPosts(userId) {
    if (userId == null) return null;
    return await getDocs(query(ref, where('UserId', '==', userId)));
}
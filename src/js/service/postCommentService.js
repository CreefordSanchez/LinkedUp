"use strict";

import {getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();
const ref = collection(db, 'PostComment');
export async function addPostComment(postId, userId, comment) {
    await addDoc(ref, {
        PostId: postId,
        UserId: userId,
        Comment: comment
    });
}
export async function getAllPostComment(postId) {
    return await getDocs(query(ref, where('PostId', '==', postId)));
}
'use strict';

import {getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();

export async function addUserLikePost(userId, postId) {
    const likesList = await getPostLikes(postId);
    const userLike = likesList.docs.find(like => like.data().UserId == userId 
    && like.data().PostId == postId);

    if (userLike == null) {
        await addDoc(collection(db, 'PostLikes'), {
            UserId: userId,
            PostId: postId
        });
    } else {
        removeUserLike(userLike.id);
    }
}

export async function getPostLikes(postId) {
    return await getDocs(query(collection(db, 'PostLikes'), where('PostId', '==', postId)));
}

export async function removeUserLike(likeId) {
    await deleteDoc(doc(db, 'PostLikes', likeId));
}
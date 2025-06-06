'use strict';

import {getFirestore, getDocs, doc, addDoc, collection, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();
const ref = collection(db, 'PostLikes');

export async function deleteAllPostLike(postId) {
    const likeList = await getPostLikes(postId);

    for (const likeDoc of likeList.docs) {
        await deleteDoc(doc(db, 'PostLikes', likeDoc.id));
    }
}

export async function addUserLikePost(userId, postId) {
    const likesList = await getPostLikes(postId);
    const userLike = likesList.docs.find(like => like.data().UserId == userId 
    && like.data().PostId == postId);

    if (userLike == null) {
        await addDoc(ref, {
            UserId: userId,
            PostId: postId
        });
    } else {
        removeUserLike(userLike.id);
    }
}

export async function getPostLikes(postId) {
    if (postId == null) return null;
    return await getDocs(query(ref, where('PostId', '==', postId)));
}

export async function removeUserLike(likeId) {
    await deleteDoc(doc(db, 'PostLikes', likeId));
}
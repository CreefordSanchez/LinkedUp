"use strict";

import { getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();
const ref = collection(db, 'Friends');

export async function addFriend(friend) {
    await addDoc(ref, friend);
}

export async function editFriend(id, friend) {
    await updateDoc(doc(db, 'Friends', id), friend);
}

export async function getFriendById(id) {
    return await getDoc(doc(db, 'Friends', id));
}
export async function getFriendByTwoId(senderId, recieverId) {
    const friend = await getDocs(query(ref,
        where('SenderId', '==', senderId),
        where('RecieverId', '==', recieverId)));

    return friend.docs[0];
}


export async function deleteFriend(id) {
    await deleteDoc(doc(db, 'Friends', id));
}

export async function getAllUserRequested(userId) {
    return await getDocs(query(ref, where('RecieverId', '==', userId)));
}

export async function getAllUserRequest(userId) {
    return await getDocs(query(ref, where('SenderId', '==', userId)));
}
'use strict';

import { getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();
const roomRef = collection(db, 'Chat');
const messageRef = collection(db, 'Message');

export async function addMessage(message) {
    await addDoc(messageRef, message);
}

export async function addChat(chat) {
    await addDoc(roomRef, chat);  
}

export async function getChat(user1, user2) {
    const chat1 = await getDocs(query(roomRef,
        where('User1', '==', user1),
        where('User2', '==', user2),
    ))

    const chat2 = await getDocs(query(roomRef,
        where('User1', '==', user2),
        where('User2', '==', user1),
    ))

    if (chat1.docs.length > 0) {
        return chat1.docs[0];
    }

    return chat2.docs[0];
}
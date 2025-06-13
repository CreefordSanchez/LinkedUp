"use strict";

import { getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const db = getFirestore();

export async function newUser(name, email, password) {
    const findUser = await getUserByEmail(email);

    if (findUser != null) {
        return false;
    }
    
    await addDoc(collection(db, 'Users'), {
        Name: name,
        Email: email,
        Password: password,
        ProfilePicture: ''
    });

    return true;
}

export async function getAllUser() {
    return await getDocs(collection(db, 'Users'));
}

export async function getUserByEmail(email) {
    const user = await getDocs(query(collection(db, 'Users'), where('Email', '==', email)));

    if (user.docs[0] == null) {
        return null;
    }

    return user.docs[0];
}

export async function getUserById(id) {
    const user = await getDoc(doc(db, 'Users', id));

    if (user == null) {
        return null;
    }

    return user;
}

export async function editUserPicture(id, image) {
    const userDoc = await getUserById(id);
    const user = userDoc.data();

    user.ProfilePicture = image;

    await updateDoc(doc(db, 'Users', id), user);
}
"use strict";

import { getFirestore, getDocs, doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { User } from "../data/models.js";

const db = getFirestore();
const userConverter = {
    toFirestore: (user) => {
        return {
            Name: user.Name,
            Email: user.Email,
            Password: user.Password,
            ProfilePicture: user.ProfilePicture
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.Name, data.Email, data.Password, data.ProfilePicture);
    }
}

export async function newUser(user) {
    const findUser = await getUserByEmail(user.Email);

    if (findUser != null) {
        return false;
    }

    await addDoc(collection(db, 'Users').withConverter(userConverter), user);
    return true;
}

export async function getAllUser() {
    const snapshot = await getDocs(collection(db, 'Users'));
    const users = snapshot.docs.map(doc => doc.data());
    
    return users;
}

export async function getUserByEmail(email) {
    const user = await getDocs(query(collection(db, 'Users'), where('Email', '==', email)));

    if (user.docs[0] == null) {
        return null;
    }

    return user.docs[0];
}

export async function getUserById(id) {
    const user = await getDoc(db, 'Users', id);

    if (user == null) {
        return null;
    }

    return user;
}
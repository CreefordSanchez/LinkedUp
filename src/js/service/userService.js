"use strict";

import { getFirestore, getDocs,doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
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
    const list = await getAllUser();
    const findUser = list.find(obj => obj.Email == user.Email);
    
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

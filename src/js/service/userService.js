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
    await addDoc(collection(db, 'Users').withConverter(userConverter), user);
}

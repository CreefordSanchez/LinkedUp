'use strict';

import { listen, select, newElementClass, toImage, style, getCookieUser, selectAll, giveClass, toBase64 } from "./data/utility.js";
import { getUserById } from "./service/userService.js";
import { getAllUser } from "./service/userService.js";
import { getFriendByTwoId, addFriend, deleteFriend, getAllUserRequested, getAllUserRequest, getFriendById, editFriend } from "./service/friendService.js";

const displayList = select('.display-list');

listen(window, 'load', async () => {
    newFriendsBtn.click();
});

/*Displaying Users*/
const newFriendsBtn = select('.show-new-friends');
const friendsBtn = select('.show-friends');
const requestBtn = select('.show-request');
const requestedBtn = select('.show-requested');

listen(newFriendsBtn, 'click', async () => {
    displayList.innerHTML = '';
    newFriendsBtn.disabled = true;

    await displayNewUserList();

    friendsBtn.disabled = false;
    requestBtn.disabled = false;
    requestedBtn.disabled = false;
});

async function displayNewUserList() {
    const userList = await getAllUser();
    let userId = getCookieUser();
    
    if (userList.empty) {
        displayList.innerHTML = '<h1>No new users currently</h1>';
    } else {
        for (const user of userList.docs) {
            if (user.id != userId 
                && await getFriendByTwoId(userId, user.id) == null
                && await getFriendByTwoId(user.id, userId) == null) {
                displayNewUser(user);
            }
        }
    }
}

async function displayNewUser(userDoc) {
    const user = userDoc.data();
    const userBox = newElementClass('div', 'user-box');

    userBox.innerHTML = `
    <div class="user-image-box" style="background-image: url(${toImage(user.ProfilePicture)})">
    </div>
    <div class="name-button">
        <p class="friend-name">${user.Name}</p>
        <button class="friend-button flex-center border-5" data-id="${userDoc.id}">Add Friend</button>
    </div>`;

    displayList.append(userBox);
}

listen(friendsBtn, 'click', async () => {
    displayList.innerHTML = '';
    friendsBtn.disabled = true;

    await displayFriends();
    
    requestBtn.disabled = false;
    requestedBtn.disabled = false;
    newFriendsBtn.disabled = false;
});

async function displayFriends() {
    let userId = getCookieUser();
    let isEmpty = true;
    const requestList = await getAllUserRequest(userId)
    const requestedList = await getAllUserRequested(userId);

    if (requestList.size > 0) {        
        for (const friend of requestList.docs) {
            if (friend.data().IsAccepted) {
                isEmpty = false;
                await displayUser(friend, friend.data().RecieverId);
            }
        }
    } 

    if (requestedList.size > 0) {
        for (const friend of requestedList.docs) {
            if (friend.data().IsAccepted) {
                isEmpty = false;
                await displayUser(friend, friend.data().SenderId);
            }        
        }
    }

    if (isEmpty) {
        displayList.innerHTML = '<h1>No Friends</h1>'
    }
}


listen(requestBtn, 'click', async () => {
    displayList.innerHTML = '';
    requestBtn.disabled = true;

    await displayRequest();
    
    newFriendsBtn.disabled = false;
    friendsBtn.disabled = false;
    requestedBtn.disabled = false;
});

async function displayRequest() {
    let userId = getCookieUser();
    let isEmpty = true;
    const requestList = await getAllUserRequest(userId);
    for (const friend of requestList.docs) {
        if (!friend.data().IsAccepted) {
            isEmpty = false;
            await displayUser(friend, friend.data().RecieverId);
        }
    }

    if (isEmpty) {
        displayList.innerHTML = '<h1>No Send Friend Request</h1>';
    }
}

async function displayUser(friendDoc, userId) {
    const getUser = await getUserById(userId);
    const user = getUser.data();
    const userBox = newElementClass('div', 'user-box');

    userBox.innerHTML = `
    <div class="user-image-box" style="background-image: url(${toImage(user.ProfilePicture)})">
    </div>
    <div class="name-button">
        <p class="friend-name">${user.Name}</p>
        <button class="un-friend-button flex-center border-5" data-id="${friendDoc.id}">Remove Friend</button>
    </div>`;

    displayList.append(userBox);
}

listen(requestedBtn, 'click', async () => {
    displayList.innerHTML = '';
    requestedBtn.disabled = true;
    
    await displayRequested();
    
    newFriendsBtn.disabled = false;
    friendsBtn.disabled = false;
    requestBtn.disabled = false;
});

async function displayRequested() {
    let userId = getCookieUser();
    let isEmpty = true;
    const requestedList = await getAllUserRequested(userId);

    if (requestedList.size > 0) {
        for (const friend of requestedList.docs) {
            if (!friend.data().IsAccepted) {
                isEmpty = false;
                await displayRequestedUser(friend, friend.data().SenderId);
            }
        }
    } 
    
    if (isEmpty) {
        displayList.innerHTML = '<h1>No Friend Requested</h1>'
    }
}

async function displayRequestedUser(friendDoc, userId) {
    const getUser = await getUserById(userId);
    const user = getUser.data();
    const userBox = newElementClass('div', 'user-box');

    userBox.innerHTML = `
    <div class="user-image-box" style="background-image: url(${toImage(user.ProfilePicture)})">
    </div>
    <div class="name-button">
        <p class="friend-name">${user.Name}</p>
        <button class="un-friend-button flex-center border-5" data-id="${friendDoc.id}">Denied Request</button>
        <button class="add-friend-button flex-center border-5" data-id="${friendDoc.id}">Accept Request</button>
    </div>`;

    displayList.append(userBox);
}

/*Button in UserBox*/
listen(displayList, 'click', async (e) => {
    const element = e.target;
    const userBox = element.closest('.user-box');

    if (element.closest('.friend-button')) {
        const button = element.closest('.friend-button');
        let buttonId = button.dataset.id;

        await addFriend({
            SenderId: getCookieUser(),
            RecieverId: buttonId,
            IsAccepted: false
        });

        style(userBox, 'display', 'none');
    }

    if (element.closest('.un-friend-button')) {
        const button = element.closest('.un-friend-button');
        let buttonId = button.dataset.id;
        await deleteFriend(buttonId);

        style(userBox, 'display', 'none');
    }

    if (element.closest('.add-friend-button')) {
        const button = element.closest('.add-friend-button');
        let buttonId = button.dataset.id;
        const friendDoc = await getFriendById(buttonId);
        const friend = friendDoc.data();
        
        friend.IsAccepted = true;

        await editFriend(friendDoc.id, friend);
        style(userBox, 'display', 'none');
    }
});
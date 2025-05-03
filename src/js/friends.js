'use strict';

import { listen, select, newElementClass, toImage, style, getCookieUser, selectAll, giveClass, toBase64 } from "./data/utility.js";
import { getUserById } from "./service/userService.js";
import { getAllUser } from "./service/userService.js";
import { getFriendByTwoId, addFriend, deleteFriend, getAllUserRequested, getAllUserRequest } from "./service/friendService.js";

//Load Content
const userHeader = select('.user-profile-header');
const displayList = select('.display-list');

listen(window, 'load', async () => {
    if (document.cookie == '') {
        window.location.href = './loggin.html';
    }

    await loadMainContent();
});

async function loadMainContent() {
    const pararms = new URLSearchParams(window.location.search);
    const userId = pararms.get('userId');

    if (userId == null) {
        window.location.href = './index.html';
    }
    await loadUserHeader(userId);
    newFriendsBtn.click();
}

async function loadUserHeader(userViewId) {
    const userView = await getUserById(userViewId);

    if (userView.data() == null) {
        window.location.href = './index.html';
    }

    let userId = document.cookie.split('=')[1];
    const user = await getUserById(userId);
    userHeader.innerHTML = `
    <div class="profile">
        ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
    </div>
    <a class="user-name" href="./userProfile.html?userId=${user.id}">${user.data().Name}</a>`;
}

/*Displaying Users*/
const newFriendsBtn = select('.show-new-friends');
const friendsBtn = select('.show-friends');
const requestBtn = select('.show-request');
const requestedBtn = select('.show-requested');

listen(newFriendsBtn, 'click', async () => {
    displayList.innerHTML = '';
    newFriendsBtn.disabled = true;
    friendsBtn.disabled = false;
    requestBtn.disabled = false;
    requestedBtn.disabled = true;

    await displayNewUserList();
});

async function displayNewUserList() {
    const userList = await getAllUser();
    let userId = getCookieUser();

    if (userList.empty) {
        displayList.innerHTML = '<h1>No new users currently';
    } else {
        for (const user of userList.docs) {
            if (user.id != userId) {
                if (await getFriendByTwoId(userId, user.id) == null) {
                    displayNewUser(user);
                }
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
    newFriendsBtn.disabled = false;
    friendsBtn.disabled = true;
    requestBtn.disabled = false;
    requestedBtn.disabled = true;

    await displayFriends();
});

async function displayFriends() {
    let userId = getCookieUser();
    const getRequest = await getAllUserRequest(userId)
    const getRequested = await getAllUserRequested(userId);

    if (getRequest.size > 0) {
        const requestList = getRequest.docs.filter(friend => !friend.data.IsAccepted);

        for (const friend of requestList) {
            await displayUser(friend, friend.data().RecieverId);
        }
    }

    if (getRequested.size > 0) {
        const requestedList = getRequested.docs.filter(friend => !friend.data.IsAccepted);

        for (const friend of requestedList) {
            await displayUser(friend, friend.data().SenderId);
        }
    }
}


listen(requestBtn, 'click', () => {
    displayList.innerHTML = '';
    newFriendsBtn.disabled = false;
    friendsBtn.disabled = true;
    requestBtn.disabled = true;
    requestedBtn.disabled = true;
});

async function displayRequest() {
    let userId = getCookieUser();

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

listen(requestedBtn, 'click', () => {
    displayList.innerHTML = '';
    newFriendsBtn.disabled = false;
    friendsBtn.disabled = true;
    requestBtn.disabled = true;
    requestedBtn.disabled = true;
});

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
});

async function getFriendStatus(userId, friendId) {
    const request = await getFriendByTwoId(userId, friendId);
    if (request != null) {
        return request.data().IsAccepted;
    }

    const requested = await getFriendByTwoId(friendId, userId);
    if (requested != null) {
        return requested.data().IsAccepted;
    }

    return null;
}

function editButtonType(button, type) {
    const dataId = button.dataset.id.split('/');
    const newDataId = `${dataId[0]}/${type}`;

    button.dataset.id = newDataId;

    if (type) {
        button.innerText = 'Remove Friend';
    } else {
        button.innerText = 'Add Friend';
    }
}
'use strict';

import { listen, select, newElementClass, toImage, style, getCookieUser, selectAll, giveClass, toBase64 } from "./data/utility.js";
import { getUserById } from "./service/userService.js";
import { getAllUser } from "./service/userService.js";
import { getFriendByTwoId, addFriend } from "./service/friendService.js";

//Load Content
const userHeader = select('.user-profile-header');
const displayList = select('.display-list');

listen(window, 'load', async () => {
    if (document.cookie == '') {
        window.location.href = './loggin.html';
    }  
    
    await loadMainContent();    
});

async function loadMainContent () {
    const pararms = new URLSearchParams(window.location.search);
    const userId = pararms.get('userId');

    if (userId == null) {
        window.location.href = './index.html';
    }
    await loadUserHeader(userId);
    homeBtn.click();
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
const homeBtn = select('.show-home');
const friendsBtn = select('.show-friends');
const requestBtn = select('.show-request');
const requestedBtn = select('.show-requested');

listen(homeBtn, 'click', () => {
    displayHomeUser();
});

async function displayHomeUser() {
    const userList = await getAllUser();
    let userId = getCookieUser();

    for(const user of userList.docs) {
        if (user.id != userId) {
            if (await getFriendByTwoId(userId, user.id) == null) {
                displayUser(user);
            }
        }
    }
}

async function displayUser(userDoc) {
    const user = userDoc.data();
    const userBox = newElementClass('div', 'user-box');
    const friendStatus = await getFriendStatus(getCookieUser(), userDoc.id);
    userBox.innerHTML = `
    <div class="user-image-box" style="background-image: url(${toImage(user.ProfilePicture)})">
    </div>
    <div class="name-button">
        <p class="friend-name">${user.Name}</p>
        ${friendStatus ? `<button class="friend-button flex-center border-5" data-id="${userDoc.id}/${friendStatus}">Send Friend friend</button>`
        : `<button class="friend-button flex-center border-5" data-id="${userDoc.id}/${friendStatus}">Add Friend</button>`}
    </div>`;

    displayList.append(userBox);
}

/*Button in UserBox*/ 
listen(displayList, 'click', async(e) => {
    const element = e.target;

    if (element.closest('.friend-button')) {
        const userBox = element.closest('.user-box');
        const button = element.closest('.friend-button');
        let buttonId = button.dataset.id.split('/');
        
        await addFriend({
            SenderId: getCookieUser(),
            RecieverId: buttonId[0],
            IsAccepted: false
        });

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

    return false;   
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
'use strict';

import { listen, select, toImage, getCookieUser, removecookie, style } from './utility.js';
import { getUserById } from '../service/userService.js';

const userHeader = select('.user-profile-header');
const headerFriendBtn = select('.friend-nav-button');
const headerChatsBtn = select('.chat-nav-button');
const profile = select('.user-profile-header .profile');
const userName = select('.user-profile-header .user-post-name');
const headerProfileMenu = select('.profile-header-menu');
const viewProfile = select('.view-profile');
const logOut = select('.log-out');


if (document.cookie == '') {
    window.location.href = './loggin.html';
}  

listen(window, 'load', async () => {
    await loadUserHeader();  
});

listen(userName, 'click', () => {
    if (headerProfileMenu.style.display == 'grid') {
        style(headerProfileMenu, 'display', 'none');
    } else {
        style(headerProfileMenu, 'display', 'grid');
    }
});

listen(viewProfile, 'click', () => {
    window.location.href = `./userProfile.html?userId=${getCookieUser()}`;
});

listen(logOut, 'click', () => {
    removecookie()
    window.location.href = `./loggin.html`;
});

async function loadUserHeader() {
    let userId = getCookieUser();
    const user = await getUserById(userId);

    profile.innerHTML = `
            ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
    `;

    userName.innerText = `${user.data().Name}`;

    headerFriendBtn.innerHTML = `
        <a href="./friends.html?userId=${userId}"><i class="fa-solid fa-user-group"></i></a>
    `;

    headerChatsBtn.innerHTML = `
    <a href="./chats.html?userId=${userId}"><i class="fa-solid fa-message"></i></a>
`;
}
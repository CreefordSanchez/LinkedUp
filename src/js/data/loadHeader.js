'use strict';

import { listen, select, toImage, getCookieUser, removecookie, style, selectAll, removeClass, giveClass } from './utility.js';
import { getUserById } from '../service/userService.js';

const headerFriendBtn = selectAll('.friend-nav-button');
const profile = select('.user-profile-header .profile');
const userName = select('.user-profile-header .user-post-name');
const headerProfileMenu = select('.profile-header-menu');
const viewProfile = select('.view-profile');
const logOut = selectAll('.log-out');
const sideNav = select('.header-side-nav');
const sideNavProfilePic = select('.side-nav-profile .profile');
const sideNavProfile = select('.side-nav-profile p');
const openHeaderNav = select('.open-header-nav');

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

listen(sideNavProfile, 'click', () => {
    window.location.href = `./userProfile.html?userId=${getCookieUser()}`;
});

logOut.forEach(btn => {
    listen(btn, 'click', () => {
        removecookie()
        window.location.href = `./loggin.html`;
    });
})

let isOpened = false;

listen(openHeaderNav, 'click', () => {
    if (isOpened) {
        removeClass(sideNav, 'header-side-show');
        isOpened = false;
    } else {
        giveClass(sideNav, 'header-side-show');
        isOpened = true;
    }
})

async function loadUserHeader() {
    let userId = getCookieUser();
    const user = await getUserById(userId);

    sideNavProfilePic.innerHTML = `
            ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
    `;
    
    profile.innerHTML = `
            ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
    `;

    userName.innerText = `${user.data().Name}`;

    headerFriendBtn[0].innerHTML = `
            <a href="./friends.html?userId=${userId}"><i class="fa-solid fa-user-group"></i></a>
    `;

    headerFriendBtn[1].innerHTML = `
            <a href="./friends.html?userId=${userId}"><i class="fa-solid fa-user-group"></i> Friends</a>
    `;
}
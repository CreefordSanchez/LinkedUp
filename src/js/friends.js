'use strict';

import { listen, select, newElementClass, toImage, style, getCookieUser, selectAll, giveClass, toBase64 } from "./data/utility.js";
import { getUserById } from "./service/userService.js";

//Load Content
const userHeader = select('.user-profile-header');

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

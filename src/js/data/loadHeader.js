import { listen, select, toImage, getCookieUser } from './utility.js';
import { getUserById } from '../service/userService.js';

//Load content
const userHeader = select('.user-profile-header');
const headerFriendBtn = select('.friend-nav-button');

listen(window, 'load', async () => {
    if (document.cookie == '') {
        window.location.href = './loggin.html';
    }  

    await loadUserHeader();  
});

async function loadUserHeader() {
    let userId = getCookieUser();
    const user = await getUserById(userId);

    userHeader.innerHTML = `
    <div class="profile">
        ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
    </div>
    <a class="user-post-name" href="./userProfile.html?userId=${userId}">${user.data().Name}</a>`;

    headerFriendBtn.innerHTML = `
        <a href="./friends.html?userId=${userId}"><i class="fa-solid fa-user-group"></i></a>
    `;
}
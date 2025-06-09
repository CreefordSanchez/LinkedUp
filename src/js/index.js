'use strict';

import { listen, select, newElementClass, toImage, getCookieUser } from './data/utility.js';
import { getAllFriends } from './service/friendService.js';
import {getUserById} from './service/userService.js'

const friendList = select('.friend-list');

listen(window, 'load', async () => {
    await printFriend();
});

async function printFriend() {
    let userId = getCookieUser();
    let isEmpty = true;
    const frienList = await getAllFriends(userId);

    for (const friendDoc of frienList) {
        const friend = friendDoc.data();
        if (friend.IsAccepted) {
            isEmpty = false;
            let friendId = friend.RecieverId == userId ? friend.SenderId : friend.RecieverId;
            await displayUser(friendId);
        }
    }
    
    if (isEmpty) {
        friendList.innerHTML = '<p>No Friends</p>'
    }
}

async function displayUser(userId) {
    const getUser = await getUserById(userId);
    const user = getUser.data();
    const userBox = newElementClass('div', 'user-friend flex gap-10 pad-15');

    userBox.innerHTML = `
    <div class="profile">
         ${user.ProfilePicture == '' ? '' : `<img src="${toImage(user.ProfilePicture)}">`}
    </div>
    <a class="user-post-name" href="./userProfile.html?userId=${getUser.id}">${user.Name}</a>
    `;

    friendList.append(userBox);
}
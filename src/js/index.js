'use strict';

import { toBase64, listen, select, style, selectAll, giveClass, newElementClass, toImage, getCookieUser } from './data/utility.js';
import { getAllUserRequest, getAllUserRequested } from './service/friendService.js';
import {getUserById} from './service/userService.js'

const friendList = select('.friend-list');

listen(window, 'load', async () => {
    await printFriend();
});

async function printFriend() {
    let userId = getCookieUser();
        let isEmpty = true;
        const requestList = await getAllUserRequest(userId)
        const requestedList = await getAllUserRequested(userId);
    
        if (requestList.size > 0) {        
            for (const friend of requestList.docs) {
                if (friend.data().IsAccepted) {
                    isEmpty = false;
                    await displayUser(friend.data().RecieverId);
                }
            }
        } 
    
        if (requestedList.size > 0) {
            for (const friend of requestedList.docs) {
                if (friend.data().IsAccepted) {
                    isEmpty = false;
                    await displayUser(friend.data().SenderId);
                }        
            }
        }
    
        if (isEmpty) {
            displayList.innerHTML = '<h1>No Friends</h1>'
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
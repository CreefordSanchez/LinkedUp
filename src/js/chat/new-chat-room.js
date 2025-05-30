'use strict';

import {listen, select, getCookieUser, newElementClass} from '../data/utility.js';
import { getAllFriends } from '../service/friendService.js';
import { addChat, addMessage, getChat } from '../service/chatService.js';
import { getUserById } from '../service/userService.js';

const openCreate = select('.new-chat');
const newChatList = select('.new-chat-list');

listen(window, 'load', async() => {
    const list = await getAllFriends(getCookieUser());
    
    for (const friend of list) {
        let friendId = friend.data().SenderId == getCookieUser() ? friend.data().RecieverId : friend.data().SenderId;
        if (await getChat(getCookieUser(), friendId) == null &&
            await getChat(friendId, getCookieUser()) == null) {
            displayFriend(friendId);
        }
    }
});

listen(newChatList, 'click', async(e) => {
    const element = e.target;
    
});

async function displayFriend(friendId) {
    const userDoc = await getUserById(friendId);
    const user = userDoc.data();
    const newChatRoom = newElementClass('div', 'chat-room flex flex-align-center pad-top-15');

    newChatRoom.innerHTML = `
    <div class="profile">
        ${user.ProfilePicture == '' ? '' : `<img src="${toImage(user.ProfilePicture)}">`}
    </div>
    <p class="title">${user.Name}</p>
    `;

    newChatList.append(newChatRoom);    
}
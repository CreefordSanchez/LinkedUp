'use strict';

import { listen, select, newElementClass, toImage, style } from "./data/utility.js";
import { getUserPosts } from "./service/postService.js";
import { getPostLikes } from "./service/postLikeService.js";
import { getUserById } from "./service/userService.js";

//Load content
const userHeader = select('.user-profile-header');
const postContainer = select('.scrolling-container');
const userPicture = select('.profile-user-detail .profile img');

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
    await loadPost(userId);
}

async function loadPost(userId) {
    const postList = await getUserPosts(userId);

    for (const post of postList.docs) {
        const user = await getUserById(post.data().UserId);
        await addUserPost(post, user.data());        
    }
}

async function addUserPost(postDoc, user) {
    const postBox = newElementClass('div', 'post-box');
    const post = typeof postDoc?.data == 'function' ? postDoc.data() : postDoc;
    const likeList = await getPostLikes(postDoc.id);

    postBox.innerHTML = `
        <div class="post-header">
            <div class="profile">
                <img src="${toImage(user.ProfilePicture)}">
            </div>
            <p class='user-post-name'>${user.Name}</p>
        </div>    
        <p class="post-text">${post.Description}</p>  
        ${post.Photo == '' ? '' : `<img src="${toImage(post.Photo)}">`}
        <p class="like-counter" data-id="${postDoc.id}"><i class="fa-solid fa-thumbs-up"></i> ${likeList == null ? 0 : likeList.size}</p>
        <div class="post-buttons">
            <button class="like-btn" data-id="${postDoc.id}">
                <i class="fa-solid fa-thumbs-up"></i>
                <p>Like</p>
            </button>
            <button class="comment-btn" data-id="${postDoc.id}">
                <i class="fa-solid fa-comment"></i>
                <p>Comment</p>
            </button>
        </div>`;
    postContainer.append(postBox);
}

async function loadUserHeader() {
    let userId = document.cookie.split('=')[1];
    const user = await getUserById(userId);

    userHeader.innerHTML = `
    <div class="profile">
        <img src="${toImage(user.data().ProfilePicture)}">
    </div>
    <p>${user.data().Name}</p>`;

    console.log(userPicture);
    userPicture.src = toImage(user.data().ProfilePicture);
}
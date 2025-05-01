'use strict';

import { listen, select, newElementClass, toImage, style, getCookieUser } from "./data/utility.js";
import { getUserPosts } from "./service/postService.js";
import { getPostLikes } from "./service/postLikeService.js";
import { getUserById } from "./service/userService.js";

//Load content
const userHeader = select('.user-profile-header');
const postContainer = select('.scrolling-container');
const userPicture = select('.profile-user-detail .profile img');
const userName = select('.user-name');
const userPostCount = select('.user-post-count');

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
    await showCreatePost(userId);
    await loadPost(userId);
}

async function showCreatePost(userId) {
    if (getCookieUser() == userId) {
        const user = await getUserById(getCookieUser());

        postContainer.innerHTML = `
        <div class="create-post-box padding-around">
                    <div class="mock-input-box flex">
                        <div class="profile">
                            ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
                        </div>
                        <div class="show-create-form input-create flex-center">
                            <p>Something in mind?</p>
                        </div>
                    </div>
                    <div class="mock-create-btn flex-between flex-align-center">
                        <div class="show-create-form img-button flex-align-center">                                
                            <i class="fa-solid fa-image"></i>
                            <p>Image</p>
                        </div>
                        <div class="show-create-form post-button">
                            <p>Post</p>
                        </div>
                    </div>
                </div>`
    }
}

async function loadPost(userId) {
    const postList = await getUserPosts(userId);
    
    userPostCount.innerText = `${postList.size} Post`;

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
                ${user.ProfilePicture == '' ? '' : `<img src="${toImage(user.ProfilePicture)}">`}
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
    <p>${user.data().Name}</p>`;

    userPicture.src = toImage(userView.data().ProfilePicture);
    userName.innerText = userView.data().Name;
}
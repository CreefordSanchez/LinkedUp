'use strict';

import { listen, select, newElementClass, toImage } from './utility.js';
import { getUserById } from '../service/userService.js';
import { getAllPost } from '../service/postService.js';
import { getPostLikes } from '../service/postLikeService.js'

const postContainer = select('.scrolling-container');

listen(window, 'load', async () => {
    await loadPost(); 
});

async function loadPost() {
    const postList = await getAllPost();
    for (const post of postList.docs) {
        const user = await getUserById(post.data().UserId);
        await addUserPost(post, user);        
    }
}

async function addUserPost(postDoc, userDoc) {
    const postBox = newElementClass('div', 'post-box');
    const likeList = await getPostLikes(postDoc.id);
    const post = postDoc.data();
    const user = userDoc.data()
    postBox.innerHTML = `
        <div class="post-header">
            <div class="profile">
                ${user.ProfilePicture == '' ? '' : `<img src="${toImage(user.ProfilePicture)}">`}
            </div>
            <a class="user-post-name" href="./userProfile.html?userId=${userDoc.id}">${user.Name}</a>
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
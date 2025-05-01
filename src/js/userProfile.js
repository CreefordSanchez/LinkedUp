'use strict';

import { listen, select, newElementClass, toImage, style, getCookieUser } from "./data/utility.js";
import { getUserPosts } from "./service/postService.js";
import { getPostLikes } from "./service/postLikeService.js";
import { getUserById } from "./service/userService.js";
import { addUserLikePost } from "./service/postLikeService.js";
import { getAllPostComment, addPostComment } from "./service/postCommentService.js";

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

//Handle like/comment Action by target
listen(postContainer, 'click', async(e) => {
    const element = e.target;

    if (element.closest('.like-btn')) {        
        let id = element.closest('.like-btn').dataset.id;
        await addPostLike(id);
    }

    if (element.closest('.comment-btn')) {        
        let id = element.closest('.comment-btn').dataset.id;
        await showPostComment(id)
        await loadCommentPost(id);
    }
});

//Like Post
async function addPostLike(postId) {
    await addUserLikePost(getCookieUser(), postId);

    const likeCounter = select(`.like-counter[data-id="${postId}"]`);
    const likeList = await getPostLikes(postId);

    likeCounter.innerHTML = `<i class="fa-solid fa-thumbs-up"></i> ${likeList.size}`;
}

//Comment Post
const commentContainer = select('.comment-post-container');
const commentList = select('.comment-list');
const commentInput = select('.user-comment-input');
const closeCommentBtn = select('.close-comment-post');
const postCommentBtn = select('.post-comment');

listen(postCommentBtn, 'click', async () => {
    if (isCommentValid()) {
        let postId = postCommentBtn.dataset.id;
        await addPostComment(postId, getCookieUser(), commentInput.value);
        printCommentPost({
            Comment: commentInput.value,
            UserId: getCookieUser()
        });
        commentInput.value = '';
        style(postCommentBtn, 'color', '#141414');
    }
});

listen(commentInput, 'input', () => {
    isCommentValid();
});

listen(closeCommentBtn, 'click', () => {
    style(commentContainer, 'display', 'none');
    commentList.innerHTML = ``
});

async function loadCommentPost(postId) {
    const list = await getAllPostComment(postId);
    
    if (list.size > 0) {
        for (const comment of list.docs) {                
            printCommentPost(comment.data());
        }
    } else {
        commentList.innerHTML = `
        <div class="no-comment-found flex-center">
            <h1>No comment in this post</h1>
        </div>`;
    }   
}

async function printCommentPost(doc) {
    const comment = newElementClass('div', 'user-comment');
    const user = await getUserById(doc.UserId);

    if (select('.no-comment-found') != null) {
        commentList.innerHTML = '';
    }

    comment.innerHTML = `
    <div class="profile"></div>
    <div class="text">
        <p class="user-comment-name">${user.data().Name}</p>
        <p class="user-text">
            ${doc.Comment}
        </p>
    </div>`;

    commentList.append(comment);
}

function isCommentValid() {
    if (commentInput.value == '') {        
        style(postCommentBtn, 'color', '#141414');
        return false;
    } 
    style(postCommentBtn, 'color', '#bb00bb');
    return true;
}

async function showPostComment(postId) {
    style(commentContainer, 'display', 'flex');
    postCommentBtn.dataset.id = postId;
}

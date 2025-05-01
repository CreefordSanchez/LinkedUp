'use strict';

import { toBase64, listen, select, style, selectAll, giveClass, newElementClass, toImage, getCookieUser } from './data/utility.js';
import { getUserByEmail, getUserById } from './service/userService.js';
import { newPost, getAllPost, getPostById } from './service/postService.js';
import { addUserLikePost, getPostLikes } from './service/postLikeService.js'
import { addPostComment, getAllPostComment } from './service/postCommentService.js';

//Load content
const userHeader = select('.user-profile-header');
const postContainer = select('.scrolling-container');

listen(window, 'load', async () => {
    if (document.cookie == '') {
        window.location.href = './loggin.html';
    }  
    await loadMainContent();    
});

async function loadMainContent () {
    await loadUserHeader();
    await loadPost();
}

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

async function loadUserHeader() {
    let userId = document.cookie.split('=')[1];
    const user = await getUserById(userId);
    userHeader.innerHTML = `
    <div class="profile">
        ${user.data().ProfilePicture == '' ? '' : `<img src="${toImage(user.data().ProfilePicture)}">`}
    </div>
    <p>${user.data().Name}</p>`;
}

//mock create form 
const showCreate = selectAll('.show-create-form');

showCreate.forEach(btn => {
    listen(btn, 'click', () => {
        closeForm(false);
    });
});

//Add new post form
const closeCreate = select('.close-create-form');
const createForm = select('.create-post-form-container');
const postImage = select('.post-image');
const postText = select('.post-description');
const imageBox = select('.select-image-box');
const addImageLogo = select('.select-image-logo');
const postBtn = select('.post-btn');

listen(postBtn, 'click', async () => {
    if (postText.value != '') {        
        let id = document.cookie.split('=')[1];
        let image = await toBase64(postImage.files[0]);
        let description = postText.value;
        let newPostId = await newPost(id, description, image);

        const user = await getUserById(id);
        const postDoc = await getPostById(newPostId.id);
        await addUserPost(postDoc, user.data());

        closeCreate.click();
    }
});

listen(postText, 'input', () => {
    if (postText.value == '') {
        validButton(false);
    } else {
        validButton(true);
    }
});

listen(postImage, 'change', () => {
    const file = postImage.files[0];

    if (file != null) {
        const reader = new FileReader();
        reader.onload = (item) => {
            if (validImage(item.target.result)) {                
                style(imageBox, 'backgroundImage', `url(${item.target.result})`);
                style(addImageLogo, 'display', 'none');
            } else {
                postImage.value = '';
            }
        };

        reader.readAsDataURL(file);
    }
});

listen(closeCreate, 'click', () => {
    postText.value = '';
    closeForm(true);
});

function validImage(img) {
    const data = img.split(';')[0];
    const type = data.split('/')[1];
    
    switch (type) {
        case 'jpeg':
        case 'jpg':
        case 'png':
            return true;
        default:
            return false;
    }
}

function validButton(isValid) {
    if (isValid) {
        style(postBtn, 'backgroundColor', '#bb00bb');
    } else {
        style(postBtn, 'backgroundColor', '#6d006d');
    }
}

function closeForm(remove) {
    if (remove) {
        style(imageBox, 'backgroundImage', 'none');
        style(addImageLogo, 'display', 'inline');
        style(createForm, 'display', 'none');
    } else {
        style(createForm, 'display', 'flex');
    }
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

//Like Post
async function addPostLike(postId) {
    await addUserLikePost(getCookieUser(), postId);

    const likeCounter = select(`.like-counter[data-id="${postId}"]`);
    const likeList = await getPostLikes(postId);

    likeCounter.innerHTML = `<i class="fa-solid fa-thumbs-up"></i> ${likeList.size}`;
}
'use strict';

import { listen, select, style, newElementClass, getCookieUser } from './utility.js';
import { getUserById } from '../service/userService.js';
import { addUserLikePost, getPostLikes } from '../service/postLikeService.js'
import { addPostComment, getAllPostComment } from '../service/postCommentService.js';

const postContainer = select('.scrolling-container');

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
'use strict';

import { listen, select, getCookieUser, giveClass, newElementClass, toImage, style, toBase64, selectAll } from "./data/utility.js";
import { editUserPicture, getUserById } from "./service/userService.js";
import { getUserPosts, deletePost } from "./service/postService.js";
import { getPostLikes } from "./service/postLikeService.js";
import { getAllUserRequest, getAllUserRequested } from "./service/friendService.js";

const createPostBox = select('.create-post-box');
const postContainer = select('.scrolling-container');
const userName = select('.user-name');
const userPostCount = select('.user-post-count');
const userFriendtCount = select('.user-friend-count');
const profilePicture = select('.profile-user-detail .profile');

listen(window, 'load', async () => {    
    await loadMainContent();    
});

async function loadMainContent () {
    const pararms = new URLSearchParams(window.location.search);
    const userId = pararms.get('userId');

    if (userId == null) {
        window.location.href = './index.html';
    }
    
    await isUserNotFound(userId);
    await showCreatePost(userId);
    await showFriendCount(userId);
    await loadPost(userId);
}

async function isUserNotFound(userId) {
    const userDocs = await getUserById(userId);
    const user = userDocs.data();

    if (user == null) {
        window.location.href = './index.html';
    } else {
        userName.innerText = `${user.Name}`;

        if (user.ProfilePicture != '') {
            style(selectImageLogo, 'display', 'none');
            style(profilePicture, 'backgroundImage', `url(${toImage(user.ProfilePicture)})`);
        } 
    }
}

async function showFriendCount(userId) {
    const getRequest = await getAllUserRequest(userId)
    const getRequested = await getAllUserRequested(userId);
    let count = 0;

    if (getRequest.size > 0) {
        const requestList = getRequest.docs.filter(friend => friend.data().IsAccepted);
        count += requestList.length;
    }

    if (getRequested.size > 0) {
        const requestedList = getRequested.docs.filter(friend => friend.data().IsAccepted);
        count += requestedList.length;
    } 
    userFriendtCount.innerText = `${count} Friends`;
}

async function showCreatePost(userId) {
    if (getCookieUser() != userId) {
        giveClass(createPostBox, 'remove-post-box-create');
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
            <i class="fa-solid fa-trash delete-post" data-id="${postDoc.id}"></i>
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

//Delete post
listen(postContainer, 'click', async (e) => {
    const element = e.target;

    if (element.closest('.delete-post')) {
        const post = element.closest('.post-box');
        await deletePost(element.dataset.id);

        style(post, 'display', 'none');
    }
});

//Edit Profile Picture
const pictureInput = select('.profile-picture');
const selectImageLogo = select('.select-photo-box');

listen(pictureInput, 'change', async () => {
    const file = pictureInput.files[0];
    
    if (file != null) {
        const reader = new FileReader();
        reader.onload = async (item) => {
            if (validPicture(item.target.result)) {    
                try {
                    await editProfilePictures(item.target.result);
                    style(profilePicture, 'backgroundImage', `url(${item.target.result})`);
                    style(selectImageLogo, 'display', 'none');
        
                }  catch(e) {
                    pictureInput.value = '';
                }                             
            } else {
                pictureInput.value = '';
            }
        };

        reader.readAsDataURL(file);
    }
});

async function editProfilePictures(image) {
    await editUserPicture(getCookieUser(), await toBase64(pictureInput.files[0]));
    const editAllPfPicture = selectAll('.post-header .profile');
    const headerPicture = select('.user-profile-header .profile');
    let img =  `<img src="${image}">`;

    editAllPfPicture.forEach(picture => {
        picture.innerHTML =  img;
    });
    
    headerPicture.innerHTML = img;
}

function validPicture(img) {
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
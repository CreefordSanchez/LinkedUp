'use strict';

import { toBase64, listen, select, style, selectAll, newElementClass, toImage } from './utility.js';
import { getUserById } from '../service/userService.js';
import { newPost, getPostById} from '../service/postService.js';
import { getPostLikes } from '../service/postLikeService.js'

const postContainer = select('.scrolling-container');

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
        await addUserPost(postDoc, user);

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

async function addUserPost(postDoc, userDoc) {
    const postBox = newElementClass('div', 'post-box');
    const likeList = await getPostLikes(postDoc.id);
    const post = postDoc.data();
    const user = userDoc.data();
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
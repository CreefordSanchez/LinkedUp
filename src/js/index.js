'use strict';

import { toBase64, listen, select, style, selectAll } from './data/utility.js';
import { getUserByEmail, getUserById } from './service/userService.js';
import { newPost } from './service/postService.js';

listen(window, 'load', async () => {
    if (document.cookie == '') {
        window.location.href = './loggin.html';
    } 
});

//mock create form 
const showCreate = selectAll('.show-create-form');

showCreate.forEach(btn => {
    listen(btn, 'click', () => {
        closeForm(false);
    });
});

//Create form
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
        await newPost(id, description, image);
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

//Comment Post
const commentContainer = select('.comment-post-container');
const closeCommentBtn = select('.close-comment-post');

listen(closeCommentBtn, 'click', () => {
    style(commentContainer, 'display', 'none');
});
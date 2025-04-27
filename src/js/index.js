'use strict';

import { removecookie, listen, select, style, selectAll } from './data/utility.js';
import { getUserByEmail } from './service/userService.js';

listen(window, 'load', () => {
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
    const test = await getUserByEmail('creewrk@gmail.com');
    console.log(test.data().Name);
});

listen(postImage, 'change', () => {
    const file = postImage.files[0];

    if (file != null) {
        const reader = new FileReader();
        reader.onload = (item) => {
            style(imageBox, 'backgroundImage', `url(${item.target.result})`);
            style(addImageLogo, 'display', 'none');
        };

        reader.readAsDataURL(file);
    }
});

listen(closeCreate, 'click', () => {
    postText.value = '';
    closeForm(true);
});

function closeForm(remove) {
    if (remove) {
        style(imageBox, 'backgroundImage', 'none');
        style(addImageLogo, 'display', 'inline');
        style(createForm, 'display', 'none');
    } else {
        style(createForm, 'display', 'flex');
    }
} 
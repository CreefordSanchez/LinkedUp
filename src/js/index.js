'use strict';

import { listen, select, style, selectAll } from './data/utility.js';

listen(window, 'load', () => {
    if (document.cookie == '') {
        //window.location.href = './loggin.html';
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
const postImageVal = select('.image-path');
const postText = select('.post-description');

listen(closeCreate, 'click', () => {
    postText.value = '';
    postImageVal.textContent = 'none';
    closeForm(true);
});

function closeForm(remove) {
    if (remove) {
        style(createForm, 'display', 'none');
    } else {
        style(createForm, 'display', 'flex');
    }
} 


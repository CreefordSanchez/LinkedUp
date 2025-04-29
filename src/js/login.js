"use strict";

import { listen, select, style } from "./data/utility.js";
import { newUser, getAllUser, getUserByEmail } from "./service/userService.js";

listen(window, 'load', () => {
    if (document.cookie != '') {
        window.location.href = 'index.html';
    }
});

//Login Validation
const emailLogin = select('.email-login');
const passwordLogin = select('.password-login');
const logginBtn = select('.loggin-btn');
const errorEmailLoggin = select('.error-email-login');
const errorPasswordLoggin = select('.error-password-login');

let regex = /^[a-zA-Z0-9._%+-]+@[a-z]+\.com$/;

listen(logginBtn, 'click', async () => {  
    if (validLoginInfo()) {
        if (await logginValidation()) {
            clearLogin();
            window.location.href = './index.html';
        }
    }
});
 
function setUserCookie(user) {
    document.cookie = `userId=${user.id}; expires=${getExpires()}; path=/`;
}

function getExpires() {
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); 
    return date.toUTCString();
}

async function logginValidation() {
    const getUser = await getUserByEmail(emailLogin.value);

    if (getUser == null) {
        errorEmailLoggin.textContent = 'Email not found';
        return false;
    }

    const user = getUser.data();

    if (user.Password != passwordLogin.value) {
        errorPasswordLoggin.textContent = 'Password is incorrect';
        return false;
    }

    setUserCookie(getUser);
    return true;
}

function clearLogin() {
    emailLogin.value = '';
    passwordLogin.value = '';
    errorEmailLoggin.textContent = '';
    errorPasswordLoggin.textContent  = '';
}

function validLoginInfo() {
    let validEmail = checkEmail(emailLogin.value, errorEmailLoggin);
    let validPassword = checkPassword(passwordLogin.value, errorPasswordLoggin);

    return validEmail && validPassword;
}

//Create Validation
const emailCreate = select('.email-create');
const passwordCreate  = select('.password-create');
const nameCreate  = select('.name-create');
const createBtn  = select('.create-btn');
const errorEmailCreate  = select('.error-email-create');
const errorPasswordCreate  = select('.error-password-create');
const errorNameCreate = select('.error-name-create');

listen(createBtn, 'click', async () => {
    if (createValidation()) {   
        if (await newUser(nameCreate.value, emailCreate.value, passwordCreate.value)) {
                clearCreate();
                Redirection(false);
        } else {
            errorEmailCreate.textContent = 'Email allready exist';
        }             
    }
});

function clearCreate() {
    emailCreate.value = '';
    nameCreate.value = '';
    passwordCreate.value = '';
    errorNameCreate.textContent = ''
    errorEmailCreate.textContent = '';
    errorPasswordCreate.textContent  = '';
    errorPasswordCreate.textContent = '';
}

function createValidation() {
    const validName = checkName(nameCreate.value, errorNameCreate);
    const validEmail = checkEmail(emailCreate.value, errorEmailCreate);
    const validPassword = checkPassword(passwordCreate.value, errorPasswordCreate);

    return validName && validEmail && validPassword;
}

function checkEmail(email, error) {
    if (email != '') {
        if (!regex.test(email)) {
            error.textContent  = 'example@gmail.com'; 
            return false;
        } else {
            error.textContent  = '';   
            return true; 
        }
    } else {
        error.textContent  = 'Enter Email';
        return false;
    }
}

function checkPassword(password, error) {
    if (password == '') {
        error.textContent = 'Enter Password';
        return false;
    } else {
        error.textContent = ''; 
        return true;
    }
}

function checkName(name, error) {
    if (name == '') {
        error.textContent = 'Enter Name';
        return false;
    }     
    
    error.textContent = '';
    return true;
}

//Redirect
const toLoginBtn = select(".redirect-login-btn");
const toCreateBtn = select(".redirect-create-btn");
const loginForm = select(".login-form");
const createForm = select(".create-form");

listen(toLoginBtn, 'click', () => {
    Redirection(false);
});
listen(toCreateBtn, 'click', () => {
    Redirection(true);
});

function Redirection(toCreate) {
    if (toCreate) {
        style(loginForm, 'display', 'none');
        style(createForm, 'display', 'inline');
    } else {
        style(loginForm, 'display', 'inline');
        style(createForm, 'display', 'none');
    }
}
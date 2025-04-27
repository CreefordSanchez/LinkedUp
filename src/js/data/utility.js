"use strict";

export function listen(select, event, callBack) {
    return select.addEventListener(event, callBack);
}

export function select(selector) {
    return document.querySelector(selector);
}

export function selectAll(select) {
    return document.querySelectorAll(select);
}

export function style(select, type, value) {
    return select.style[type] = value;
}

export async function toBase64(img) {
    if (img == null) return null;
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = () => resolve(reader.result.split(',')[1]); // Just the Base64 part
        reader.onerror = reject;
    
        reader.readAsDataURL(img);
    });    
}

export function toImage(base64) {
    return `data:image/jpeg;base64,${base64}`;
}

export function removecookie() {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
}
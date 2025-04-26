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

export function toBase64(img) {
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
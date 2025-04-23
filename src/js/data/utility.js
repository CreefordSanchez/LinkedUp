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
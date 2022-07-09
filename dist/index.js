"use strict";
const navButton = document.getElementById('navButton');
const nav = document.getElementById('nav');
navButton.addEventListener('click', () => {
    nav.classList.toggle('hidden');
});

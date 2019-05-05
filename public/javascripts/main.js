// Select DOM Items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const portrait = document.querySelector('.portrait');
const menuNav = document.querySelector('.menu-nav');
const menuBranding = document.querySelector('.menu-branding');
const header1 = document.querySelector('.lg-heading');
const navItems = document.querySelectorAll('.nav-item');



// Set Initial State Of Menu
let URL=document.URL;
if(URL == 'http://www.webdeveloper.fi/') {
    console.log(URL);
}

let showMenu = false;




menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if(!showMenu) {
        menuBtn.classList.add('close');
        menuBtn.classList.remove('blink');
        header1.classList.add('show');
        menu.classList.add('show');
        portrait.classList.add('show');
        menuNav.classList.add('show');
        menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));
    
        //Set Menu State
        showMenu = true;
    }
    else {
        menuBtn.classList.remove('close');
        menuBtn.classList.add('blink');
        header1.classList.remove('show');
        menu.classList.remove('show');
        portrait.classList.remove('show');
        menuNav.classList.remove('show');
        menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));
        
        //Set Menu State
        showMenu = false;
    }
}
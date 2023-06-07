const bar = document.getElementById('bar-icon');
const close = document.getElementById('close');

const nav = document.getElementById('nav-bar');

if (bar) {
    bar.addEventListener('click', () =>{
        nav.classList.add('active')
    })
}

if (close) {
    close.addEventListener('click', () =>{
        nav.classList.remove('active')
    })
}



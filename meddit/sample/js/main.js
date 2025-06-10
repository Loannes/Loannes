document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay');

    function closeMenu() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('visible');
    }

    menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('visible');
    });

    overlay.addEventListener('click', function() {
        closeMenu();
    });

    document.addEventListener('click', function(event) {
        if (sideMenu.classList.contains('open') && !sideMenu.contains(event.target)) {
            closeMenu();
        }
    });

    sideMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}); 
document.querySelector("header .left h1").addEventListener("click", () => window.location.href = "/");

let mode = document.querySelector(".mode");


function setTheme(theme) {

    document.documentElement.setAttribute('data-theme', theme);

    if (theme == 'dark') {
        document.querySelector(".mode img").setAttribute("src", "/images/icons8-sun-90.png")
    }
    else {
        document.querySelector(".mode img").setAttribute("src", "/images/icons8-dark-mode-100.png")
    }

    localStorage.setItem('theme', theme);
}


function toggleTheme() {

    const currentTheme = localStorage.getItem('theme');

    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
}


document.addEventListener('DOMContentLoaded', () => {

    let theme = localStorage.getItem('theme') || 'light';

    setTheme(theme);
});


mode.addEventListener("click", function () {
    toggleTheme();
})

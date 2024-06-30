document.getElementById('file').addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.getElementById('image-preview');
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector("header .left h1").addEventListener("click", () => window.location.href = "/");

document.addEventListener('DOMContentLoaded', function () {

    let parentActualDelete = document.querySelector(".deletionSure");
    let actualDelete = document.querySelector(".actualErase");

    let fakeDelete = document.querySelectorAll(".delete");

    fakeDelete.forEach(val => {
        val.addEventListener("click", e => {
            console.log(val.getAttribute('href'));

            actualDelete.setAttribute("href", val.getAttribute("href"));

            parentActualDelete.classList.add("invoke");

            document.querySelector('.blockRequest').style.transform = 'translateY(0%)';
            document.querySelector('body').style.overflow = 'hidden';
        })
    });
    document.querySelector('form').addEventListener('submit', e => {
        console.log('done');

        document.querySelector('.blockRequest').style.transform = 'translateY(0%)';
        document.querySelector('body').style.overflow = 'hidden';
    })

})


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


let Blogger = document.querySelector("header .left h1");

function textAdjust() {
    if (window.innerWidth < 345) {
        Blogger.innerHTML = "B";
    }
    else {
        Blogger.innerHTML = "Blogger";
    }
}

window.addEventListener('resize', () => textAdjust());
window.addEventListener("DOMContentLoaded", () => textAdjust());
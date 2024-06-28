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
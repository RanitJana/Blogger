document.querySelector("header .left h1").addEventListener("click", () => window.location.href = "/");

document.querySelectorAll('pre').forEach((block) => {
    block.classList.add('language-javascript')
    Prism.highlightElement(block);
});

document.addEventListener("DOMContentLoaded", function () {

    let likeBtn = document.querySelector(".likes");

    likeBtn.addEventListener("click", async () => {

        let script = document.getElementById('custom-script');

        let URL = script.getAttribute('URL');

        let res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.status == 401) return window.location.href = "/login";
        if (res.status == 500) return window.location.href = "/";

        let data = await res.json();

        document.querySelector(".likes span").innerHTML = data.totalLikes;
        document.querySelector(".likes img").setAttribute('src', data.likeImgHref);

    })
})
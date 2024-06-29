document.querySelector("header .left h1").addEventListener("click", () => window.location.href = "/");

document.querySelectorAll('pre').forEach((block) => {
    block.classList.add('language-javascript')
    Prism.highlightElement(block);
});

document.addEventListener("DOMContentLoaded", function () {

    //like 

    let likeBtn = document.querySelector(".likes");

    likeBtn.addEventListener("click", async () => {

        let script = document.getElementById('custom-script');

        let url = script.getAttribute('URL');

        let res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.status == 401) return window.location.href = "/login";
        if (res.status == 500) return window.location.href = "/";

        let data = await res.json();

        document.querySelector(".likes span").innerHTML = data.totalLikes;
        document.querySelector(".likes img").setAttribute('src', data.likeImgHref);

    })


    //comment

    let send = document.querySelector(".send");

    send.addEventListener("click", async () => {

        let script = document.getElementById('custom-script');

        let url = script.getAttribute('URL').replace("like", "comment");

        let mainComment = document.querySelector("#mainComment").value;

        if (!mainComment) return;

        try {

            let res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mainComment })
            });

            document.querySelector("#mainComment").value = "";


            if (res.status === 401 || res.status === 500) return window.location.href = "/login";

            let data = await res.json();

            let allComments = document.querySelector(".allComments");

            let HTML =
                `
                    <div class="userDetails">
                        <div class="userImage">
                            <img src="${data.userAvater}" alt="User" decoding="async">
                        </div>
                    </div>

                    <div class="userComment">
                        <div class="userName">${data.userName}</div>
                        <span>${data.comment}</span>
                    </div>
            `

            let newNode = document.createElement('div');
            newNode.classList.add('singleComment');
            newNode.innerHTML = HTML;

            allComments.prepend(newNode);

            document.querySelector(".comment span").innerHTML = Number(document.querySelector(".comment span").textContent) + 1;


        } catch (error) {
            return window.location.href = "/login";
        }
    })

})

let fetchComment = true;
let commentContent = document.querySelector(".commentArea");

document.addEventListener("DOMContentLoaded", async function () {

    let script = document.getElementById('custom-script');

    let url = script.getAttribute('URL').replace("/like", "");

    let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 500) return;

    let dataObj = await response.json();

    let dataArr = dataObj.newArray;

    let allComments = document.querySelector(".allComments");

    dataArr.forEach(data => {

        let HTML =
            `
        <div class="userDetails">
        <div class="userImage">
        <img src="${data.userAvater}" alt="User" decoding="async">
        </div>
        </div>
        
        <div class="userComment">
        <div class="userName">${data.userName}</div>
        <span>${data.comment}</span>
        </div>
        `

        let newNode = document.createElement('div');
        newNode.classList.add('singleComment');
        newNode.innerHTML = HTML;

        allComments.appendChild(newNode);
    })

    document.querySelector(".comment span").innerHTML = dataArr.length;

})


document.querySelector(".comment").addEventListener("click", async () => {

    commentContent.classList.toggle("show");
})
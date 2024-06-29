document.querySelector("header .left h1").addEventListener("click", () => window.location.href = "/");

document.querySelectorAll('pre').forEach((block) => {
    block.classList.add('language-javascript')
    Prism.highlightElement(block);
});

let more = document.querySelector(".more");

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

            document.querySelector(".TEMP").style.display = "none";

        } catch (error) {
        }
    })

})

let fetchComment = true;
let commentContent = document.querySelector(".commentArea");

let idx = 0;

async function addComments() {

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

    let limit = idx + 10;

    for (let i = idx; i < Math.min(limit, dataArr.length); i++, idx++) {

        let data = dataArr[i];

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
    }
    if (limit >= dataArr.length) {
        more.style.display = "none";
    }
    else if (dataArr.length > 10) {
        more.style.display = "block";
    }

    if (dataArr.length == 0) {
        let newNode = document.createElement('span')
        newNode.innerText = "No comments";
        newNode.classList.add("TEMP");
        newNode.style.marginLeft = "1rem";
        commentContent.appendChild(newNode);
    }

    document.querySelector(".comment span").innerHTML = dataArr.length;

}

document.addEventListener("DOMContentLoaded", async function () {
    await addComments();
})


more.addEventListener("click", async function () {
    await addComments();
})


// document.querySelector(".comment").addEventListener("click", async () => {

//     commentContent.classList.toggle("show");
// })

function resize(element) {
    element.style.height = 'auto'; 
    element.style.height = element.scrollHeight + 'px';
}

let textarea = document.querySelector("textarea");

textarea.addEventListener('input', () => {
    resize(textarea);
})


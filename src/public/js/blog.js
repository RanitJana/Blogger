document.querySelector("header .left h1").addEventListener("click", () => window.location.href = "/");

document.querySelectorAll('pre').forEach((block) => {
    block.classList.add('language-javascript')
    Prism.highlightElement(block);
});
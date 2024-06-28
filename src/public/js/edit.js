const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
];


var quill = new Quill('#editor-container', {
    modules: {
        toolbar: toolbarOptions,
    },
    theme: 'snow'
});

function prepareEditorContent() {
    var content = quill.root.innerHTML;
    document.getElementById('hidden-content').value = content;
}
document.querySelector('form').addEventListener('submit', e => {
    prepareEditorContent()
    document.querySelector('.blockRequest').style.transform = 'translateY(0%)';
    document.querySelector('body').style.overflow = 'hidden';
})
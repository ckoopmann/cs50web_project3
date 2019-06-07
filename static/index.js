// Set starting value of name to 0
if (!localStorage.getItem('name'))
    localStorage.setItem('name', prompt("Enter your Name","dickhead"));

// Load current value of  name
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#heading').innerHTML = localStorage.getItem('name');

    document.querySelector('#form').onsubmit = function() {
        const name = document.querySelector('#name').value;
        localStorage.setItem('name', name);
        document.querySelector('#heading').innerHTML = name;
    };
});

// Set starting value of name to 0
if (!localStorage.getItem('name'))
    localStorage.setItem('name', prompt("Enter your Name","dickhead"));

// Load current value of  name
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('name');
    document.querySelector('#heading').innerHTML = name;
});

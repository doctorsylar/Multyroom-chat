// variables
let sessionStorage = window.sessionStorage;

// after loading page
window.onload = function () {
    checkUsername();
    // submitting username
    document.querySelector('#username-form').onsubmit = submitUsername;
};
// functions
function checkUsername() {
    if (sessionStorage.getItem('username') == null) {
        let nameContainer = document.querySelector('.name-container');
        nameContainer.style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';
    }
}
function submitUsername(event) {
    event.preventDefault();
    let usernameField = event.target.children[0];
    if (usernameField.value.trim() !== '') {
        sessionStorage.setItem('username', usernameField.value);
        document.querySelector('.name-container').style.display = 'none';
        document.querySelector('#overlay').style.display = 'none';
    }
    else {
        usernameField.value = '';
    }
}
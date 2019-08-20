export default function () {
    const editBtn = document.querySelector("#editButton");
    const userPhoto = document.querySelector("#userPhoto");
    const photoBlock = document.querySelector(".photoBlock");
    const userInfoContainer = document.querySelector("#userInfo-container");
    const nameInput = document.querySelector("#nameInput");
    const surnameInput = document.querySelector("#surnameInput");
    const photoForm = document.forms.namedItem('userAvatar');
    let API = "https://intern-staging.herokuapp.com/api";
    let userName = document.querySelector("#userName");
    let userSurname = document.querySelector("#userSurname");

    let userStr;
    let user;

    let inputValues = [];
    let counter = 0;

    parseUser();
    setUserName(userName, userSurname);

    function parseUser() {
        userStr = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        user = JSON.parse(userStr);
    }

    function setUserName(firstName, lastName) {
        firstName.innerText = user.name;
        lastName.innerText = user.surname;
    }

    window.showUserLinks();

    userInfoContainer.style.display = "none";

    editBtn.addEventListener("click", function () {
        inputValues = [nameInput.value, surnameInput.value];
        hideUserPhoto();
        counter++;
        if (counter === 1) {
            editUserInfo();
            nameInput.placeholder = user.name;
            surnameInput.placeholder = user.surname;
            editBtn.innerText = "Save";
        } else {
            counter = 0;
            if (checkUserInputName(nameInput, surnameInput) === true) {
                user.name = nameInput.value;
                user.surname = surnameInput.value;
                console.log("nameInput " + nameInput.value);
                console.log(user.name);
                localStorage.setItem(user.email, updateUserName(nameInput, surnameInput));
                userName.innerText = user.name;
                userSurname.innerText = user.surname;
            }
            console.log(user);
            document.cookie = 'user =' + JSON.stringify(user);
            makeUserPhotoVisible();
            editBtn.innerText = "Edit";
        }
    });

    function getUserInfo() {
        console.log(user.name + " " + user.surname + " " + user.token + " " + user.id + " " + user.ava);
        return user.name + " " + user.surname + " " + user.token + " " + user.id + " " + user.ava;
    }

    function updateUserName(input, input2) {
        if (!(input.value === "" || !(isNaN(input.value))) ||
            !(input2.value === "" || !(isNaN(input2.value)))) {
            return input.value + " " + input2.value + " "+ user.name + " " + user.surname + " " + user.token + " " + user.id + " " + user.ava;
        }
    }

    function doAvatarRequest(url, method, data, headers) {
        fetch(`${API}${url}`, {
            method: method,
            body: data,
            headers: headers,
        }).then(
            response => response.json()
        ).then(json => {
                console.log(json);
                user.ava = json.url;
                console.log("use.ava " + user.ava);
                localStorage.setItem(user.email, getUserInfo());
                console.log(user);
                document.cookie = 'user =' + JSON.stringify(user);
                userPhoto.src = user.ava;
            }
        );
    }

    photoForm.addEventListener('submit', function (event) {
        let formData = new FormData(this);
        formData.append('parentEntityId', user.id);
        doAvatarRequest('/file', 'POST', formData, {'token': user.token});
        event.preventDefault();
    });

    function editUserInfo() {
        userInfoContainer.style.display = "block";
        photoBlock.insertBefore(userInfoContainer, editBtn);
    }

    function hideUserPhoto() {
        userPhoto.style.display = 'none';
    }

    function makeUserPhotoVisible() {
        userPhoto.style.display = 'block';
        photoBlock.removeChild(userInfoContainer);
    }

    function checkUserInputName(input, input2) {
        let inputArray = input.value.split("");
        let inputArray2 = input2.value.split("");
        let inputUser = [...inputArray, ...inputArray2];
        let counter = 0;
        inputUser.filter(value => {
            if (isNaN(value) && value !== "") {
                counter++;
            }
        });
        if (counter === 0) {
            return false;
        } else if (inputUser.length === counter) {
            return true;
        }
    }

    setUserPhoto(user.ava);

    function setUserPhoto(userAva = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwcaN8Fk2YhPdM8pKjl-4OsxCwskPUudKbuVbT5ox7VZ82EsMv') {
        console.log(user);
        console.log(userPhoto.src);
        console.log(user.ava);
        userPhoto.src = userAva;
    }

}


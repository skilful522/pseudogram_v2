export default function () {
    const editBtn = document.querySelector("#editButton");
    const userPhoto = document.querySelector("#userPhoto");
    const photoBlock = document.querySelector(".photoBlock");
    const userInfoContainer = document.querySelector("#userInfo-container");
    const nameInput = document.querySelector("#nameInput");
    const surnameInput = document.querySelector("#surnameInput");
    const photoForm = document.forms.namedItem('userAvatar');
    const userPhotoInfo = document.querySelector("#userPhotoInfo");
    const imgBlock = document.querySelector(".imgBlock");
    const feedImages = document.querySelector("#images");
    const postsBtn = document.querySelector("#postsButton");
    const snapshotBtn = document.querySelector("#snapshot");
    const userChangeContainer = document.querySelector("#user-change-container");
    const snapshotContainer = document.querySelector("#snapshot-container");
    const video = document.createElement("video");

    let API = "https://intern-staging.herokuapp.com/api";
    let userName = document.querySelector("#userName");
    let userSurname = document.querySelector("#userSurname");
    const defaultUserPhoto = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwcaN8Fk2YhPdM8pKjl-4OsxCwskPUudKbuVbT5ox7VZ82EsMv';

    let userStr;
    let user;
    let photo = [];
    let inputValues = [];
    let counter = 0;
    let counter2 = 0;

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
    snapshotContainer.style.display = "none";
    editBtn.addEventListener("click", function (event) {
        inputValues = [nameInput.value, surnameInput.value];
        hideUserPhoto();
        counter++;
        if (counter === 1) {
            editUserInfo();
            nameInput.placeholder = user.name;
            surnameInput.placeholder = user.surname;
            userPhotoInfo.innerText = "Please upload a real photo of yourself so your friends can recognize you.";
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

    function makeVideo(){
        navigator.getUserMedia({
            audio: false,
            video: {width: 500, height: 500}
        }, (stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => video.play();
        },
            (error) => console.log(error))
        );
    }

    snapshotBtn.addEventListener('click', function (event) {
        counter2++;
        hideUserPhoto();
        if (counter2 === 1) {
            userChangeContainer.style.display = 'none';
            snapshotContainer.style.display = 'block';
            makeVideo();
            snapshotContainer.appendChild(video);
            snapshotBtn.innerText = 'close';
           // makeUserPhotoVisible();
        } else {
            counter2 = 0;
            snapshotContainer.style.display = 'none';
            userChangeContainer.style.display = 'block';
            snapshotBtn.innerText = 'SNAPSHOT';
        }
    });

    postsBtn.addEventListener('click', function () {
        addPhotoToUser();
    });

    function getUserInfo() {
        console.log(user.name + " " + user.surname + " " + user.token + " " + user.id + " " + user.ava);
        return user.name + " " + user.surname + " " + user.token + " " + user.id + " " + user.ava;
    }

    function updateUserName(input, input2) {
        if (!(input.value === "" || !(isNaN(input.value))) ||
            !(input2.value === "" || !(isNaN(input2.value)))) {
            return input.value + " " + input2.value + " " + user.name + " " + user.surname + " " + user.token + " " + user.id + " " + user.ava;
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
                userPhotoInfo.innerText = "Photo has been uploaded";
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

    function addPhotoToUser() {

        if (window.addedPhoto) {
            document.cookie = 'userAddedPhoto =' + window.addedPhoto;
            photo = document.cookie.split("; userAddedPhoto=").pop().split(",");
            localStorage.setItem('userAddedPhoto', photo);
            for (let i = 0; i < photo.length; i++) {
                const img = document.createElement("img");
                const block = document.createElement("div");
                block.className = "imgBlock";
                img.src = photo[i];
                img.className = 'img';
                block.appendChild(img);
                feedImages.appendChild(block);
            }
        }
    }

    setUserPhoto(user.ava);

    function setUserPhoto(userAva = defaultUserPhoto) {
        userPhoto.src = userAva;
    }

}


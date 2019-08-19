export default function () {
    const singInInfo = document.querySelector("#singInInfo");
    const registration = document.querySelector("#registration");
    const userFirstName = document.querySelector("#userFirstName");
    const userLastName = document.querySelector("#userLastName");
    const userEmail = document.querySelector("#userEmail");
    const enter = document.querySelector("#enter");
    const checkEmailStr = document.createElement("h3");
    const userLogInEmail = document.querySelector("#userLogInEmail");
    const userPassword = document.querySelector("#userPassword");
    const logInStr = document.querySelector("#justText2");

    let user;
    let counter = 0;

    window.removeUserLinks();

    registration.addEventListener("click", function () {
        if (checkUserInput(userFirstName,userLastName) === true) {
            let user = {email: userEmail.value};
            doRequest(user);
            counter++
        } else {
            counter = 0;
            showInput();
            registration.innerHTML = "Registration";
        }
    });

    function checkUserInput(input,input2) {

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

    function updateEmailBlock(innerText) {
        removeInput();
        cleanInput();
        checkEmailStr.style.textAlign = "center";
        checkEmailStr.innerHTML = innerText;
        singInInfo.appendChild(checkEmailStr);
        registration.innerHTML = "close"
    }

    enter.addEventListener('click', function () {
        doSignInRequest({email: userLogInEmail.value, password: userPassword.value});
    });

    function getUsersNames(input, input2) {
        if (!(input.value === "" || !(isNaN(input.value))) ||
            !(input2.value === "" || !(isNaN(input2.value)))) {
            return input.value + " " + input2.value + " " + window.user._id;
        }
    }

    function removeInput() {
        userFirstName.style.display = "none";
        userLastName.style.display = "none";
        userEmail.style.display = "none";
        checkEmailStr.style.display = "block";
    }

    function cleanInput() {
        userFirstName.value = "";
        userLastName.value = "";
        userEmail.value = "";
    }

    function showInput() {
        userFirstName.style.display = "block";
        userLastName.style.display = "block";
        userEmail.style.display = "block";
        checkEmailStr.style.display = "none";
    }

    function doRequest(data) {
        fetch('https://intern-staging.herokuapp.com/api/identification', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(resp => resp.json()
        ).then(json => {
            if (!(json['message'] === undefined)) {
                updateEmailBlock(json['message']);
            } else {
                window['user'] = json;
                console.log(json);
                window['id'] = json._id;
                document.cookie = 'user = ' + window.user._id;
                user = {id: window.user._id};
                console.log(user);
                document.cookie = 'user =' + JSON.stringify(user);
                doActivateRequest({id: json['_id']});
                window['userEmail'] = userEmail.value;
                localStorage.setItem(userEmail.value, getUsersNames(userFirstName, userLastName));
            }
        });
    }

    function doActivateRequest(id) {
        fetch('https://intern-staging.herokuapp.com/api/identification/activate', {
            method: 'POST',
            body: JSON.stringify(id),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(resp => resp.json()
        ).then(json => {
            if (!(json['message'] === undefined)) {
                updateEmailBlock("Wrong email");
            } else updateEmailBlock("Check your email!");
        });
    }

    function doSignInRequest(userSignIn) {
        fetch('https://intern-staging.herokuapp.com/api/identification/sign_in', {
            method: 'POST',
            body: JSON.stringify(userSignIn),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(resp => resp.json()
        ).then(token => {
            if (token.hasOwnProperty('token')) {
                window['token'] = token;
                window['userLogInEmail'] = userLogInEmail.value;
                let nameUserArray = localStorage.getItem(userLogInEmail.value).split(" ");
                let userFirstName = nameUserArray[0];
                let userLastName = nameUserArray[1];
                let userId = nameUserArray[2];
                let userToken = token.token;
                user = {name: userFirstName, surname: userLastName, token: userToken, id: userId, ava:''};
                console.log(user);
                document.cookie = 'user =' + JSON.stringify(user);
                window['cookie'] = document.cookie;
                location.href = "#/home";
            } else {
                logInStr.innerHTML = "Wrong email\nor password";
                setTimeout(logInStr.innerHTML = "Log in", 3000);
            }
            }
        ).catch(error => console.log(error));
    }
}



export default function () {
    const feedButton = document.querySelector("#feedButton");
    const images = document.querySelector("#feedImages");
    const modal = document.querySelector("#modal");
    const close = document.getElementsByClassName('close')[0];
    const addPhotoBtn = document.querySelector("#addPhotoBtn");
    const currentImg = document.querySelector("#currentImg");
    const addedPhoto = [];
    const feedImgBlock = document.getElementsByClassName("feedImgBlock");

    let res = [];
    res[0] = "320x320";
    res[1] = "640x640";
    res[2] = "800x800";
    res[3] = "900x900";
    res[4] = "360x360";
    res[5] = "340x340";

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    searchInput.onkeypress = function (event) {
         let searchText = searchInput.value;
         if (event.keyCode == 13) {
             for (let i = 0; i < feedImgBlock.length; i++) {
                 let image = "https://source.unsplash.com/" + res[getRandomArbitrary(0,6)] + "/weekly?" + searchText;
                 feedImgBlock[i].src = image;
             }
         }
    };

    images.addEventListener('click', function (event) {
        currentImg.src = event.target.src;
        currentImg.style.width = '500px';
        modal.style.display = "block";
    });

    close.addEventListener('click', function () {
        modal.style.display = "none";
    });

    addPhotoBtn.addEventListener("click", function () {
        addedPhoto.push(currentImg.src);
        window.addedPhoto = addedPhoto;
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    feedButton.addEventListener('click', function () {
        for (let i = 0; i < 3; i++) {
            let fragment = document.createDocumentFragment();
            let img = document.createElement("img");
            img.src = "https://source.unsplash.com/320x320/weekly?" + getRandomArbitrary(0, 350);
            img.className = 'feedImgBlock';
            fragment.appendChild(img);
            images.appendChild(fragment);
        }
    });
}
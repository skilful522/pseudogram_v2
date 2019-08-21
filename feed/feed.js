export default function () {
    const feedButton = document.querySelector("#feedButton");
    const images = document.querySelector("#feedImages");
    const modal = document.querySelector("#modal");
    const close = document.getElementsByClassName('close')[0];
    const addPhotoBtn = document.querySelector("#addPhotoBtn");
    const currentImg = document.querySelector("#currentImg");
    const addedPhoto = [];

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    images.addEventListener('click',function (event) {
        console.log(event.target);
        console.log();
        console.log(window.screen.availWidth);
        currentImg.src = event.target.src;
        currentImg.style.width = '500px';
        console.log(currentImg.style.width );
        modal.style.display = "block";
    });

    close.addEventListener('click', function () {
        modal.style.display = "none";
    });

    addPhotoBtn.addEventListener("click",function () {
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
export default function () {
    const feedButton = document.querySelector("#feedButton");
    const images = document.querySelector("#feedImages");

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

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
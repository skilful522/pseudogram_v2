const home = document.querySelector("#home");
const homeLink = document.querySelector("#homeLink");
const feedLink = document.querySelector("#feedLink");
const logInLink = document.querySelector("#logInLink");
const searchInput = document.querySelector("#search");
const loginBtn = document.querySelector("#login");

var routes = {
    'home': {
        html: 'home/home.html',
        src: './home/home.js'
    },
    'feed': {
        html: 'feed/feed.html',
        src: './feed/feed.js'
    },
    '': {
        html: 'login/login.html',
        src: './login/login.js'
    },

    'login': {
        html: 'login/login.html',
        src: './login/login.js'
    }

};

window.searchInput = searchInput;

window['showUserLinks'] = function showUserLinks() {
    homeLink.style.visibility = 'visible';
    feedLink.style.visibility = 'visible';
    searchInput.style.visibility = 'visible';
    logInLink.style.visibility = 'visible';
    loginBtn.style.visibility = 'visible';
};
window['removeUserLinks'] = function removeUserLinks() {
    homeLink.style.visibility = 'hidden';
    feedLink.style.visibility = 'hidden';
    logInLink.style.visibility = 'hidden';
    loginBtn.style.visibility = 'hidden';
};

loginBtn.addEventListener('click', function () {
    location.href = "#/login";
});

var requestTemplate = (function () {
    var cache = {};
    return function (url) {
        if (cache.hasOwnProperty(url)) {
            return Promise.resolve(cache[url]);
        } else {
            return fetch(url).then(function (res) {
                return res.text();
            }).then(function (html) {
                cache[url] = html;
                return html;
            })
        }
    }
})();

var runScript = (function () {
    var cache = {};
    return function (src) {
        if (cache.hasOwnProperty(src)) {
            cache[src]();
        } else {
            import(src).then(function (module) {
                cache[src] = module.default;
                cache[src]();
            }).catch(function (err) {
                console.error(err)
            });
        }
    }
})();


var render = (function () {
    return function (html) {
        home.innerHTML = html;
    }
})();

var handleRouting = (function () {
    var previousHash;
    return function () {
        var hash = window.location.hash.split('#/')[1] || '';
        if (previousHash === hash) {
            return;
        }
        if (routes.hasOwnProperty(hash)) {
            previousHash = hash;
            var urls = routes[hash];
            requestTemplate(urls.html).then(function (html) {
                render(html);
                if (urls.hasOwnProperty('src')) {
                    console.log(urls.src);
                    runScript(urls.src);
                }
            })
        }
    }
})();

window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('hashchange', handleRouting);
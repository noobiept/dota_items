var ELEMENT;
var TIMEOUT_ID = null;

export function init() {
    ELEMENT = document.querySelector("#Message");
}

export function show(text) {
    stopPrevious();

    ELEMENT.innerHTML = text;
    ELEMENT.style.opacity = 1;

    TIMEOUT_ID = window.setTimeout(function () {
        hide();
    }, 500);
}

function hide() {
    stopPrevious();

    ELEMENT.style.opacity = 0;
}

function stopPrevious() {
    if (TIMEOUT_ID !== null) {
        window.clearTimeout(TIMEOUT_ID);

        TIMEOUT_ID = null;
    }
}

export function correct() {
    ELEMENT.className = "yellow";
    show("Correct!");
}

export function incorrect() {
    ELEMENT.className = "red";
    show("Incorrect!");
}

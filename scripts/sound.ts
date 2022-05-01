let CORRECT_SOUND; // plays a sound whenever a correct guess is made

export function init() {
    CORRECT_SOUND = new Audio("./sounds/coins.mp3");
    CORRECT_SOUND.volume = 0.3;
    CORRECT_SOUND.load();
}

export function playCorrect() {
    CORRECT_SOUND.currentTime = 0;
    CORRECT_SOUND.play();
}

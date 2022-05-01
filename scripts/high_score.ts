import { getData, setData } from "./app_storage";
import { updateHighScore } from "./main";

let HIGH_SCORE = -1; // valid scores are always positive
const HIGH_SCORE_STORE_KEY = "dota_items_highscore";

export function init() {
    const data = getData(HIGH_SCORE_STORE_KEY);
    const score = data[HIGH_SCORE_STORE_KEY] as number;

    if (Game.Utilities.isInteger(score)) {
        HIGH_SCORE = score;
    }

    updateHighScore();
}

export function add(score: number) {
    // first score added
    if (HIGH_SCORE < 0) {
        HIGH_SCORE = score;
        save();
    } else if (score < HIGH_SCORE) {
        HIGH_SCORE = score;
        save();
    }
}

export function getBestScore() {
    return HIGH_SCORE;
}

function save() {
    setData({ [HIGH_SCORE_STORE_KEY]: HIGH_SCORE });
}

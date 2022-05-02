import { shuffle } from "@drk4/utilities";
import { IMAGE_CDN_URL } from "./constants";
import { cleanData, fetchData } from "./data";
import * as HighScore from "./high_score";
import * as Message from "./message";
import * as Sound from "./sound";
import { ItemData, ItemsDataDict } from "./types";

window.onload = async function () {
    const data = await fetchData();
    init(data);
};

/**
 * items = {
 *     "item_name": {
 *         "id": number,
 *         "img": str,  // file name, need to prepend the base url
 *         "dname": str,    // display name
 *         "qual": str,
 *         "cost": number,
 *         "desc": str,     // item description
 *         "notes": str,    // also item description
 *         "attrib": str,
 *         "mc": boolean,
 *         "cd": number,    // cooldown
 *         "lore": str,
 *         "components": string[],  // array of the item names, or null
 *         "created": boolean
 *     },
 *     // etc
 * }
 */
let ITEMS: ItemsDataDict;
let ITEM_NAMES: string[]; // a list with all the item names (the key to the 'ITEMS')

let BUTTONS: Game.Html.Button[] = [];
let CURRENT_ITEM: ItemData | undefined;
let ITEMS_LEFT: string[] = [];
let TIMER: Game.Utilities.Timer;
let GUESSES_LEFT: number;
const MAX_GUESSES = 20;

let HIGH_SCORE_ELEMENT: Game.Html.Value;
let GUESSES_LEFT_ELEMENT: Game.Html.Value;
let ITEMS_LEFT_ELEMENT: Game.Html.Value;

let HTML_CONTAINER: HTMLElement;
let HTML_IMAGE: HTMLImageElement;
let HTML_NAME: HTMLElement;
let HTML_TOOLTIP_ATTRIBUTES: HTMLElement;
let HTML_TOOLTIP_LORE: HTMLElement;

function init(data: ItemsDataDict) {
    loadItemData(data);

    HTML_CONTAINER = document.querySelector("#GameContainer")!;
    HTML_IMAGE = HTML_CONTAINER.querySelector("#ItemImage")!;
    HTML_NAME = HTML_CONTAINER.querySelector("#ItemName")!;
    HTML_TOOLTIP_ATTRIBUTES = document.getElementById("ItemTooltipAttributes")!;
    HTML_TOOLTIP_LORE = document.getElementById("ItemTooltipLore")!;

    const tooltip = document.getElementById("ItemTooltip")!;

    // show the tooltip when the mouse is over the image
    HTML_IMAGE.addEventListener("mouseover", function () {
        tooltip.style.display = "block";
    });
    HTML_IMAGE.addEventListener("mouseout", function () {
        tooltip.style.display = "none";
    });

    Message.init();

    // initialize the menu
    const costMenu = new Game.Html.HtmlContainer({ cssId: "CostMenu" });
    const price1 = new Game.Html.Button({
        value: 0,
        callback: clicked,
    });
    const price2 = new Game.Html.Button({
        value: 0,
        callback: clicked,
    });
    const price3 = new Game.Html.Button({
        value: 0,
        callback: clicked,
    });
    costMenu.addChild(price1, price2, price3);

    const infoMenu = new Game.Html.HtmlContainer({ cssId: "InfoMenu" });

    const guessesLeft = new Game.Html.Value({
        value: 0,
        preText: "Guesses left: ",
    });
    const itemsLeft = new Game.Html.Value({
        value: 0,
        preText: "Items left: ",
    });
    const timer = new Game.Html.Value({ value: 0 });

    infoMenu.addChild(guessesLeft, itemsLeft, timer);

    const controlsMenu = new Game.Html.HtmlContainer({ cssId: "ControlsMenu" });
    const restartButton = new Game.Html.Button({
        value: "Restart",
        callback: restart,
    });
    const highScoreButton = new Game.Html.Value({
        value: "",
        preText: "Best time: ",
    });

    controlsMenu.addChild(restartButton, highScoreButton);

    const gameMenu = new Game.Html.HtmlContainer({
        cssId: "GameMenu",
    });

    gameMenu.container.appendChild(costMenu.container);
    gameMenu.container.appendChild(infoMenu.container);
    gameMenu.container.appendChild(controlsMenu.container);

    HTML_CONTAINER.appendChild(gameMenu.container);

    TIMER = new Game.Utilities.Timer(timer.container);
    BUTTONS = [price1, price2, price3];
    HIGH_SCORE_ELEMENT = highScoreButton;
    GUESSES_LEFT_ELEMENT = guessesLeft;
    ITEMS_LEFT_ELEMENT = itemsLeft;

    Sound.init();
    HighScore.init();
    updateHighScore();
    start();

    // show the game after the load
    HTML_CONTAINER.style.display = "block";

    // and hide the loading message
    const loading = document.getElementById("Loading")!;
    loading.style.display = "none";
}

/**
 * Load the item data.
 */
function loadItemData(data: ItemsDataDict) {
    ITEMS = cleanData(data);
    ITEM_NAMES = Object.keys(ITEMS);

    // update the image links with the complete url
    ITEM_NAMES.forEach((name) => {
        const info = ITEMS[name];
        info.img = IMAGE_CDN_URL + info.img;
    });
}

function start() {
    ITEMS_LEFT = ITEM_NAMES.slice();

    updateGuessesLeft(MAX_GUESSES);

    TIMER.start();
    newItem();
}

function clear() {
    TIMER.reset();
    ITEMS_LEFT.length = 0;
}

function restart() {
    clear();
    start();
}

function clicked(button: Game.Html.Button) {
    const value = button.getValue();
    let message: Game.Message;
    let ok: Game.Html.Button;

    if (value === CURRENT_ITEM?.cost) {
        Message.correct();
        Sound.playCorrect();

        if (ITEMS_LEFT.length > 0) {
            newItem();
        } else {
            TIMER.stop();

            HighScore.add(TIMER.getTimeMilliseconds());
            updateHighScore();

            ok = new Game.Html.Button({
                value: "Ok",
                callback: function () {
                    message.clear();
                    restart();
                },
            });

            message = new Game.Message({
                body: "Victory! " + TIMER.getTimeString(),
                container: HTML_CONTAINER,
                background: true,
                buttons: ok,
            });
        }
    } else {
        updateGuessesLeft(GUESSES_LEFT - 1);

        Message.incorrect();

        if (GUESSES_LEFT <= 0) {
            TIMER.stop();

            ok = new Game.Html.Button({
                value: "Ok",
                callback: function () {
                    message.clear();
                    restart();
                },
            });

            message = new Game.Message({
                body: "Defeat!",
                container: HTML_CONTAINER,
                background: true,
                buttons: ok,
            });
        }
    }
}

function updateGuessesLeft(guesses: number) {
    GUESSES_LEFT = guesses;
    GUESSES_LEFT_ELEMENT.setValue(guesses);

    const htmlElement = GUESSES_LEFT_ELEMENT.element;

    if (guesses <= 1) {
        htmlElement.className = "red";
    } else if (guesses <= 2) {
        htmlElement.className = "yellow";
    } else {
        htmlElement.className = "";
    }
}

export function updateHighScore() {
    const bestTime = HighScore.getBestScore();
    let str;

    if (bestTime > 0) {
        str = Game.Utilities.timeToString(bestTime);
    } else {
        str = "---";
    }

    HIGH_SCORE_ELEMENT.setValue(str);
}

/**
 * Get a random value around the reference cost, and try not to get a repeated value.
 */
function getRandomCost(referenceCost: number, excludeValues?: number[]) {
    if (typeof excludeValues === "undefined") {
        excludeValues = [];
    }

    excludeValues.push(referenceCost);

    const tries = 5;
    let random = 0;

    for (let a = 0; a < tries; a++) {
        random = referenceCost + Game.Utilities.getRandomInt(-20, 20) * 5;

        // see if we already have this value, if so then try again
        // otherwise we got what we came here for
        if (random >= 0 && excludeValues.indexOf(random) < 0) {
            return random;
        }
    }

    // don't allow negative numbers
    if (random < 0) {
        random = 0;
    }

    // no more tries left, just return the last value
    return random;
}

function newItem() {
    const index = Game.Utilities.getRandomInt(0, ITEMS_LEFT.length - 1);
    const randomName = ITEMS_LEFT.splice(index, 1)[0];

    const item = ITEMS[randomName];

    const rightCost = item.cost;
    const cost2 = getRandomCost(rightCost);
    const cost3 = getRandomCost(rightCost, [cost2]);

    const values = shuffle([rightCost, cost2, cost3]);

    HTML_IMAGE.src = item.img;
    HTML_NAME.innerHTML = item.dname;
    HTML_TOOLTIP_ATTRIBUTES.innerHTML = item.attrib
        .map((el) => `${el.header}${el.value} ${el.footer}`)
        .join("<br />");
    HTML_TOOLTIP_LORE.innerHTML = item.lore;

    for (let a = BUTTONS.length - 1; a >= 0; a--) {
        BUTTONS[a].setValue(values[a]);
    }

    CURRENT_ITEM = item;

    // +1 since we removed the new item from the array above
    ITEMS_LEFT_ELEMENT.setValue(ITEMS_LEFT.length + 1);
}

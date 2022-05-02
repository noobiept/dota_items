import { ItemsDataDict } from "./types";

export async function fetchData() {
    const response = await fetch(
        "https://raw.githubusercontent.com/odota/dotaconstants/master/build/items.json"
    );
    const data = await response.json();
    return data;
}

/**
 * Remove some entries from the items data that are not useful for the game (neutral items, recipes, etc).
 */
export function cleanData(data: ItemsDataDict): ItemsDataDict {
    // remove some unbuyable items and mid-upgrade items (like dagon 2, dagon 3, etc, only show the first and last one)
    const invalidItems = [
        "cheese",
        "aegis",
        "courier",
        "flying_courier",
        "ward_dispenser",
        "dagon_2",
        "dagon_3",
        "dagon_4",
        "necronomicon_2",
    ];
    invalidItems.forEach((item) => delete data[item]);

    // remove items that have no cost or that are recipes
    const invalidNamesRegex = /recipe|roshan/i;

    return Object.entries(data).reduce((itemsAcc, [key, item]) => {
        if (item.cost > 0 && !invalidNamesRegex.test(key)) {
            return {
                ...itemsAcc,
                [key]: item,
            };
        }

        return itemsAcc;
    }, {});
}

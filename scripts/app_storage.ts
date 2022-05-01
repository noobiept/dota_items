/**
 * Get data from the `localStorage`.
 */
export function getData(keys) {
    var objects = {};

    for (var a = 0; a < keys.length; a++) {
        var key = keys[a];
        var value = localStorage.getItem(key);

        objects[key] = value && JSON.parse(value);
    }

    return objects;
}

/**
 * Set data into the `localStorage`.
 */
export function setData(items) {
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            localStorage.setItem(key, JSON.stringify(items[key]));
        }
    }
}

/**
 * Remove some keys from `localStorage`.
 */
export function removeData(...keys: string[]) {
    keys.forEach((key) => localStorage.removeItem(key));
}

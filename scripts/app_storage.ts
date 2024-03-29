export type DataObject = {
    [key: string]: unknown;
};

/**
 * Get data from the `localStorage`.
 */
export function getData(...keys: string[]): DataObject {
    return keys.reduce((data, key) => {
        const item = localStorage.getItem(key);
        const value = item && JSON.parse(item);

        return {
            ...data,
            [key]: value,
        };
    }, {});
}

/**
 * Set data into the `localStorage`.
 */
export function setData(items: DataObject) {
    Object.entries(items).forEach(([key, value]) =>
        localStorage.setItem(key, JSON.stringify(value))
    );
}

/**
 * Remove some keys from `localStorage`.
 */
export function removeData(...keys: string[]) {
    keys.forEach((key) => localStorage.removeItem(key));
}

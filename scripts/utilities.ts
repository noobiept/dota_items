/**
 * Get a random value around the reference cost, and try not to get a repeated value.
 */
export function getRandomCost(referenceCost: number, excludeValues?: number[]) {
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

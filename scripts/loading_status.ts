import { fetchData } from "./data";
import { ItemsDataDict } from "./types";

export async function loadData(
    status: HTMLElement,
    callback: (data: ItemsDataDict) => void
) {
    status.textContent = "Loading...";

    try {
        const data = await fetchData();
        callback(data);
    } catch {
        status.textContent = "Failed to load!";
        return;
    }

    // hide the loading status message
    status.classList.add("hidden");
}

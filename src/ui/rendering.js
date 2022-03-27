import { sort } from "../utils/sorting"
import { CommonFunction } from "./data-processing"

export default class Render {
    #activeButton
    #indexOfActiveButton
    #spiner
    #dataFunction
    #dataProviderFunction
    constructor(activeButton, indexOfActiveButton, spinner, dataFunction, dataProviderFunction) {
        this.#activeButton = activeButton;
        this.#indexOfActiveButton = indexOfActiveButton;
        this.#spiner = spinner;
        this.#dataFunction = dataFunction;
        this.#dataProviderFunction = dataProviderFunction;
    }
    async showData() {
        this.#spiner.start();
        this.#activeButton.setActive(this.#indexOfActiveButton);
        const res = await CommonFunction(this.#dataFunction, this.#dataProviderFunction); // ../service/data-processing.js  (CommonFunction)
        if (res) {
            this.#spiner.stop();
            return res
        }
    }
    async sortData(key) {
        const res = await CommonFunction(this.#dataFunction, this.#dataProviderFunction); // ../service/data-processing.js  (CommonFunction)
        return sort(res, key);
    }

}

export default class NavigatorButtons {
    #buttons
    #activeIndex
    constructor(buttonIds) {
        this.#buttons = buttonIds.map(id => document.getElementById(id));
        this.#activeIndex = undefined
    }
    setActive(index) {
        if (this.#activeIndex != undefined) {
            this.#removeStyles();
        }
        this.#activeIndex = index;
        this.#showStyles();
    }
    #removeStyles() {
        const ind = this.#activeIndex;
        const btnElement = this.#buttons[ind];
        btnElement.classList.remove("active");
    }
    #showStyles() {
        const ind = this.#activeIndex;
        const btnElement = this.#buttons[ind];
        btnElement.classList.add("active");
    }
}
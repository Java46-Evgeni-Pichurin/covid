export default class Spinner {
    #spinnerID
    constructor(spinnerID){
        this.#spinnerID = document.getElementById(spinnerID);
    }
    stop() {
        this.#spinnerID.hidden = true;
    }
    start() {
        this.#spinnerID.hidden = false;
    }
}
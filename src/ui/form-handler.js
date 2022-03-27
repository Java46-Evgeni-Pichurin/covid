export default class FormHandler {
    #formElement
    #alertElement
    #inputElements
    constructor(idForm, idAlert) {
        this.#formElement = document.getElementById(idForm);
        this.#alertElement = document.getElementById(idAlert);
        this.#inputElements = document.querySelectorAll(`#${idForm} [name]`);
    }
    addHandler(fnProcessor) {
        this.#formElement.addEventListener('submit', async event => {
            event.preventDefault();
            const data = Array.from(this.#inputElements)
                .reduce((obj, element) => {
                    obj[element.name] = element.value;
                    return obj;
                }, {})
            const message = await fnProcessor(data);
            if (!message) {
                this.#formElement.reset();
                const alertCompleted = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success!</strong> 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
                this.#alertElement.innerHTML = alertCompleted;
            } 
        })
    }
    fillOptions(idOptions, options) {
        document.getElementById(idOptions).innerHTML +=
            `${getOptions(options)}`
    }
    show() {
        this.#formElement.hidden = false;
    }
    hide() {
        this.#formElement.hidden = true;
    }
}
function getOptions(options) {
    return options.map(o => `<option value="${o}" class="text-start">${o}</option>`).join('');
}
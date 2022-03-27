import _, { keyBy, keys, map, reduce, values } from "lodash";

export default class CovidDataMediaGroup {
    #baseUrl
    constructor() {
        this.#baseUrl = `https://covid-api.mmediagroup.fr/v1/`
    }
    async getContinentCases() {
        const dataResponse = await fetch(this.#baseUrl + `cases`);
        const data = await dataResponse.json();
        const continentData = Object.values(data).map(o => o.All).filter(c => !!c.continent && !!c.population && !!c.updated);
        return _.groupBy(continentData, `continent`);
    }
    async getHistoryCases(status, option) {
        const dataResponse = await fetch(this.#baseUrl + `history?status=${status}`);
        const data = await dataResponse.json();
        const continentData = Object.values(data).map(o => o.All).filter(c => !!c.population && !!c.dates && c.country === option);
        return  _.groupBy(continentData, `country`);
    }
    async getVaccineCases() {
        const dataResponse = await fetch(this.#baseUrl + `vaccines`);
        const data = await dataResponse.json();
        const continentData = Object.values(data).map(o => o.All).filter(c => !!c.population && !!c.updated && !!c.people_vaccinated);
        return _.groupBy(continentData, `country`);
    }

}
import _, { keyBy, keys, values } from 'lodash'
import CovidDataMediaGroup from './service/covid-data-mediagroup'
import NavigatorButtons from './ui/navigators_buttons';
import Spinner from './ui/spinner';
import TableHandler from './ui/table_handler';
import { calcPercentage } from './utils/percentage';
import Render from './ui/rendering';
import FormHandler from './ui/form-handler';

const dataProvider = new CovidDataMediaGroup();
const spinner = new Spinner(`spinner`);
const activeButton = new NavigatorButtons([`continentsData`, `confirmedCases`, `deathCases`, `vaccineData`, `submit-form-select-country`]);
const continentsData = new TableHandler([
    { key: `continent`, displayName: `Continent` },
    { key: `percentOfTheConfirmedCases`, displayName: `Percent of the confirmed cases (%)` },
    { key: `percentOfTheDeathCases`, displayName: `Percent of the death cases (%)` },
    { key: `dateOfTheUpdate`, displayName: `Date of the update` }
], `continentsDataTable`, `sortContinentData`);
const vaccineData = new TableHandler([
    { key: `country`, displayName: `Country` },
    { key: `percentOfTheVaccinatedPopulation`, displayName: `Percent of the vaccinated population (%)` },
    { key: `dateOfTheUpdate`, displayName: `Date of the update` }
], `vaccineDataTable`, `sortVaccineData`);
const confirmedHistoryData = new TableHandler([
    { key: `dateFrom`, displayName: `From` },
    { key: `dateTo`, displayName: `To` },
    { key: `confirmedCases`, displayName: `Confirmed Cases` }
], `confirmedHistoryTable`);
const deathHistoryData = new TableHandler([
    { key: `dateFrom`, displayName: `From` },
    { key: `dateTo`, displayName: `To` },
    { key: `deathCases`, displayName: `Death Cases` }
], `deathHistoryTable`);
async function continentArray() {
    const continentCases = await dataProvider.getContinentCases();
    const arrayOfContinentData = new Render(activeButton, 0, spinner, continentFunction, continentCases);
    return arrayOfContinentData;
}
async function confirmedHistory() {
    const confirmedHistory = await dataProvider.getHistoryCases(`confirmed`, obj.country);
    const confirmedArray = new Render(activeButton, 1, spinner, confirmedHistoryFunction, confirmedHistory);
    return confirmedArray;
}
async function deathHistory() {
    const deathHistory = await dataProvider.getHistoryCases(`deaths`, obj.country);
    const confirmedArray = new Render(activeButton, 2, spinner, confirmedHistoryFunction, deathHistory);
    return confirmedArray;
}
async function vaccineArray() {
    const vaccineCases = await dataProvider.getVaccineCases();
    const arrayOfVaccineData = new Render(activeButton, 3, spinner, vaccineFunction, vaccineCases);
    return arrayOfVaccineData;
}
const intervalOptions = [1, 3, 4, 6, 12];
const selectCountryForm = new FormHandler(`select-form`, `alert`);
const obj = { country: ``, interval: `` };
selectCountryForm.addHandler(a => {
    obj.country = a.selectCountries;
    obj.interval = a.timesInterval;
    return ``;
})
async function countries() {
    return Object.keys(await dataProvider.getVaccineCases());
}
async function fillForms() {
    selectCountryForm.fillOptions(`select-country`, await countries());
    selectCountryForm.fillOptions(`select-time`, intervalOptions);
}
fillForms();
/*******************************************************Continents Data**************************************************************/
function continentFunction(arrayElement) {
    return {
        continent: arrayElement[0].continent,
        percentOfTheConfirmedCases: calcPercentage(arrayElement, o => o.confirmed, arrayElement), // untils function calcPercentage
        percentOfTheDeathCases: calcPercentage(arrayElement, o => o.deaths, arrayElement), // untils function calcPercentage
        dateOfTheUpdate: arrayElement[0].updated
    }
}
/************************************************************************************************************************************/
/************************************************Confirmed / Death Cases History Data********************************************************/
function confirmedHistoryFunction(arrayElement) {
    const stringDateTo = Object.keys(arrayElement[0].dates)[0];
    const dateTo = new Date(stringDateTo);
    const flag = new Date(dateTo);
    const dateFrom = new Date (flag.setMonth(flag.getMonth() - obj.interval));
    return {
        dateFrom: dateFrom.toLocaleDateString(),
        dateTo: dateTo.toLocaleDateString(),
        confirmedCases: arrayElement[0].dates[stringDateTo] - arrayElement[0].dates[`${dateFrom.getFullYear()}-${dateFrom.getMonth() < 10 ? `0`+ dateFrom.getMonth() : dateFrom.getMonth()}-${dateFrom.getDate()}`]
    }
}
/************************************************************************************************************************************/
/********************************************************Vaccine Data ***************************************************************/
function vaccineFunction(arrayElement) {
    return {
        country: arrayElement[0].country,
        percentOfTheVaccinatedPopulation: calcPercentage(arrayElement, o => o.people_vaccinated, arrayElement), // untils function calcPercentage
        dateOfTheUpdate: arrayElement[0].updated
    }
}
/************************************************************************************************************************************/

function hideAll() {
    continentsData.hideTable();
    confirmedHistoryData.hideTable();
    deathHistoryData.hideTable();
    vaccineData.hideTable();
    selectCountryForm.hide();
}
window.showContinentsData = async () => {
    hideAll();
    const data = await continentArray();
    continentsData.showTable(await data.showData());
}
window.sortContinentData = async (key) => {
    const data = await continentArray();
    continentsData.showTable(await data.sortData(key));
}
window.showConfirmedHistoryData = async () => {
    hideAll();
    selectCountryForm.show();
    const data = await confirmedHistory();
    confirmedHistoryData.showTable(await data.showData());
}
window.showDeathHistoryData = async () => {
    hideAll();
    selectCountryForm.show();
    const data = await deathHistory();
    deathHistoryData.showTable(await data.showData());
}
window.showVaccineData = async () => {
    hideAll();
    const data = await vaccineArray();
    vaccineData.showTable(await data.showData());
}
window.sortVaccineData = async (key) => {
    const data = await vaccineArray();
    vaccineData.showTable(await data.sortData(key));
}


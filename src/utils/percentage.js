import _ from "lodash";

export function calcPercentage(firstEl, callback1, array){
    return _.round(_.sumBy(firstEl, callback1) / _.sumBy(array, o => o.population) * 100, 2);
}
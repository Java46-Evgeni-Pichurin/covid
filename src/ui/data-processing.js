export async function CommonFunction(dataFunction, providerFunction) {
    const data = Object.values(providerFunction);
    return buildObject(data, dataFunction);
}
function buildObject(arrayOfObjects, dataFunction) {
    return _.map(arrayOfObjects, arrayElement => dataFunction(arrayElement))
}
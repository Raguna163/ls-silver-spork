const reA = /[^a-zA-Z]/g;
const reN = /[^1-9]/g;

export function sortFiles (a, b) {
    const aName = a.name;
    const bName = b.name;
    const aA = aName.replace(reA, "");
    const bA = bName.replace(reA, "");
    if (aA === bA) {
        const aN = parseInt(aName.replace(reN, ""), 10);
        const bN = parseInt(bName.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}
export function timed(func, ...args) {
    const label = func.name;
    console.time(label);
    const returnValue = func(...args);
    console.timeEnd(label);
    return returnValue;
}

export function timed(func, ...args) {
    const before = performance.now()
    const returnValue = func(...args);
    const after = performance.now()
    const time = after - before
    return [returnValue, time];
}

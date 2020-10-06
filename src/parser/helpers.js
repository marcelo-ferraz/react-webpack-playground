import { resolve as pathResolve, dirname } from 'path';

export const isItMeaningful = (code) => {
    return String.prototype.replace.call(code || '', /(\r\n|\n|\r)/gm, '');
};

export function resolve(path) {
    if (path.startsWith('.')) {
        const resolvedUrl = pathResolve(dirname(module.i), path); // eslint-disable-next-line no-undef
        return Object.keys(__webpack_require__.m).filter(
            (key) =>
                key === `.${resolvedUrl}` ||
                key === `.${resolvedUrl}.js` ||
                key === `.${resolvedUrl}/index.js`,
        )[0];
    } // eslint-disable-next-line no-undef
    return Object.keys(__webpack_require__.m).filter(
        (key) =>
            key === `./node_modules/${path}` ||
            key === `./node_modules/${path}.js` ||
            key === `./node_modules/${path}/index.js`,
    )[0];
}

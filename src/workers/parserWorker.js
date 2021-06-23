import { extname } from 'path';
import { js, json, jsx } from '../fileExtensions';
import { isItMeaningful } from '../parser/helpers';
import transform2Js from '../parser/transform2Js';

const byEqual =
    (path) =>
    ([key]) =>
        key === path || key === `${path}.js` || key === `${path}/index.js`;

const pathFinder = (obj) => {
    const find = Array.prototype.find.bind(Object.entries(obj));
    return (path) => find(byEqual(path)) || [];
};

function findAllImports(code, whenFound) {
    const findImports =
        /__customRequire\(__webpack_require__\,\s*\\?("|')(?<importId>\.\.?\/[\w\.\s\/-]+)\\?("|')/gm;
    let match;

    do {
        match = findImports.exec(code);

        if (match && match.groups) {
            const { importId } = match.groups;
            whenFound(importId);
        }
    } while (match);
}

onmessage = function ({ data }) {
    const [nextJsEntries, entryPath] = data;

    const jsFinder = pathFinder(nextJsEntries);

    const es5Entries = parseNShake(jsFinder, entryPath);

    this.postMessage(es5Entries);
};

const parseNShake = (findBy, path, parsedNShaken = {}) => {
    const [, rawCode] = findBy(path);

    const type = extname(path);

    switch (type) {
        case '':
        case js:
        case jsx: {
            const id = path.endsWith(ext) ? path.substring(0, path.length - ext.length) : path;

            if (parsedNShaken[id]) {
                return parsedNShaken;
            }
            let code = null;

            parsedNShaken[path] = {
                ext: type || '.js',
                code,
            };

            if (isItMeaningful(rawCode)) {
                code = `(function(module, exports, __webpack_require__) { ${transform2Js(
                    path,
                    rawCode,
                )} })`;

                findAllImports(code, (key) => {
                    parsedNShaken = parseNShake(findBy, key, parsedNShaken);
                });
            }

            break;
        }
        case json: {
            parsedNShaken[path] = {
                ext: '.json',
                code: JSON.parse(rawCode),
            };

            break;
        }
        default:
            throw new TypeError(`The type "${type}" is not yet supported`);
    }

    return parsedNShaken;
};

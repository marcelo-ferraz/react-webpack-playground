import { extname } from 'path';
import { js, json, jsx } from '../fileExtensions';
import { findAllImports, isItMeaningful } from './helpers';
import transform2Js from './transform2Js';

function parseNShake(findBy, path, parsedNShaken = {}) {
    const [, rawCode] = findBy(path);

    const type = extname(path);

    switch (type) {
        case '':
        case js:
        case jsx: {
            const id = path.endsWith(type) ? path : `${path}.js`;

            if (parsedNShaken[id]) {
                return parsedNShaken;
            }

            let code = null;

            if (isItMeaningful(rawCode)) {
                code = `(function(module, exports, __webpack_require__) { ${transform2Js(
                    path,
                    rawCode,
                )} })`;

                findAllImports(code, (key) => {
                    parsedNShaken = parseNShake(findBy, key, parsedNShaken);
                });
            }

            parsedNShaken[id] = [code, type || '.js'];

            break;
        }
        case json: {
            parsedNShaken[path] = [JSON.parse(rawCode), '.json'];

            break;
        }
        default:
            throw new TypeNotSupportedError(type);
    }

    return parsedNShaken;
}

export default parseNShake;

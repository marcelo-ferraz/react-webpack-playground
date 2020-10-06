import * as Babel from '@babel/standalone';
import { find } from 'lodash';
import { resolve as pathResolve, dirname, basename, extname } from 'path';
import { js, json, jsx } from '../fileExtensions';
import { isItMeaningful } from './helpers';
import { resolve } from './helpers';

const emptyFunc = function () {
    // eslint-disable-next-line no-useless-return
    return;
};

function reduceAllImports(code, whenFound) {
    const findImports = /__customRequire\(\\?("|')\.\/(?<importId>[\w-\.\s]+)\\?("|')/gm;

    let match;
    do {
        match = findImports.exec(code);

        if (match && match.groups) {
            const { importId } = match.groups;
            const ext = extname(importId);
            whenFound(importId.replace(ext, ''), ext || '.js');
        }
    } while (match);
}

export async function render(entries) {
    let importList = {};

    // eslint-disable-next-line no-unused-vars, no-underscore-dangle
    const __customRequire = (path) => {
        const keyFound = find(
            Object.keys(importList),
            (key) =>
                `./${key}` === path ||
                `./${key}` === `${path}.js` ||
                `./${key}` === `${path}/index.js`,
        );

        if (!keyFound) {
            /* eslint-disable-next-line no-undef */
            return __webpack_require__(resolve(path));
        }
        debugger;

        const { exports } = jsInvoke(importList[keyFound]);

        return exports;
    };

    const parse = (rawCode) => {
        const { code } = Babel.transform(rawCode, { presets: ['es2015', 'react'] });
        return code.replace(/require\(/gm, '__customRequire(');
    };

    const renderImpl = async (key) => {
        const rawCode = entries[key];
        const unit = { i: `dynamic:${key}`, l: false, exports: {}, importList };
        if (!isItMeaningful(rawCode)) {
            return { func: emptyFunc, unit };
        }
        const type = extname(key);

        switch (type) {
            case '':
            case js:
            case jsx: {
                const code = parse(rawCode);

                reduceAllImports(code, (id, ext) => {
                    debugger;
                    if (importList[id]) {
                        return;
                    }
                    importList = { ...importList, [id]: renderImpl(id + ext) };
                });

                // eslint-disable-next-line no-eval
                const func = eval(`(function(module, exports, __webpack_require__) { ${code} })`);
                return { func, unit };
            }
            case json: {
                debugger;
                unit.exports = { default: JSON.parse(rawCode) };
                return { unit };
            }
            default:
                throw new TypeError(`${type} is not supported`);
        }
    };

    // render the tree starting from the root (main.js)
    const app = await renderImpl('app.js');

    // wait for all the imports to finish parsing
    importList = await Object.entries(importList).reduce(
        async (imports, [id, content]) => ({ ...imports, [id]: await content }),
        {},
    );

    return app;
}

export function jsInvoke({ func, unit }) {
    if (func) {
        func.call(
            unit.exports,
            unit,
            unit.exports, // eslint-disable-next-line no-undef
            __webpack_require__,
        );
    }
    return unit;
}

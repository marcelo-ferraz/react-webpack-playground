import * as Babel from '@babel/standalone';
import { find } from 'lodash';
import { resolve as pathResolve, dirname, basename, extname } from 'path';
import { js, json, jsx } from '../fileExtensions';
import { isItMeaningful } from './helpers';
import { resolve } from './helpers';

const findByPath = (obj, path) =>
    find(
        Object.entries(obj),
        ([key]) => key === path || key === `${path}.js` || key === `${path}/index.js`,
    ) || [];

const emptyFunc = function () {
    // eslint-disable-next-line no-useless-return
    return;
};

function reduceAllImports(code, whenFound) {
    const findImports = /__customRequire\(\\?("|')(?<importId>\.\.?\/[\w-\.\s\/]+)\\?("|')/gm;

    let match;
    do {
        match = findImports.exec(code);

        if (match && match.groups) {
            const { importId } = match.groups;
            whenFound(importId);
        }
    } while (match);
}

export async function render(entries, entryPath = null) {
    let allDependencies = {};
    let loadingDependencies = {};

    // eslint-disable-next-line no-unused-vars, no-underscore-dangle
    const __customRequire = (path) => {
        debugger;
        const [keyFound] = findByPath(allDependencies, path);

        if (!keyFound) {
            /* eslint-disable-next-line no-undef */
            return __webpack_require__(resolve(path));
        }

        const { exports } = jsInvoke(allDependencies[keyFound]);

        return exports;
    };

    const parse = (rawCode) => {
        const { code } = Babel.transform(rawCode, { presets: ['es2015', 'react'] });
        return code.replace(/require\(/gm, '__customRequire(');
    };

    const renderImpl = async (path) => {
        const [, rawCode] = findByPath(entries, path);
        const unit = { i: `dynamic:${path}`, l: false, exports: {} };
        if (!isItMeaningful(rawCode)) {
            return { func: emptyFunc, unit };
        }
        const type = extname(path);

        switch (type) {
            case '':
            case js:
            case jsx: {
                const code = parse(rawCode);

                reduceAllImports(code, (id) => {
                    // debugger;
                    if (loadingDependencies[id]) {
                        return;
                    }
                    loadingDependencies = { ...loadingDependencies, [id]: renderImpl(id) };
                });

                // eslint-disable-next-line no-eval
                const func = eval(`(function(module, exports, __webpack_require__) { ${code} })`);
                return [path, { func, unit }];
            }
            case json: {
                // debugger;
                unit.exports = JSON.parse(rawCode);
                return [path, { unit }];
            }
            default:
                throw new TypeError(`${type} is not supported`);
        }
    };

    // render the tree starting from the root (main.js)
    const [, app] = await renderImpl(entryPath || './app.js');
    debugger;
    // wait for all the imports to finish parsing
    allDependencies = (await Promise.all(Object.values(loadingDependencies))).reduce(
        (imports, [id, dependency]) => {
            return { ...imports, [id]: dependency };
        },
        {},
    );

    // await Object
    //     // from all loading dependencies
    //     .entries(loadingDependencies)
    //     // wait for every single one
    //     .reduce((previous, [id, loadingDependency]) => {
    //         return previous.then(([resolvedId, dependency]) => {
    //             allDependencies = resolvedId && { ...allDependencies, [resolvedId]: dependency };
    //             return [id, loadingDependency];
    //         });
    //     }, Promise.resolve([]));
    debugger;
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

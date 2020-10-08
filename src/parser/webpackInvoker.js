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

function reduceAllImports(code, whenFound, initialState) {
    const findImports = /__customRequire\(\\?("|')(?<importId>\.\.?\/[\w-\.\s\/]+)\\?("|')/gm;
    let acc = initialState;
    let match;
    do {
        match = findImports.exec(code);

        if (match && match.groups) {
            const { importId } = match.groups;
            acc = whenFound(acc, importId);
        }
    } while (match);
    return acc;
}

const parse = (rawCode) => {
    const { code } = Babel.transform(rawCode, { presets: ['es2015', 'react'] });
    return code.replace(/require\(/gm, '__customRequire(');
};

const customRequire = function (dependencies, path) {
    const [keyFound] = findByPath(dependencies, path);

    if (!keyFound) {
        /* eslint-disable-next-line no-undef */
        return __webpack_require__(resolve(path));
    }

    const { exports } = jsInvoke(dependencies[keyFound]);

    return exports;
};

export async function render(entries, entryPath = null) {
    const renderImpl = (path, dependencies = {}) => {
        const [, rawCode] = findByPath(entries, path);
        const unit = { i: `dynamic:${path}`, l: false, exports: {} };

        if (!isItMeaningful(rawCode)) {
            return { unit, dependencies };
        }

        // eslint-disable-next-line no-unused-vars, no-underscore-dangle
        function __customRequire(path) {
            return customRequire(dependencies, path);
        }

        function loadDependencies(deps, id) {
            return !deps[id] ? { ...deps, [id]: renderImpl(id, deps) } : deps;
        }

        const type = extname(path);

        switch (type) {
            case '':
            case js:
            case jsx: {
                const code = parse(rawCode);

                dependencies = reduceAllImports(code, loadDependencies, dependencies);

                // eslint-disable-next-line no-eval
                const func = eval(`(function(module, exports, __webpack_require__) { ${code} })`);
                return { func, unit };
            }
            case json: {
                // debugger;
                unit.exports = JSON.parse(rawCode);
                return { unit };
            }
            default:
                throw new TypeError(`The type "${type}" is not supported`);
        }
    };

    // render the tree starting from the root (main.js)
    const context = renderImpl(entryPath || './app.js');
    return context;
}

export function jsInvoke({ func, unit }) {
    if (func) {
        // eslint-disable-next-line no-undef
        func.call(unit.exports, unit, unit.exports, __webpack_require__);
    }

    return unit;
}

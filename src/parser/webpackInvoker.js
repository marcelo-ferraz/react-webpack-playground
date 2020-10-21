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
    const findImports = /__customRequire\(\\?("|')(?<importId>\.\.?\/[\w\.\s\/-]+)\\?("|')/gm;
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

const customRequireImpl = function (dependencies, path) {
    const [keyFound] = findByPath(dependencies, path);
    if (!keyFound) {
        /* eslint-disable-next-line no-undef */
        return __webpack_require__(resolve(path));
    }
    const { exports } = jsInvoke(dependencies[keyFound]);

    return exports;
};

const loadAllExtraDependencies = async ({ getExternalDependencies }) => {
    if (!getExternalDependencies) {
        return {};
    }

    const dependencies = getExternalDependencies();
    const dependencyValues = Promise.all(Object.values(dependencies));
    const dependencyKeys = Object.keys(dependencies);

    return (await dependencyValues).reduce((deps, depValue, i) => {
        return { ...deps, [dependencyKeys[i]]: depValue };
    }, {});
};

export const defaultEntryPath = './app.js';

export async function render(strategy, entryPath = null) {
    const renderImpl = (path, dependencies = {}) => {
        const [, rawCode] = findByPath(strategy.entries, path);
        const unit = { i: `dynamic:${path}`, l: false, exports: {} };

        if (!isItMeaningful(rawCode)) {
            return { unit };
        }

        // eslint-disable-next-line no-unused-vars, no-underscore-dangle
        function __customRequire(path) {
            return customRequireImpl(dependencies, path);
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
                return {
                    func,
                    unit,
                    customRequire: __customRequire,
                };
            }
            case json: {
                unit.exports = JSON.parse(rawCode);
                return { unit };
            }
            default:
                throw new TypeError(`The type "${type}" is not supported`);
        }
    };

    // render the tree starting from the root (./app.js)
    let extraDependencies = await loadAllExtraDependencies(strategy);

    if (strategy.beforeRender) {
        extraDependencies = strategy.beforeRender(strategy, extraDependencies);
    }

    const dynamicContext = renderImpl(entryPath || defaultEntryPath, extraDependencies);

    dynamicContext.customRequire = (path) => customRequireImpl(dependencies, path);
    dynamicContext.addDependencies = (key, value) => {
        dependencies = { ...dependencies, [key]: value };
    };

    dynamicContext.events = {
        beforeRender: strategy.beforeRender,
        beforeInvoke: strategy.beforeInvoke,
        afterInvoke: strategy.afterInvoke,
    };

    return dynamicContext;
}

export function jsInvoke(context) {
    if (context.func) {
        if (context.events && context.events.beforeInvoke) {
            context.events.beforeInvoke(context);
        }

        context.func.call(
            context.unit.exports,
            context.unit,
            context.unit.exports,
            // eslint-disable-next-line no-undef
            __webpack_require__,
        );

        if (context.events && context.events.afterInvoke) {
            context.events.afterInvoke(context);
        }
    }
    return context.unit;
}

import { transform } from '@babel/standalone';
import { find } from 'lodash';
import { extname } from 'path';
import { js, json, jsx } from '../fileExtensions';
import { isItMeaningful } from './helpers';
import { tryResolve } from './helpers';
import MissingModuleError from './MissingModuleError';

const byEqual = (path) => ([key]) =>
    key === path || key === `${path}.js` || key === `${path}/index.js`;

const findByPath = (obj, path) => find(Object.entries(obj), byEqual(path)) || [];

function findAllImports(code, whenFound) {
    const findImports = /__customRequire\(__webpack_require__\,\s*\\?("|')(?<importId>\.\.?\/[\w\.\s\/-]+)\\?("|')/gm;
    let match;

    do {
        match = findImports.exec(code);

        if (match && match.groups) {
            const { importId } = match.groups;
            whenFound(importId);
        }
    } while (match);
}

const parse = (rawCode) => {
    const { code } = transform(rawCode, { presets: ['es2015', 'react'] });
    return code.replace(/require\(/gm, '__customRequire(__webpack_require__, ');
};

const customRequireImpl = function (use = __webpack_require__, dependencies, path) {
    let fullPath = tryResolve(dependencies, path);

    if (fullPath) {
        const dependency = dependencies[fullPath];

        if (dependency.__esModule) {
            return dependency;
        }

        const invoked = jsInvoke(dependency);
        return invoked.exports || invoked;
    }

    fullPath = tryResolve(use.m, path);
    if (fullPath) {
        return use(fullPath);
    }

    try {
        return use(path);
    } catch (error) {
        throw new MissingModuleError(`Couldnt find a module for ${path}`, error);
    }
};

const loadAllExtraDependencies = async ({ getExtraDependencies }) => {
    if (!getExtraDependencies) {
        return {};
    }

    const dependencies = getExtraDependencies();
    const dependencyValues = Promise.all(Object.values(dependencies));
    const dependencyKeys = Object.keys(dependencies);

    return (await dependencyValues).reduce((deps, depValue, i) => {
        return { ...deps, [dependencyKeys[i]]: depValue };
    }, {});
};

export const defaultEntryPath = './App.js';

export async function render(strategy, entryPath = null) {
    let dependencies = {};

    const renderImpl = (path) => {
        const [, rawCode] = findByPath(strategy.entries, path);
        const unit = { i: `dynamic:${path}`, l: false, exports: {} };

        if (!isItMeaningful(rawCode)) {
            return { unit };
        }

        // eslint-disable-next-line no-unused-vars, no-underscore-dangle
        function __customRequire(req, path) {
            return customRequireImpl(req, dependencies, path);
        }

        function addToDependencies(deps, id) {
            dependencies[id] = renderImpl(id, dependencies);
        }

        const type = extname(path);

        switch (type) {
            case '':
            case js:
            case jsx: {
                const code = parse(rawCode);
                findAllImports(code, (id) => {
                    dependencies[id] = renderImpl(id, dependencies);
                });
                // eslint-disable-next-line no-eval
                const func = eval(`(function(module, exports, __webpack_require__) { ${code} })`);
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
                throw new TypeError(`The type "${type}" is not supported`);
        }
    };

    // render the tree starting from the root (./app.js)
    let extraDependencies = (await loadAllExtraDependencies(strategy)) || {};

    if (strategy.beforeRender) {
        extraDependencies = strategy.beforeRender(strategy, extraDependencies);
    }

    dependencies = { ...dependencies, ...extraDependencies };

    const dynamicContext = renderImpl(entryPath || defaultEntryPath);

    dynamicContext.customRequire = (path) =>
        customRequireImpl(__webpack_require__, dependencies, path);
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

        context.func(
            context.unit,
            context.unit.exports,
            // eslint-disable-next-line no-undef
            __webpack_require__,
        );

        if (context.events && context.events.afterInvoke) {
            context.events.afterInvoke(context);
        }
    }
    return context.unit;
}

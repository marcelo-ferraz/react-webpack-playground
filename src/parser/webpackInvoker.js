import { extname } from 'path';
import { js, json, jsx } from '../fileExtensions';
import { isItMeaningful } from './helpers';
import { tryResolve } from './helpers';
import MissingModuleError from './MissingModuleError';
import transform2Js from './transform2Js';

const byEqual =
    (path) =>
    ([key]) =>
        key === path || key === `${path}.js` || key === `${path}/index.js`;

const findByPath = (obj, path) => find(Object.entries(obj), byEqual(path)) || [];

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

const parserWorker = new Worker(new URL('../workers/parserWorker', import.meta.url));

export const defaultEntryPath = './App.js';

export async function render(strategy, entryPath = defaultEntryPath) {
    parserWorker.postMessage([strategy.entries, entryPath]);

    return new Promise((resolve, reject) => {
        parserWorker.onmessage = async ({ data: entries }) => {
            try {
                resolve(await renderImpl(entries, entryPath));
            } catch (e) {
                reject(e);
            }
        };
    });
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

async function renderImpl(entries, entryPath) {
    let dynamicContext = null;
    let dependencies = {};

    // this custom require is the entry point to the module system compiled in dev mode
    // eslint-disable-next-line no-unused-vars, no-underscore-dangle
    function __customRequire(req, path) {
        return customRequireImpl(req, dependencies, path);
    }

    let extraDependencies = (await loadAllExtraDependencies(strategy)) || {};

    if (strategy.beforeRender) {
        extraDependencies = strategy.beforeRender(strategy, extraDependencies);
    }

    dependencies = { ...dependencies, ...extraDependencies };

    for (const [path, entry] of Object.entries(entries)) {
        const { ext, code } = entry;
        const unit = { i: `dynamic:${path}`, l: false, exports: {} };

        if (!code) {
            continue;
        }

        switch (ext) {
            case '':
            case js:
            case jsx: {
                // eslint-disable-next-line no-eval
                const func = eval(code);

                const ctx = {
                    func,
                    unit,
                    customRequire: __customRequire,
                };

                if (path === entryPath) {
                    dynamicContext = ctx;
                }

                const id = path.endsWith(ext) ? path.substring(0, path.length - ext.length) : path;

                dependencies[id] = ctx;
                break;
            }
            case json: {
                unit.exports = code;
                dependencies[path] = { unit };
                break;
            }
        }
    }

    if (dynamicContext && dynamicContext.func) {
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
}

import { js, json, jsx } from '../fileExtensions';
import { pathFinder } from './helpers';
import { tryResolve } from './helpers';
import MissingModuleError from './errors/MissingModuleError';
import parseNShake from './parseNShake';

// eslint-disable-next-line no-undef
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
        throw new MissingModuleError(path, error);
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

let parserWorker;
const defaultEntryPath = './App';

const getParserWorker = () => {
    if (!parserWorker) {
        if (!window.Worker) {
            throw new Error('The browser doesnt support web workers');
        }

        parserWorker = new Worker(new URL('../workers/parserWorker', import.meta.url));
    }

    return parserWorker;
};

async function renderHere(strategy, entryPath, finder) {
    const jsFinder = finder || pathFinder(strategy.entries);

    const es5Entries = parseNShake(jsFinder, entryPath || defaultEntryPath);

    return await renderImpl(es5Entries, entryPath, strategy);
}

async function renderElsewhere(strategy, entryPath = defaultEntryPath) {
    const worker = getParserWorker();
    worker.postMessage([strategy.entries, entryPath]);

    return new Promise((resolve, reject) => {
        worker.onmessage = async ({ data: entries }) => {
            try {
                resolve(await renderImpl(entries, entryPath, strategy));
            } catch (e) {
                reject(e);
            }
        };
    });
}

function jsInvoke(context) {
    if (context.func) {
        if (context.events && context.events.beforeInvoke) {
            context.events.beforeInvoke(context);
        }

        context.func(context.unit, context.unit.exports, __webpack_require__);

        if (context.events && context.events.afterInvoke) {
            context.events.afterInvoke(context);
        }
    }
    return context.unit;
}

async function renderImpl(entries, entryPath, strategy) {
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

export { renderHere, renderElsewhere, jsInvoke, defaultEntryPath };

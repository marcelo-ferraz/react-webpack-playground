export const byEqual =
    (path) =>
    ([key]) =>
        key === path || key === `${path}.js` || key === `${path}/index.js`;

export const pathFinder = (obj) => {
    const find = Array.prototype.find.bind(Object.entries(obj));
    return (path) => find(byEqual(path)) || [];
};

export const findAllImports = (code, whenFound) => {
    const findImports =
        /__customRequire\(__webpack_require__,\s*\\?("|')(?<importId>\.\.?\/[\w.\s/-]+)\\?("|')/gm;
    let match;

    do {
        match = findImports.exec(code);

        if (match && match.groups) {
            const { importId } = match.groups;
            whenFound(importId);
        }
    } while (match);
};

export const isItMeaningful = (code) => {
    return String.prototype.replace.call(code || '', /(\r\n|\n|\r)/gm, '');
};

export function tryResolve(modules, path) {
    if (modules[path]) {
        return path;
    }

    const isANodeModule = !path.startsWith('.') && !path.startsWith('@') && !path.indexOf(':') >= 0;

    const resolvedUrl = isANodeModule ? `./node_modules/${path}` : path;

    if (modules[resolvedUrl]) {
        return resolvedUrl;
    }

    if (modules[`${resolvedUrl}.js`]) {
        return `${resolvedUrl}.js`;
    }

    if (modules[`${resolvedUrl}/index.js`]) {
        return `${resolvedUrl}/index.js`;
    }
}

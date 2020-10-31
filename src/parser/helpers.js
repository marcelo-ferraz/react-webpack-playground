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

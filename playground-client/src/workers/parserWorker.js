import { pathFinder } from '../transpiling/helpers';
import parseNShake from '../transpiling/parseNShake';

onmessage = function ({ data }) {
    try {
        const [nextJsEntries, entryPath] = data;

        const jsFinder = pathFinder(nextJsEntries);

        const es5Entries = parseNShake(jsFinder, entryPath);

        this.postMessage({ es5Entries });
    } catch (error) {
        let sendableError = {
            message: error.message,
        };

        if (error.name === 'SyntaxError') {
            sendableError = {
                ...sendableError,
                name: error.name,
                code: error.code,
                line: error.loc.line,
                column: error.loc.column,
                code: error.code,
                reasonCode: error.code,
            };
        }
        this.postMessage({
            error: sendableError,
        });
    }
};

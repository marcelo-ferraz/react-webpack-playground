import { pathFinder } from '../transpiling/helpers';
import parseNShake from '../transpiling/parseNShake';

let wasmParser;

export const initWasmParser = async () => {
    const { JsParser } = await import('../../rs-parser');
    wasmParser = JsParser.new();
    console.log('parser init');
    return wasmParser;
};

onmessage = function ({ data }) {
    try {
        const [nextJsEntries, entryPath, runInJs] = data;

        let es5Entries;

        if (runInJs) {
            this.postMessage({
                es5Entries: parseNShake(pathFinder(nextJsEntries), entryPath),
            });
        } else if (wasmParser) {
            this.postMessage({
                es5Entries: wasmParser.parse(nextJsEntries, entryPath),
            });
        } else {
            initWasmParser().then((p) => {
                this.postMessage({
                    es5Entries: p.parse(nextJsEntries, entryPath),
                });
            });
        }

        // const es5Entries = runInJs
        //     ? parseNShake(pathFinder(nextJsEntries), entryPath)
        //     : wasmParser.parse(nextJsEntries, entryPath);

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

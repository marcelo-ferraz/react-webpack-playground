import { pathFinder } from '../transpiling/helpers';
import parseNShake from '../transpiling/parseNShake';

onmessage = function ({ data }) {
    const [nextJsEntries, entryPath] = data;

    const jsFinder = pathFinder(nextJsEntries);

    const es5Entries = parseNShake(jsFinder, entryPath);

    this.postMessage(es5Entries);
};

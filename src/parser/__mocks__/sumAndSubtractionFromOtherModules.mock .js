export default {
    entries: {
        './app.js': `
import subtract from './subtraction.js';
import sum from './sum.js';

export { sum, subtract };
`,
        './subtraction.js': `
export default function subtract(left, right) {
    return left - right;
};
`,
        './sum.js': `
export default function sum(left, right) {
    return left + right;
}
`,
    },
};

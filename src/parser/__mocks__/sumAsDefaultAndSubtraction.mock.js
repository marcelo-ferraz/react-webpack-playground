export default {
    entries: {
        './app.js': `
export default function sum(left, right) {
    return left + right;
}

export const subtract = (left, right) => {
    return left - right;
};
`,
    },
};

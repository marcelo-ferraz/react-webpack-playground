export default {
    entries: {
        './App.js': `
import deepSum from './deeper-sum';

export default function sum(left, right) {
    return deepSum(left, right);
}`,
        './deep-sum.js': `
import deeperSum from './deeper-sum';

export default function sum(left, right) {
    return deeperSum(left + right);
}`,
        './deeper-sum.js': `
import {sum as deepestSum } from './deepest-sum';

export default function sum(left, right) {
    return deepestSum(left, right);
}`,
        './deepest-sum.js': `
export function sum(left, right) {
    return left + right;
}`,
    },
};

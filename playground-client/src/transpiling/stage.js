/* eslint-disable no-bitwise */

const stage = {
    none: 0,
    rendering: 1,
    invoking: 1 << 1,
    invoked: 1 << 2,
    notInvoked: 1 << 3,
    finished: 1 << 4,
    error: 1 << 5,

    has(bit, flags) {
        return (flags & bit) === bit;
    },
};

export default stage;

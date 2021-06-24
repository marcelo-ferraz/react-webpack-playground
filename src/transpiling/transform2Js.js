import { transform } from '@babel/standalone';

let cache = {};

const parse = (rawCode) => {
    const { code } = transform(rawCode, { presets: ['es2015', 'react'] });

    return {
        parsed: code.replace(/require\(/gm, '__customRequire(__webpack_require__, '),
        raw: new String(rawCode),
    };
};

const transform2Js = (path, rawCode) => {
    let code = cache[path];
    if (!code || code.raw.length !== rawCode.length || code.raw !== rawCode) {
        code = parse(rawCode);
        cache[path] = code;
    }

    return code.parsed;
};

export default transform2Js;

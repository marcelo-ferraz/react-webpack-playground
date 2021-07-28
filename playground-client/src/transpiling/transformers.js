import { transform } from '@babel/standalone';

export const reactJsTransform = (rawCode) => {
    const { code } = transform(rawCode, { presets: ['es2015', 'react'] });
    return code;
};

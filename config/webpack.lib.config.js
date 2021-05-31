const path = require('path');
const baseConfig = require('./webpack.base.config');

const getAceBuilds = () =>
    [
        'mode-javascript',
        'mode-jsx',
        'mode-json',
        'theme-twilight',
        'ext-language_tools',
        'snippets/javascript',
        'snippets/jsx',
        'ext-searchbox',
        'ext-beautify',
    ].reduce(
        (deps, dep) => {
            const fullPath = `ace-builds/src-min-noconflict/${dep}`;

            return { ...deps, [fullPath]: fullPath };
        },
        {
            'ace-builds/webpack-resolver': 'ace-builds/webpack-resolver',
        },
    );

const getExternals = () => {
    const react = {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
        umd: 'react',
    };

    const reactDom = {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
        umd: 'react-dom',
    };

    const lodash = {
        commonjs2: 'lodash',
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_',
    };

    const reactAce = {
        commonjs2: 'react-ace',
        commonjs: 'react-ace',
        amd: 'react-ace',
    };

    const standAloneBabel = {
        commonjs2: '@babel/standalone',
        commonjs: '@babel/standalone',
        amd: '@babel/standalone',
    };

    return {
        react,
        lodash,
        'react-dom': reactDom,

        '@babel/standalone': standAloneBabel,
        // 'react-ace': reactAce,
        // ...getAceBuilds(),
    };
};

const getOutput = () => ({
    path: path.resolve(process.cwd(), 'dist'),
    chunkFilename: '[name]_chunk.js',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'webpack-playground',
});

module.exports = (_, argv) => ({
    ...baseConfig,
    devtool: argv.mode === 'development' ? 'source-map' : 'none',
    entry: {
        index: './src/index',
    },
    output: getOutput(),
    externals: getExternals(),
});

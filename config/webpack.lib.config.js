const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const baseConfig = require('./webpack.base.config');

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
        root: '_', // indicates global variable
    };

    return {
        react,
        lodash,
        'react-dom': reactDom,
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
    plugins: [...baseConfig.plugins, new ManifestPlugin()],
});

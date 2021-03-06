const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const getOutput = () => ({
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js',
    library: 'carma-forms',
    libraryTarget: 'umd',
});

const htmlPlugin = new HtmlWebpackPlugin({
    template: path.resolve(process.cwd(), './demo/index.html'),
    fileName: './index.html',
});

module.exports = (_, argv) => ({
    ...baseConfig,
    devtool: argv.mode === 'development' ? 'source-map' : 'none',
    entry: path.resolve(process.cwd(), './demo/index'),
    output: getOutput(),
    devServer: {
        contentBase: './dist',
        hot: true,
        open: true,
    },
    plugins: [...baseConfig.plugins, htmlPlugin],
});

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const getOutput = () => ({
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'js/[name].js',
    library: 'carma-forms',
    libraryTarget: 'umd',
    chunkFilename: (pathData) => {
        if (
            pathData.chunk.id.indexOf('path-browserify') >= 0 &&
            pathData.chunk.id.indexOf('babel') >= 0
        ) {
            return 'babel-path-[hash].js';
        } else if (pathData.chunk.id.indexOf('babel') >= 0) {
            return 'babel-[hash].js';
        }

        return pathData.chunk.name ? 'js/[name]-[hash].js' : 'js/[id]-[hash].js';
    },
});

const htmlPlugin = new HtmlWebpackPlugin({
    template: path.resolve(process.cwd(), './demo/index.html'),
    fileName: './index.html',
});

module.exports = (_, argv) => {
    const baseCfg = baseConfig(_, argv);
    return {
        ...baseCfg,
        devtool: argv.mode === 'development' ? 'source-map' : 'none',
        entry: path.resolve(process.cwd(), './demo/index'),
        // output: getOutput(),
        devServer: {
            contentBase: path.join(process.cwd(), 'dist'),
            hot: true,
            open: true,
        },
        plugins: [...baseCfg.plugins, htmlPlugin],
    };
};

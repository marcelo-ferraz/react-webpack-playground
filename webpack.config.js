const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// eslint-disable-next-line no-unused-vars
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const jsRule = {
    test: /\.jsx?$/i,
    exclude: /(node_modules)((?!(@local|@fraedom)).)+$/,
    loader: 'babel-loader',
    options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
    },
};

const cssRule = {
    test: /\.s?css$/i,
    exclude: [/(node_modules)((?!(@local|@fraedom)).)+$/, /\.module\.scss$/i],
    use: ['style-loader', 'css-loader', 'sass-loader'],
};

const cssModuleRule = {
    test: /\.module\.scss$/i,
    exclude: /(node_modules)/,
    use: [
        {
            loader: 'style-loader',
            options: { injectType: 'lazyStyleTag' },
        },
        {
            loader: 'css-loader',
            options: { esModule: true, localsConvention: 'camelCase' },
        },
        'sass-loader',
    ],
};

const fontsRule = {
    test: /\.(svg|woff|woff2|ttf|eot)(\?[\s\S]+)?$/,
    loader: 'file-loader?name=./fonts/[name]-[hash].[ext]',
};

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
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name]_chunk.js',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'webpack-playground',
});

const entries = {
    index: './src/index',
};

module.exports = (env, argv) => ({
    devtool: argv.mode === 'development' ? 'source-map' : 'none',
    entry: entries,
    output: getOutput(),
    module: {
        rules: [jsRule, cssRule, cssModuleRule, fontsRule],
    },
    externals: getExternals(),
    plugins: [
        copyCarmaPlugin,
        new ManifestPlugin(),
        // new BundleAnalyzerPlugin(),
        new LodashModuleReplacementPlugin({
            collections: true,
            paths: true,
        }),
    ],
});

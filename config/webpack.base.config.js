const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// eslint-disable-next-line no-unused-vars
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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

const htmlRule = {
    test: /\.html$/i,
    loader: 'html-loader',
    options: { minimize: true },
};

const fileRule = {
    test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
    loader: 'file-loader',
};

module.exports = {
    module: {
        rules: [jsRule, cssRule, cssModuleRule, fontsRule, htmlRule, fileRule],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new LodashModuleReplacementPlugin({
            collections: true,
            paths: true,
        }),
    ],
};

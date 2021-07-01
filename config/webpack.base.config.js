// eslint-disable-next-line no-unused-vars
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const jsRule = {
    test: /\.jsx?$/i,
    exclude: /(node_modules).+$/,
    loader: 'babel-loader',
    options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
    },
};

const cssRule = {
    test: /\.s?css$/i,
    exclude: [/node_modules/, /\.module\.s?css$/i],
    use: ['style-loader', 'css-loader', 'sass-loader'],
};

const cssModuleRule = {
    test: /.scss$/i,
    include: /\.module\.s?css$/i,
    exclude: /node_modules/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                esModule: true,
                importLoaders: 1,
                modules: { exportLocalsConvention: 'camelCase' },
            },
        },
        'sass-loader',
    ],
};

const fontsRule = {
    test: /\.(svg|woff|woff2|ttf|eot)(\?[\s\S]+)?$/,
    // loader: 'file-loader?name=./fonts/[name]-[hash].[ext]',
    loader: 'file-loader',
    options: { name: './fonts/[name]-[hash].[ext]' },
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
        rules: [jsRule, cssModuleRule, cssRule, fontsRule, htmlRule, fileRule],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
    ],
};

// eslint-disable-next-line no-unused-vars
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const appPackageJson = require('../package.json');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
};

const cssModuleRule = {
    test: /.scss$/i,
    include: /\.module\.s?css$/i,
    exclude: /node_modules/,
    use: [
        MiniCssExtractPlugin.loader,
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
    options: { name: 'fonts/[name]-[hash].[ext]' },
};

const htmlRule = {
    test: /\.html$/i,
    loader: 'html-loader',
    options: {
        minimize: true,
    },
};

const fileRule = {
    test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
    loader: 'file-loader',
    options: { name: 'static/media/[name]-[hash].[ext]' },
};

const getOutput = (isDev) => ({
    // The build folder.
    path: path.resolve(process.cwd(), 'dist'), // !isDev ? '' : undefined,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isDev,
    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: !isDev ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: (pathData) => {
        if (pathData.chunk.id) {
            if (
                pathData.chunk.id.indexOf('path-browserify') >= 0 &&
                pathData.chunk.id.indexOf('babel') >= 0
            ) {
                return 'babel-path-[hash].js';
            } else if (pathData.chunk.id.indexOf('babel') >= 0) {
                return 'babel-[hash].js';
            }
        }

        return !isDev ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js';
    },
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    //  publicPath: paths.publicUrlOrPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: !isDev
        ? (info) => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    // Prevents conflicts when multiple webpack runtimes (from different apps)
    // are used on the same page.
    // jsonpFunction: `webpackJsonp${appPackageJson.name}`,
    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    globalObject: 'this',
});

module.exports = (_, argv) => {
    const isDev = argv.mode === 'development';

    const output = getOutput(isDev);

    return {
        output,
        module: {
            rules: [jsRule, cssModuleRule, cssRule, fontsRule, htmlRule, fileRule],
        },
        resolve: {
            fallback: {
                path: require.resolve('path-browserify'),
            },
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: !isDev
                    ? 'static/js/[name].[contenthash:8].chunk.js'
                    : 'static/js/[name].chunk.js',
            },
            runtimeChunk: {
                name: (entrypoint) => `runtime-${entrypoint.name}`,
            },
        },
        experiments: {
            asyncWebAssembly: true,
        },
        plugins: [
            // new BundleAnalyzerPlugin(),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css',
                chunkFilename: 'static/css/[id].css',
            }),
            new WasmPackPlugin({
                forceMode: 'production',
                outDir: path.resolve(__dirname, '../../playground-client/rs-parser'),
                crateDirectory: path.resolve(__dirname, '../../parser'),
            }),
        ],
    };
};

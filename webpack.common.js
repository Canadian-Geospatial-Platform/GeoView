/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const childProcess = require('child_process');
const package = require('./package.json');

// get version numbers and the hash of the current commit
const [major, minor, patch] = package.version.split('.');
const hash = JSON.stringify(childProcess.execSync('git rev-parse HEAD').toString().trim());
console.log(`Build CGP Viewer: ${major}.${minor}.${patch}`);

const config = {
    entry: {
        app: path.resolve(__dirname, 'src/app.tsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'gcpv-main.js',
    },
    resolve: {
        extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /.(ts|tsx|js|jsx)$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                loader: 'babel-loader',
            },
            {
                test: /\.s?[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: 'Canadian Geospatial Platform Viewer',
            inject: 'head',
            scriptLoading: 'blocking',
        }),
        new HtmlWebpackPlugin({
            template: './public/templates/usecases.html',
            inject: 'head',
            scriptLoading: 'blocking',
            filename: 'usecases.html',
            chunks: ['app'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './public/img', to: 'img' },
                { from: './public/locales', to: 'locales' },
                { from: './public/css', to: 'css' },
                { from: './public/geojson', to: 'geojson' },
            ],
        }),
        new webpack.DefinePlugin({
            __VERSION__: {
                major,
                minor,
                patch,
                timestamp: Date.now(),
                hash,
            },
        }),
    ],
};

module.exports = config;

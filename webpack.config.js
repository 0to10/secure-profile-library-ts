'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            buffer: false,
            crypto: false,
            process: false,
        },
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SecureProfiles',
        libraryTarget: 'window',
    },
};

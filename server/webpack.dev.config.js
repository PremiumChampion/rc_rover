import { resolve } from 'path';
import webpack from "webpack";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import CopyPlugin from "copy-webpack-plugin";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export default {
    entry: './src/index.ts',
    mode: "development",
    devtool: "cheap-source-map",
    target: 'node',
    experiments: {
        outputModule: true,
    },
    output: {
        path: resolve(_dirname, 'build'),
        filename: 'index.js',
        module: true,
        scriptType: "module",
        chunkFormat: "module"
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false, // resolves .mjs and .js files without specifying the whole path
                },
            },
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map'
        }),
        new CopyPlugin({
            patterns: [
                { from: "Static", to: resolve(_dirname, 'build', "static") },
                { from: "exec", to: resolve(_dirname, 'build', "exec") },
            ],
        }),
    ],
    node: {
        global: true,
        __filename: true,
        __dirname: true,
    },
};
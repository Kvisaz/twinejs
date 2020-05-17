const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

const isRelease = process.env.NODE_ENV === 'production';
const SRC = path.join(__dirname, "src", 'electron');
const DIST = path.join(__dirname, "dist");
const DIR_NODE = path.join(__dirname, "node_modules");

const entries = {
    'index': path.join(SRC, 'index.js'),
};
const copyPaths = [
    'package.json', // APPLICATION package.json
];

module.exports = (env, argv) => {
    return {
        context: SRC,
        entry: entries,
        mode: isRelease ? 'production' : "development",
        target: "electron-main",
        output: {
            path: DIST,
            filename: `[name].js`
        },
        resolve: {
            extensions: ['.js'],
            modules: [
                SRC,
                DIR_NODE
            ]
        },
        /*   module: {
               rules: [
                   {test: /\.tsx?$/, loader: "ts-loader"},
               ],
           },*/

        plugins: [
            new CopyPlugin(copyPaths.map(dir => ({
                from: dir, to: ''
            }))),
        ]
    };
};

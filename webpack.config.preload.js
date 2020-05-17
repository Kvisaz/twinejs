const path = require("path");
const isRelease = process.env.NODE_ENV === 'production';

const SRC = path.join(__dirname, "src", 'electron');
const DIST = path.join(__dirname, "dist");
const DIR_NODE = path.join(__dirname, "node_modules");

const entries = {
    'preload': path.join(SRC, 'preload.js'),
};


module.exports = (env, argv) => {
    return {
        context: SRC,
        entry: entries,
        mode: isRelease ? 'production' : "development",
        target: "electron-renderer",
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
        }
    };
};

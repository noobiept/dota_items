const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./scripts/main.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "libraries/**/*.js", to: "./" },
                { from: "css/**/*.css", to: "./" },
                { from: "images/**/*.png", to: "./" },
                { from: "sounds/**/*.mp3", to: "./" },
            ],
        }),
    ],
};

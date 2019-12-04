const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: ['./src/index.tsx'],
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    // devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.css$/i,
                use: ['css-loader'],
            },
        ]
    },
    devServer: {
        contentBase: "./src",
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
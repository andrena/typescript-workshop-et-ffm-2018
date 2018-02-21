const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./client/src/index.tsx",
    output: {
        path: `${__dirname}/build/dist`,
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "client/src/index.html" })
    ],
    devServer: {
        historyApiFallback: false,
        proxy: {
            "/api": { target: "http://localhost:8081" }
        }
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const entry = {
    // app: "./src/App",
    app: "./src/Root",
}

const babelRule = {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    loader: "babel-loader"
}

const cssRule = {
    test: /\.css/,
    use: ["style-loader", { loader: "css-loader", options: { url: false } }]
}

const development = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, "dev-dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [babelRule, cssRule]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.html"] }], { context: "static" }),
        new CopyWebpackPlugin([{ from: ".", to: "./css", ignore: ["!*.css"] }], { context: "static/css" }),
        new CopyWebpackPlugin([{ from: ".", to: "./js", ignore: ["!*.js"] }], { context: "static/js" }),
        new CopyWebpackPlugin([{ from: ".", to: "./assets", ignore: ["!*"] }], { context: "static/assets" }),
        new CopyWebpackPlugin([{ from: ".", to: "./", ignore: ["!sw.js"] }], { context: "static/" }),
        new CopyWebpackPlugin([{ from: ".", to: "./", ignore: ["!manifest.json"] }], { context: "static/" }),
    ],
    // devServer: {
    //     public: "c72f14ca.ngrok.io",
    // },
    devtool: "inline-source-map"
};

const production = {
    mode: "production",
    entry: entry,
    output: {
        path: path.resolve(__dirname, "prod-dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [babelRule, cssRule]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.html"] }], { context: "static" }),
        new CopyWebpackPlugin([{ from: ".", to: "./css", ignore: ["!*.css"] }], { context: "static/css" }),
        new CopyWebpackPlugin([{ from: ".", to: "./js", ignore: ["!*.js"] }], { context: "static/js" }),
        new CopyWebpackPlugin([{ from: ".", to: "./assets", ignore: ["!*"] }], { context: "static/assets" }),
        new CopyWebpackPlugin([{ from: ".", to: "./", ignore: ["!sw.js"] }], { context: "static/" }),
        new CopyWebpackPlugin([{ from: ".", to: "./", ignore: ["!manifest.json"] }], { context: "static/" }),
    ]
};

if ((process.env.NODE_ENV || "").trim() != "production") {
    console.log("NODE_ENV", "development");
    module.exports = development;
} else {
    console.log("NODE_ENV", "production");
    module.exports = production;
}

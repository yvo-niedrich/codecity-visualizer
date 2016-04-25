module.exports = {
    entry: {
        bundle: "./src/main.js",
        demo: "./src/demo.js"
    },
    output: {
        path: __dirname + "/app",
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /src\/.*\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] } },
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};

var webpack = require('webpack'),
    devtool = '#eval',
    babel = 'babel-loader',
    minimize = process.argv.indexOf('--minimize') !== -1,
    plugins = [];

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    // devtool = '#source-map';
    babel = 'babel';
}

module.exports = {
    entry: {
        bundle: "./src/main.js"
    },
    output: {
        path: __dirname + "/app",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /src\/.*\.js$/,
                loader: babel,
                query: { presets: ['es2015'] }
            }
        ]
    },
    plugins: plugins,
    devtool: devtool
};

var webpack = require('webpack'),
    devtool = '#eval',
    babel = 'babel-loader',
    minimize = process.argv.indexOf('--minimize') !== -1,
    plugins = [];

if (minimize) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename:"vendor.js", minChunks: Infinity}));
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    babel = 'babel';
}

module.exports = {
    entry: {
        bundle: "./src/main.js",
        vendor: ['three', 'three-orbit-controls']
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

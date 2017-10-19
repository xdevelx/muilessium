const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js&/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};


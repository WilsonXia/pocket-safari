const path = require('path');

module.exports = {
    entry: {
        login: './client/login.jsx',
        animal: './client/animal.jsx',
        zoo: './client/zoo.jsx',
        game: './client/game.jsx',
        settings: './client/settings.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            }
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};
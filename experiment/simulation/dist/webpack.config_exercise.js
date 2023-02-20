var path = require('path');
module.exports = {
    entry: './src/exercise.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'exercise.js',
        path: path.resolve(__dirname, 'dist'),
    }
};

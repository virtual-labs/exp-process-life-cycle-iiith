const path = require('path');

module.exports = {
  entry: './src/naya_main.ts',
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
    filename: 'naya_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
};


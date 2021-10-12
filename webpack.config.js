const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/DOM.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
const path = require('path')
require('dotenv').load({ path: path.join(__dirname, '.env') })
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const production = process.env.NODE_ENV === 'PRODUCTION'
const dirName = production ? 'public' : 'dist'
const publicPath = production ? '/assets' : '/static'

module.exports = {
  mode: production ? 'production' : 'development',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.join(__dirname, dirName),
    filename: 'index_bundle.js',
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /server/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: [/\.scss$/, /\.sass/],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
}

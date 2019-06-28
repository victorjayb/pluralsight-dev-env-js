import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export default {
  devtool: 'source-map',
  entry: {
    vendor: path.resolve(__dirname, 'src/vendor'),
    main: path.resolve(__dirname, 'src/index')
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
        }
      }
    }
  },
  plugins: [
    /* Use CommonsChunkPlugin to create a separate bundle of vendor libraries so that they're cached separately
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }), */

    // Generate an external css file with a hash in the filename
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    // Hash the files so that their name changes when their name changes
    new WebpackMd5Hash(),

    // Create new HTML file that includes reference to bundled js
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      noInfo: false
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.css$/, use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { sourceMap: true } }
      ], }
    ]
  }
};

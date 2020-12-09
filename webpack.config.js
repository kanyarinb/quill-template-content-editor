const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'dist/',
    chunkFilename: 'chunk.bundle.[name].js',
  },
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  resolve: {
    alias: {
      'parchment': path.resolve(__dirname, 'node_modules/parchment/src/parchment.ts'),
      'quill$': path.resolve(__dirname, 'node_modules/quill/quill.js'),
    },
    extensions: ['.js', '.ts', '.svg']
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [{
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['es2015']
      //     }
      //   }],
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: [
              '@babel/proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-syntax-dynamic-import',
              'transform-class-properties',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, 
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false,
              target: 'es5',
              module: 'commonjs'
            },
            transpileOnly: true
          }
        }]
      }, 
      {
        test: /\.svg$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '.'),
    compress: true,
    // hot: true,
    port: 6000,
  },
}
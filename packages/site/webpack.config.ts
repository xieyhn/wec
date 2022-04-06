import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isDev = process.env.NODE_ENV === 'development'

const webpackConfig: webpack.Configuration = {
  mode: isDev ? 'development': 'production',
  entry: path.resolve(__dirname, 'web-app/index.ts'),
  devtool: isDev ? 'source-map' : false,
  output: {
    filename: 'bundle.[contenthash:8].js',
    clean: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './web-app'),
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web-app/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash:8].css',
      chunkFilename: '[id].css',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __MODE__: `'${process.env.NODE_ENV}'`
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/, 
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/i,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}

export default webpackConfig

const path = require('path');
let webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/main.js', // 项目入口文件
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // 输出目录
  },
  module: {
    rules: [
      // 可以添加适用于各种文件类型的 loader 配置
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'], // 自动解析这些扩展名
    alias: {
      '@components': path.resolve(__dirname, 'src/components'), // 配置别名
    },
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'), // 指定静态文件目录
    },
    compress: true,
    port: 8090,
    host: '127.0.0.1',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      templateParameters: {
        BASE_URL: `/`,
      },
      filename: 'index.html',
    }),
    new VueLoaderPlugin(), // 使用npm 导入使用vue-loader的插件
    new webpack.HotModuleReplacementPlugin(), // 热更新引入(HMR 绝对不能被用在生产环境)
  ],
};

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const filename = (ext) => isDev ? `[name].${ext}` : `[name].${ext}`;
// const assetFilename = '[path][name][contenthash][ext]';
const assetFilename = '[path][name][ext]';

const pathDirFile = isDev ? 'app' : 'dist';

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/index.js', // Указываем входную точку
    output: { // Указываем точку выхода
        path: path.resolve(__dirname, pathDirFile), // Тут мы указываем полный путь к директории, где будет храниться конечный файл
        //path: path.join(__dirname, pathDirFile),
        filename: `./js/${filename('js')}`, // Указываем имя этого файла
        // assetModuleFilename: '[path][name][ext]',
        assetModuleFilename: assetFilename,
        clean: true,
    },
    devServer: {
        historyApiFallback: true,
        static: {
            // directory: path.resolve(__dirname, 'app'),
            directory: path.join(__dirname, 'src'),
        },
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template:  path.resolve(__dirname, 'src/index.pug'),
            filename: "index.html",
            // minify: {
            //     collapseWhitespace: isProd
            // }
        }),


        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`,
        }),

    ],

    module:{
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.pug$/,
                loader: 'pug3-loader',
                options: {
                    pretty: true,
                },
            },
            {
                test: /\.css$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev
                    },
                }, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '/';
                        },
                    }
                },
                    "css-loader",
                    'sass-loader'
                ],
            },
            {
                test: /\.(gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource',
            },

            //load fonts
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    }
};

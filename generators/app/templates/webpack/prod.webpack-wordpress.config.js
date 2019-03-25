const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


let config = (env, options) => {

    const MODE = options.mode;    
    return {
        entry: "./wp-content/themes/<%= name %>/src/js/main.js",
        output: {
            path: path.resolve(__dirname),
            filename: "./wp-content/themes/<%= name %>/js/main.js",
            publicPath: '/wp-content/themes/<%= name %>/js'
        },
        devtool: '',
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },{
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            //minimize: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')({
                                    browsers: ['last 2 versions']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|otf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: '/',
                            name: '[path][name].[ext]',
                            emitFile: false
                        }
                    }
                ]
            }],
        },
        node: {
            fs: "empty" // avoids error messages
        },
    
        plugins: [ 
            new MiniCssExtractPlugin({
                filename: "wp-content/themes/<%= name %>/css/main.css",
            }),
        ]
    }
} 

module.exports = config;

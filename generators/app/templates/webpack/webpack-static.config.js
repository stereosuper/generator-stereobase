const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let config = (env, options) => {
    const devMode = options.mode !== 'production';
    return {
        entry: './src/js/main.js',
        output: {
            path: path.resolve(__dirname, 'dest'),
            filename: 'main.js',
            publicPath: '/'
        },
        devtool: devMode ? 'source-map' : '',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [/node_modules\/@stereorepo/, path.resolve(__dirname, 'src', 'js')],
                    options: {
                        sourceMap: devMode
                    }
                },
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true
                            }
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg|woff|woff2)$/,
                    use: [
                        {
                            loader: 'file-loader'
                        }
                    ]
                }
            ]
        },
        node: {
            fs: 'empty' // avoids error messages
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: 'src/*.html', flatten: true },
                { from: 'src/img/', to: 'img/' }
            ]),
            new MiniCssExtractPlugin({
                filename: 'main.css'
            }),
            new BrowserSyncPlugin(
                // BrowserSync options
                {
                    // browse to http://localhost:3000/ during development
                    host: 'localhost',
                    port: 3000,
                    // proxy the Webpack Dev Server endpoint
                    // (which should be serving on http://localhost:3100/)
                    // through BrowserSync
                    proxy: 'http://localhost:8080/',
                    files: [
                        {
                            match: ['**/*.html']
                        }
                    ]
                }
            )
        ]
    };
} 

module.exports = config;

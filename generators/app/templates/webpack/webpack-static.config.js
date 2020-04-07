const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let config = (env, options) => {
    const devMode = options.mode !== 'production';
    const analysingMode = options.analyse;

    // Rules
    const rules = [];

    if (devMode) {
        rules.push({
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            include: [/node_modules\/@stereorepo/, path.resolve(__dirname, 'src', 'js')],
            options: {
                sourceMap: devMode
            }
        });
    } else {
        rules.push({
            test: /\.js$/,
            loader: 'babel-loader',
            include: [/node_modules\/@stereorepo/, path.resolve(__dirname, 'src', 'js')]
        });
    }

    // Plugins
    const plugins = [
        new MiniCssExtractPlugin({
            filename: 'main.css'
        })
    ];

    plugins.push(
        new CopyWebpackPlugin([
            { from: 'src/*.html', flatten: true },
            { from: 'src/img/', to: 'img/' }
        ])
    );

    if (devMode) {
        plugins.push(
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
        );
    } else {
        plugins.push(new CleanWebpackPlugin());
    }

    if (analysingMode) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    // Optimization
    let optimization = {};

    if (!devMode) {
        optimization = {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
        };
    }

    return {
        entry: './src/js/main.js',
        output: {
            path: path.resolve(__dirname, 'dest'),
            filename: 'js/[name].js',
            // Public path is important for dynamic imports. It'll help webpack to retrieve bundles by name and not by ids
            publicPath: '/',
            sourceMapFilename: 'js/[file].map?[contenthash]',
            chunkFilename: 'js/[name].js'
        },
        devtool: devMode ? 'source-map' : '',
        module: {
            rules: [
                ...rules,
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
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
        plugins,
        optimization
    };
};

module.exports = config;

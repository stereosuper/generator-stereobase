const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = (env, options) => {
    const devMode = options.mode !== 'production';
    const analysingMode = options.analyse;

    // Rules
    const rules = [];

    if (devMode) {
        rules.push({
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            include: [
                /node_modules\/@stereorepo/,
                path.resolve(__dirname, 'wp-content', 'themes', '<%= name %>', 'src', 'js'),
            ],
            options: {
                sourceMap: devMode
            }
        });
    } else {
        rules.push({
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                /node_modules\/@stereorepo/,
                path.resolve(__dirname, 'wp-content', 'themes', '<%= name %>', 'src', 'js'),
            ],
        });
    }

    // Plugins
    const plugins = [
        new MiniCssExtractPlugin({
            filename: '../css/[name].css'
        })
    ];

    if (devMode) {
        plugins.push(
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                proxy: 'http://<%= name %>.local/',
                files: [
                    {
                        match: ['**/*.php']
                    }
                ]
            })
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
        cache: !devMode,
        entry: './wp-content/themes/<%= name %>/src/js/main.js',
        output: {
            path: path.resolve(__dirname, 'wp-content/themes/<%= name %>/js'),
            filename: '[name].js',
            // Public path is important for dynamic imports. It'll help webpack to retrieve bundles by name and not by ids
            publicPath: '/wp-content/themes/<%= name %>/js/',
            sourceMapFilename: '[file].map?[contenthash]',
            chunkFilename: '[name].js'
        },
        watch: devMode,
        devtool: devMode ? 'source-map' : '',
        module: {
            rules: [
                ...rules,
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: devMode
                            }
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: devMode
                            }
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

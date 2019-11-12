module.exports = ({ file, env, map }) => ({
    parser: file.extname === '.sss' ? 'sugarss' : false, // Handles `.css` && '.sss' files dynamically
    map: env === 'development' ? map : false,
    plugins: {
        'postcss-preset-env': {},
        'postcss-import': {},
        'postcss-nested': {},
        cssnano: env === 'production' ? {} : false
    }
});

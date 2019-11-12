module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                include: ['@babel/plugin-transform-spread']
            }
        ]
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-transform-spread']
};

module.exports = {
    plugins: [
        require('postcss-cssnext')({
            warnForDuplicates: false,
            features: {
                rem: {
                    html: false
                }
            }
        }),
        require('postcss-fixes')({ preset: 'safe' }),
        require('doiuse')({
            ignore: [
                'rem',
                'viewport-units'
            ]
        })
    ]
};


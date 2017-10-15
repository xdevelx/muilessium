module.exports = {
    docs: {
        bsFiles: {
            src : [
                'docs/*.html',
                'docs/assets/css/*.css',
                'docs/assets/js/*.js',
            ]
        },
        options: {
            watchTask: true,
            server: './docs'
        }
    }
};


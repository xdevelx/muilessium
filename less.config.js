module.exports = {
    dist: {
        options: {
            plugins: [
                new (require('less-plugin-autoprefix'))({
                    browsers: require('./browsers.config.js')
                })
            ]
        },
        files: {
            'dist/css/muilessium.css': 'src/less/main.less'
        }
    },
    docs: {
        options: {
            plugins: [
                new (require('less-plugin-autoprefix'))({
                    browsers: require('./browsers.config.js')
                })
            ]
        },
        files: {
            'docs/assets/css/docs-styles.css': 'src/docs_template/assets/less/docs-styles.less'
        }
    }
};


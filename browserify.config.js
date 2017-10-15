module.exports = {
    dist: {
        options: {
            transform: [
                [
                    'babelify', {
                        presets: [
                            ['env', {
                                'targets': {
                                    'browsers': require('./browsers.config.js')
                                }
                            }]
                        ]
                    }
                ]
            ]
        },
        files: {
            'dist/js/muilessium.js': ['src/js/main.js']
        }
    }
};


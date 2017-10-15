module.exports = {
    src: [
        'src/less/main.less'
    ],
    options: {
        imports: ['src/less/*.less', 'src/less/*/*.less'],
        failOnWarning: false,
        csslint: {
            csslintrc: '.csslintrc'
        }
    }
};


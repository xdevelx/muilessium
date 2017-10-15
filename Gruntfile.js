'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        lesslint:    require('./lesslint.config.js'),
        less:        require('./less.config.js'),
        cssmin:      require('./cssmin.config.js'),
        browserify:  require('./browserify.config.js'),
        uglify:      require('./uglify.config.js'),
        dss:         require('./dss.config.js'),
        docco:       require('./docco.config.js'),
        realFavicon: require('./favicon.config.js'),
        browserSync: require('./browsersync.config.js'),
        
        copy: {
            docs: {
                files: [
                    { expand: true, cwd: 'src', src: ['favicon.ico'], dest: 'docs/', filter: 'isFile' },

                    { expand: true, cwd: 'dist/js',  src: ['muilessium.min.js'],  dest: 'docs/assets/js',  filter: 'isFile' },
                    { expand: true, cwd: 'dist/css', src: ['muilessium.min.css'], dest: 'docs/assets/css', filter: 'isFile' }
                ]
            }
        },

        watch: {
            html: {
                files: ['src/docs_template/index.handlebars'],
                tasks: ['dss']
            },
            less: {
                files: ['src/less/*.less', 'src/less/*/*.less', 'src/docs_template/assets/less/docs-styles.less'],
                tasks: ['less', 'cssmin', 'dss', 'copy']
            },
            js: {
                files: ['src/js/*.js', 'src/js/*/*.js'],
                tasks: ['browserify', 'uglify', 'dss', 'docco', 'copy']
            },
            jst: {
                files: ['src/docs_template/docco.jst'],
                tasks: ['docco']
            }
        },
        
        
        clean: {
            // Delete all generated files
            build: { src: ['dist', 'docs']},
            // Delete unnecessary auto-generated files from docs
            docs:  { src: ['docs/assets/less', 'docs/*.jst', 'docs/utils/muilessium.css'] }
        }
    });
    
    grunt.registerTask('default', [
        'lesslint',
        'less',
        'cssmin',
        'browserify',
        'uglify',
        'dss',
        'docco',
        'copy',
        'realFavicon',
        'clean:docs'
    ]);

    grunt.registerTask('server',  ['default', 'browserSync', 'watch']);
    grunt.registerTask('rebuild', ['clean:build', 'default']);
    grunt.registerTask('test',    ['lesslint']);
};


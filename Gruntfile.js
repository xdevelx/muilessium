'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['*'],
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        
        less: {
            dist: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ]
                },
                files: {
                    'dist/css/main.css': 'src/less/main.less'
                }
            }
        },
        
        cssmin: {
            dist: {
                files: {
                    'dist/css/main.min.css': ['dist/css/main.css']
                }
            }
        },
        
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/js/main.js',
            },
        },
        
        uglify: {
            dist: {
                files: {
                    'dist/js/main.min.js': [
                        'dist/js/main.js'
                    ]
                }
            }
        },
        
        watch: {
            html: {
                files: ['src/index.html'],
                tasks: ['copy']
            },
            less: {
                files: [
                    'src/less/*.less',
                    'src/less/*/*.less'
                ],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
        
        browserSync: {
            dist: {
                bsFiles: {
                    src : [
                        'dist/*.html',
                        'dist/css/*.css',
                        'dist/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist'
                }
            }
        },
        
        clean: {
            build: {
                src: [
                    'dist'
                ]
            }
        }
    });
    
    grunt.registerTask('default', ['copy', 'less', 'cssmin', 'concat', 'uglify']);
    grunt.registerTask('server',  ['copy', 'less', 'cssmin', 'concat', 'uglify', 'browserSync', 'watch']);
    grunt.registerTask('rebuild', ['clean', 'default']);
};
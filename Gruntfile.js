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
            },
            preview: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ]
                },
                files: {
                    'dist/css/preview.css': 'src/less/preview.less'
                }
            }
        },
        
        cssmin: {
            dist: {
                files: {
                    'dist/css/main.min.css': ['dist/css/main.css']
                }
            },
            preview: {
                files: {
                    'dist/css/preview.min.css': ['dist/css/preview.css']
                }
            }
        },
        
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/js/utils.js',
                    'src/js/*/*.js',
                    'src/js/muilessium.js'
                ],
                dest: 'dist/js/main.js',
            },
        },

        browserify: {
            dist: {
                options: {
                    transform: [
                        [
                            'babelify', {
                                presets: ['es2015']
                            }
                        ]
                    ]
                },
                files: {
                    'dist/js/main.js': ['src/js/main.js']
                }
            }
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
                files: ['src/js/*.js', 'src/js/*/*.js'],
                tasks: ['browserify', 'uglify']
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
        
        dss: {
            docs: {
                files: {
                    'docs/': 'src/less/**/*.less'
                },
                options: {
                    template: 'src/docs_template/',
                    parsers: {
                        link: function(i, line, block){
                            var exp = new RegExp('(b(https?|ftp|file)://[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])', 'ig');
                            line.replace(exp, '<a href="$1">$1</a>');
                            return line;
                        }
                    }
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
    
    grunt.registerTask('default', ['copy', 'less', 'cssmin', 'browserify', 'uglify']);
    grunt.registerTask('server',  ['copy', 'less', 'cssmin', 'browserify', 'uglify', 'browserSync', 'watch']);
    grunt.registerTask('rebuild', ['clean', 'default']);
    grunt.registerTask('docs',    ['dss']);
};
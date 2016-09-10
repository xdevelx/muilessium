'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        copy: {
            docs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['*'],
                        dest: 'docs/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'dist/js',
                        src: ['*.js'],
                        dest: 'docs/assets/js',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'dist/css',
                        src: ['*.css'],
                        dest: 'docs/assets/css',
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
                files: ['src/docs_template/index.handlebars'],
                tasks: ['dss']
            },
            css: {
                files: ['src/docs_template/assets/css/*.css'],
                tasks: ['dss']
            },
            less: {
                files: [
                    'src/less/*.less',
                    'src/less/*/*.less'
                ],
                tasks: ['less', 'cssmin', 'dss', 'copy']
            },
            js: {
                files: ['src/js/*.js', 'src/js/*/*.js'],
                tasks: ['browserify', 'uglify', 'dss', 'copy']
            }
        },
        
        browserSync: {
            docs: {
                bsFiles: {
                    src : [
                        'docs/*.html',
                        'docs/assets/css/*.css',
                        'dist/css/*.css',
                        'dist/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './docs'
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
                    'dist',
                    'docs'
                ]
            }
        }
    });
    
    grunt.registerTask('default', ['less', 'cssmin', 'browserify', 'uglify', 'dss', 'copy']);
    grunt.registerTask('server',  ['default', 'browserSync', 'watch']);
    grunt.registerTask('rebuild', ['clean', 'default']);
    grunt.registerTask('docs',    ['dss']);
};
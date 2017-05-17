'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            docs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['favicon.ico'],
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

        lesslint: {
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
        },
        
        less: {
            dist: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ]
                },
                files: {
                    'dist/css/muilessium.css': 'src/less/main.less'
                }
            },
            docs: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ]
                },
                files: {
                    'docs/assets/css/docs-styles.css': 'src/docs_template/assets/less/docs-styles.less'
                }
            }
        },
        
        cssmin: {
            dist: {
                files: {
                    'dist/css/muilessium-<%= pkg.version %>.min.css': ['dist/css/muilessium.css']
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
                    'dist/js/muilessium.js': ['src/js/main.js']
                }
            }
        },
        
        uglify: {
            dist: {
                files: {
                    'dist/js/muilessium-<%= pkg.version %>.min.js': [
                        'dist/js/muilessium.js'
                    ]
                }
            }
        },
        
        watch: {
            html: {
                files: ['src/docs_template/*.handlebars', 'src/docs_template/*.html'],
                tasks: ['dss']
            },
            css: {
                files: ['src/docs_template/assets/css/*.css'],
                tasks: ['dss']
            },
            less: {
                files: [
                    'src/less/*.less',
                    'src/less/*/*.less',
                    'src/docs_template/assets/less/*.less'
                ],
                tasks: ['less', 'cssmin', 'dss', 'copy']
            },
            js: {
                files: ['src/js/*.js', 'src/js/*/*.js'],
                tasks: ['browserify', 'uglify', 'dss', 'docco', 'copy']
            },
            jst: {
                files: ['src/docs_template/*.jst'],
                tasks: ['docco']
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
                    'docs/': 'src/less/components/*.less'
                },
                options: {
                    template: 'src/docs_template/',
                    parsers: {
                        link: function(i, line, block){
                            var exp = new RegExp('(b(https?|ftp|file)://[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])', 'ig');
                            line.replace(exp, '<a href="$1">$1</a>');
                            return line;
                        },
                        lvar: function(i, line, block) {
                            var lvar = line.split(' - ');

                            return {
                                name:        lvar[0] ? lvar[0] : '',
                                defaults:    lvar[1] ? lvar[1] : '',
                                description: lvar[2] ? lvar[2] : ''
                            };
                        },
                        see: function(i, line, block) {
                            return line;
                        },
                        depends: function(i, line, block) {
                            return {
                                depends: line
                            };
                        },
                        requires: function(i, line, block) {
                            return {
                                requires: line
                            };
                        },
                        method: function(i, line, block) {
                            var method = line.split(' - ');

                            return {
                                name:        method[0] ? method[0] : '',
                                description: method[1] ? method[1] : ''
                            };
                        }
                    }
                }
            }
        },

        docco: {
            utils: {
                src: ['src/js/utils/*.js'],
                options: {
                    template: 'src/docs_template/docco.jst',
                    css: 'dist/css/muilessium.css',
                    output: 'docs/docco/utils/'
                }
            }
        },


        realFavicon: {
            favicons: {
                src: 'src/docs_template/images/muilessium.png',
                dest: 'docs/icons/',
                options: {
                    iconsPath: 'icons/',
                    html: ['docs/*.html'],
                    design: {
                        ios: {
                            pictureAspect: 'backgroundAndMargin',
                            backgroundColor: '#ffffff',
                            margin: '11%',
                            assets: {
                                ios6AndPriorIcons: false,
                                ios7AndLaterIcons: false,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            },
                            appName: 'Muilessium'
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'noChange',
                            backgroundColor: '#383838',
                            onConflict: 'override',
                            assets: {
                                windows80Ie10Tile: false,
                                windows10Ie11EdgeTiles: {
                                small: true,
                                medium: false,
                                big: false,
                                rectangle: false
                                }
                            },
                            appName: 'Muilessium'
                        },
                        androidChrome: {
                            pictureAspect: 'shadow',
                            themeColor: '#ffffff',
                            manifest: {
                                name: 'Muilessium',
                                display: 'standalone',
                                orientation: 'notSet',
                                onConflict: 'override',
                                declared: true
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: false
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: 'blackAndWhite',
                            threshold: 90,
                            themeColor: '#383838'
                        }
                    },
                    settings: {
                        compression: 1,
                        scalingAlgorithm: 'Lanczos',
                        errorOnImageTooSmall: false
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
            },
            docs: {
                src: [
                    'docs/assets/less',
                    'docs/*.jst',
                    'docs/docs/muilessium.css'
                ]
            }
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

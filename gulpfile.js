var gulp         = require('gulp'),
    argv         = require('yargs').argv,
    rename       = require('gulp-rename'),
    less         = require('gulp-less'),
    postcss      = require('gulp-postcss'),
    cssnano      = require('gulp-cssnano'),
    webpack      = require('webpack-stream'),
    browserSync  = require('browser-sync').create(),
    dss          = require('gulp-dss');


const ENVIRONMENT = argv.production ? 'production' : 'development';


require('gulp-grunt')(gulp);


gulp.task('less', () => {
    return gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(postcss())
        .pipe(cssnano({ discardComments: { removeAll: true }}))
        .pipe(rename('muilessium.min.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});


gulp.task('js', () => {
    return gulp.src('./src/js/main.js')
        .pipe(webpack(require('./webpack.config.js')[ENVIRONMENT]))
        .pipe(rename('muilessium.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});


gulp.task('dss-sync', () => {
    return gulp.src('./dist/index.html')
        .pipe(browserSync.stream());
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch([
        './src/less/*.less',
        './src/less/components/*.less'
    ], ['less']);

    gulp.watch([
        './src/js/*.js',
        './src/js/*/*.js'
    ], ['js']);

    gulp.watch([
        './src/dss/*.handlebars'
    ], ['grunt-dss']);

    gulp.watch([
        './dist/index.html'
    ], ['dss-sync']);
});

gulp.task('default', ['less', 'js', 'grunt-dss']);
gulp.task('server', ['default', 'browser-sync']);


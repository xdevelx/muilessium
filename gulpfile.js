var gulp         = require('gulp'),
    argv         = require('yargs').argv,
    rename       = require('gulp-rename'),
    less         = require('gulp-less'),
    postcss      = require('gulp-postcss'),
    cssnano      = require('gulp-cssnano'),
    webpack      = require('webpack-stream'),
    browserSync  = require('browser-sync').create();


const ENVIRONMENT = argv.production ? 'production' : 'development';


gulp.task('less', function() {
    return gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(postcss())
        .pipe(cssnano({ discardComments: { removeAll: true }}))
        .pipe(rename('muilessium.min.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});


gulp.task('js', function() {
    return gulp.src('./src/js/main.js')
        .pipe(webpack(require('./webpack.config.js')[ENVIRONMENT]))
        .pipe(rename('muilessium.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});


gulp.task('default', ['less', 'js']);

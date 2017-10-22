var gulp         = require('gulp'),
    run          = require('run-sequence'),
    argv         = require('yargs').argv,
    rename       = require('gulp-rename'),
    less         = require('gulp-less'),
    postcss      = require('gulp-postcss'),
    cssnano      = require('gulp-cssnano'),
    webpack      = require('webpack-stream'),
    browserSync  = require('browser-sync').create(),
    dss          = require('gulp-dss'),
    nodeunit     = require('gulp-nodeunit');


const ENVIRONMENT = argv.production ? 'production' : 'development';


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


gulp.task('dss', () => {
    return gulp.src('./src/less/components/*.less')
        .pipe(dss(require('./dss.config.js')))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});


gulp.task('test', () => {
    return gulp.src('./test/*.js')
        .pipe(nodeunit());
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
    ], ['less', 'dss']);

    gulp.watch([
        './src/js/*.js',
        './src/js/*/*.js'
    ], ['js']);

    gulp.watch([
        './src/dss/index.handlebars'
    ], ['dss']);
});


if (ENVIRONMENT === 'production') {
    gulp.task('default', () => {
        run('less', 'test', 'js', 'dss');
    });
} else {
    gulp.task('default', () => {
        run('less', 'js', 'dss');
    });
}

gulp.task('server', ['browser-sync']);


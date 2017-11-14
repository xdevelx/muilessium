var gulp         = require('gulp'),
    fs           = require('fs'),
    packageInfo  = JSON.parse(fs.readFileSync('./package.json')),
    gulpif       = require('gulp-if'),
    size         = require('gulp-size'),
    run          = require('run-sequence'),
    argv         = require('yargs').argv,
    rename       = require('gulp-rename'),
    sourcemaps   = require('gulp-sourcemaps'),
    less         = require('gulp-less'),
    postcss      = require('gulp-postcss'),
    doiuse       = require('doiuse'),
    cssnano      = require('gulp-cssnano'),
    webpack      = require('webpack-stream'),
    browserSync  = require('browser-sync').create(),
    dss          = require('gulp-dss'),
    nodeunit     = require('gulp-nodeunit');


const ENVIRONMENT = argv.production ? 'production' : 'development';

console.log('\x1b[33m%s %s\x1b[0m\n  ⇒ %s', ' ',
    ENVIRONMENT.toUpperCase(),
    packageInfo.name + ' v' + packageInfo.version);
console.log('\x1b[36m%s %s\x1b[0m\n  ⇒ %s', ' ',
    'Browsers:',
    packageInfo.browserslist);



gulp.task('less', () => {
    return gulp.src('./src/less/main.less')
        .pipe(gulpif(ENVIRONMENT === 'development', sourcemaps.init()))
        .pipe(less())
        .pipe(postcss())
        .pipe(cssnano({ discardComments: { removeAll: true }}))
        .pipe(gulpif(ENVIRONMENT === 'development', sourcemaps.write()))
        .pipe(postcss([doiuse(require('./doiuse.config.js'))]))
        .pipe(rename('muilessium.min.css'))
        .pipe(size({ showFiles: true }))
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
    return gulp.src('./test/utils/*.js')
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


gulp.task('default', () => {
    if (ENVIRONMENT === 'production') {
        run('less', 'test', 'js', 'dss');
    } else {
        run('less', 'js', 'dss');
    }
});


gulp.task('server', () => {
    run('default', 'browser-sync');
});


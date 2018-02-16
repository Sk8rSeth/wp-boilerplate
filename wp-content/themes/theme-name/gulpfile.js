// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// Paths for SASS imports
var sassIncludePaths = [
    './assets/bower_components/foundation/scss/',
    './assets/bower_components/bourbon/app/assets/stylesheets/'
];

// Paths for task files
var paths = {
    scss: 'assets/src/scss/**/*.scss',
    js: {
        lint: [
            'assets/src/js/**/*.js'
        ],
        concat: [
            'assets/bower_components/jquery/dist/jquery.min.js',
            // add new plugins here
            'assets/src/js/**/*.js'
        ]
    },
    sync: [
        'assets/css/**/*.css',
        'assets/js/app.js',
        '**/*.php'
    ]
}

var handleError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);
    this.emit('end');
}

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.js.lint)
        .pipe(plumber({errorHandler: handleError}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('css', function() {
    return gulp.src(paths.scss)
        .pipe(plumber({errorHandler: handleError}))
        // .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: sassIncludePaths
        }))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'))
        .pipe(notify('CSS Saved'))
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(cleanCSS({compatibility: 'ie9'}))
        .pipe(gulp.dest('assets/css'))
        .pipe(notify('CSS Minified'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src(paths.js.concat)
        .pipe(plumber({errorHandler: handleError}))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/js'))
        .pipe(notify('JS Saved'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(notify('JS Minified'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.js.lint, ['lint', 'js']);
    gulp.watch(paths.scss, ['css']);
});

// Default Task
gulp.task('default', ['lint', 'css', 'js', 'watch']);
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

const size = require('gulp-size');
var gulpif = require('gulp-if');
var cache = require('gulp-cache');
var del = require('del');

//SASS
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

//IMAGES
var smushit = require('gulp-smushit');
var tinypng = require('gulp-tinypng');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminOptipng = require('imagemin-optipng');
var imagemin = require('gulp-imagemin');

//JS
var concat = require('gulp-concat');
var jqc = require('gulp-jquery-closure');

//CSS:
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var spriter = require('gulp-css-spriter');
var csso = require('gulp-csso');
var uncss = require('gulp-uncss');
var concatCss = require('gulp-concat-css');
var embed = require('gulp-image-embed');
var inlineimg = require('gulp-inline-images');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

gulp.task('default', function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/*.js', ['useref']);
    gulp.watch('app/css/*.css', ['useref']);
    gulp.watch('app/index.html', ['useref']);
    gulp.watch('app/images/**/*.+(png|jpg|gif|svg)', ['images']);
    gulp.watch('app/font/**/*', ['fonts']);

});


//CONCAT-JS
gulp.task('concat-js', function() {
    //gulp.src('app/js/**/*.js')
    return gulp.src(['app/js/vendor/jquery.min.js', 'app/js/vendor/bootstrap.min.js', 'app/js/vendor/ekko-lightbox.min.js', 'app/js/bootstrap-select.min.js', 'app/js/timepicker.min.js', 'app/js/application.js'])
        .pipe(concat('all.js'))
        .pipe(jqc({ $: false, window: true, document: true, undefined: true }))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

// <!-- build:js js/main.min.js -->
gulp.task('jsbuild', function() {
    var options = { searchPath: ['.tmp', 'app/'] };

    var assets = useref(options);
    return gulp.src('app/index.html')
        .pipe(assets)
        //.pipe(gulpif('*.js', uglify({preserveComments: 'some'})))
        .pipe(gulp.dest('dist/'))
        .pipe(size({ title: 'html' }));
});


//SPRITES
gulp.task('sprite', function() {
    return gulp.src('app/css/style.css')
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet 
            'spriteSheet': 'dist/spritesheet.png',
            // Because we don't know where you will end up saving the CSS file at this point in the pipe, 
            // we need a litle help identifying where it will be. 
            'pathToSpriteSheetFromCSS': 'spritesheet.png'
        }))
        .pipe(gulp.dest('./dist/css'));
});


//DATA URI CSS
gulp.task('embed-css', function() {
    return gulp.src('app/css/style.css')
        .pipe(embed({
            asset: 'static'
        }))
        .pipe(gulp.dest('dist/'));
});


//DATA URI HTML
gulp.task('embed-html', function() {
    return gulp.src('app/index.html')
        .pipe(inlineimg('app/portfolio'))
        .pipe(gulp.dest('dist/'));
});


//cssnano & csso
gulp.task('cssnano', function() {
    //return gulp.src('app/css/*.css')
    return gulp.src('app/css/style.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/'));
});


gulp.task('concat-css', function() {
    return gulp.src('app/css/**/*.css')
        .pipe(concatCss("css/bundle.css"))
        .pipe(gulp.dest('dist/'));
});


gulp.task('uncss', function() {
    return gulp.src('app/css/*.css')
        .pipe(uncss({
            html: ['app/index.html']

        }))
        .pipe(gulp.dest('dist/css/'));
});


gulp.task('autoprefixer', function() {
    return gulp.src('app/css/style.css')
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('dist/css'));
});


gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'));
});


gulp.task('useref', function() {
    return gulp.src('app/**/*')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', postcss([autoprefixer()])))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});


gulp.task('images', function() {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(gulpif('*.jpg', imagemin({ optimizationLevel: 7, use: [imageminJpegtran()] })))
        .pipe(gulpif('*.png', imagemin({ optimizationLevel: 7, use: [imageminOptipng()] })))
        .pipe(gulp.dest('dist/images'));
});


gulp.task('smushit', function() {
    return gulp.src('app/images/*.+(png|jpg|gif|svg)')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'));
});


gulp.task('tinypng', function() {
    gulp.src('app/portfolio/**/*.+(png|jpg|svg)')
        .pipe(tinypng(''))
        .pipe(gulp.dest('dist/portfolio'));
});

gulp.task('fonts', function() {
    return gulp.src('app/font/**/*')
        .pipe(gulp.dest('dist/font'))
});


gulp.task('clean:dist', function() {
    return del.sync('dist');
});


gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback)
});


gulp.task('hello', function() {
    console.log('Hello Zell');
});
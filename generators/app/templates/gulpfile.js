var gulp = require('gulp');
var del = require('del');
var path = require('path');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var htmlmin = require('gulp-htmlmin');

var report_error = function(error) {
    $.notify({
        title: 'An error occured with a Gulp task',
        message: 'Check you terminal for more informations'
    }).write(error);

    console.log(error.toString());
    this.emit('end');
};

gulp.task('styles', function () {
    return gulp.src('<%= folders.src %>/scss/main.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 6, outputStyle: 'compressed', sourceComments: false, indentWidth: 4,
        }))
        .on('error', report_error)
        .pipe($.autoprefixer({
            browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
            ]
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('<%= folders.dest %>/css'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('fonts', function() {
    return gulp.src('<%= folders.src %>/fonts/**/*')
        .pipe(gulp.dest('<%= folders.dest %>/fonts'))
        .pipe($.size({ title: 'fonts' }));
});

gulp.task('img', function() {
    return gulp.src('<%= folders.src %>/img/**/*')
        .pipe(gulp.dest('<%= folders.dest %>/img'))
        .pipe($.size({ title: 'img' }));
});

gulp.task('layoutImg', function() {
    return gulp.src('<%= folders.src %>/layoutImg/**/*')
        .pipe(gulp.dest('<%= folders.dest %>/layoutImg'))
        .pipe($.size({ title: 'layoutImg' }));
});

gulp.task('js', function () {
    return browserify('<%= folders.src %>/js/main.js').bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('<%= folders.dest %>/js'));
});

<% if (config.wordpress) { %>
gulp.task('theme', function() {
    return gulp.src('<%= folders.src %>/theme/**/*')
        // .pipe($.prettify({ indent_size: 4 }))
        .pipe(gulp.dest('<%= folders.dest %>'))
        .pipe($.size({title: 'theme'}));
});
<% } else { %>
gulp.task('templates', function() {
    <% if (config.twig) { %>
        return gulp.src('<%= folders.src %>/templates/*.html.twig')
            .pipe($.twig())
            .pipe($.extReplace('.html', '.html.html'))
    <% } else { %>
        return gulp.src('<%= folders.src %>/templates/*.html')
    <% } %>
        // .pipe($.prettify({ indent_size: 4 }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('<%= folders.dest %>'))
        .pipe($.size({title: 'template'}));
});
<% } %>


gulp.task('watch', function () {
    <% if (config.wordpress) { %>
    browserSync({
        notify: false,
        proxy: 'localhost'
    });
    <% } else { %>
    browserSync({
        notify: false,
        server: ['dest']
    });
    <% } %>

    watch('src/scss/**/*', function(){
        gulp.start(['styles'], reload);
    });
    <% if (config.wordpress) { %>
    watch('src/theme/**/*', function(){
        gulp.start(['theme'], reload);
    });
    <% } else { %>
    watch('src/templates/**/*', function(){
        gulp.start(['templates'], reload);
    });
    <% } %>
    watch('src/fonts/**/*', function(){
        gulp.start(['fonts'], reload);
    });
    watch('src/img/**/*', function(){
        gulp.start(['img'], reload);
    });
    watch('src/layoutImg/**/*', function(){
        gulp.start(['layoutImg'], reload);
    });
    watch('src/js/**/*', function(){
        gulp.start(['js'], reload);
    });
    <% if (!config.wordpress) { %>
    var fileWatcher = watch('src/**/*').on('unlink', function(currentPath){
        var filePathFromSrc = path.relative(path.resolve('src'), currentPath);
        var destFilePath = path.resolve('dest', filePathFromSrc).replace('templates/', '');
        del.sync(destFilePath);
        console.log('File removed - ' + destFilePath);
    });
    <% } %>
});

<% if (config.wordpress) { %>
gulp.task('start', ['styles', 'theme', 'fonts', 'img', 'layoutImg', 'js']);
<% } else { %>
gulp.task('start', ['styles', 'templates', 'fonts', 'img', 'layoutImg', 'js']);
<% } %>

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sitemap = require('gulp-sitemap');
var shell = require('gulp-shell');

var WP = require('wp-cli');

var reportError = function(error) {
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
        .on('error', reportError)
        .pipe($.autoprefixer({
            browsers: [
            'ie >= 11',
            'ie_mob >= 11',
            'ff >= 40',
            'chrome >= 50',
            'safari >= 9',
            'opera >= 23',
            'ios >= 9',
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
    return browserify({
            entries: '<%= folders.src %>/js/main.js', debug: true
        })
        .transform(babelify.configure({
            presets: ['es2015']
        }))
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('<%= folders.dest %>/js'))
        .pipe($.size({ title: 'js' }));
});

<% if (config.wordpress) { %>
gulp.task('theme', function() {
    return gulp.src('<%= folders.src %>/theme/**/*')
        .pipe(gulp.dest('<%= folders.dest %>'))
        .pipe(shell(['mkdir -p <%= folders.dest %>/acf-json']))
        .pipe(shell(['mkdir -p <%= folders.dest %>/../../plugins']))
        .pipe(shell(['mkdir -p <%= folders.dest %>/../../uploads']))
        .pipe($.size({title: 'theme'}));
});
gulp.task('wp', function() {
    WP.discover({path: '<%= folders.dest_root %>'}, function( WP ){
        WP.plugin.delete('hello', function( err, results ){
            console.log(err + results);
        });
        WP.plugin.delete('askimet', function( err, results ){
            console.log(err + results);
        });
        WP.theme.activate('<%= config.name %>', function( err, results ){
            console.log(err + results);

            WP.theme.delete('twentyfifteen', function( err, results ){
                console.log(err + results);
            });
            WP.theme.delete('twentyseventeen', function( err, results ){
                console.log(err + results);
            });
            WP.theme.delete('twentysixteen', function( err, results ){
                console.log(err + results);
            });
        });
    });
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
        .pipe($.prettify({ indent_size: 4 }))
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('<%= folders.dest %>'))
        .pipe($.size({title: 'template'}));
});
<% } %>

gulp.task('sitemap', function () {
    gulp.src('<%= folders.dest %>/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: '<%= config.url %>'
        }))
        .pipe(gulp.dest('<%= folders.dest %>'));
});

gulp.task('root', function() {
    return gulp.src('src/*.*')
        .pipe(gulp.dest('dest'))
        .pipe($.size({title: 'root'}));
});

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

    $.watch('src/scss/**/*', function(){
        gulp.start(['styles'], reload);
    });
    <% if (config.wordpress) { %>
    $.watch('src/theme/**/*', function(){
        gulp.start(['theme'], reload);
    });
    <% } else { %>
    $.watch('src/templates/**/*', function(){
        gulp.start(['templates'], reload);
    });
    <% } %>
    $.watch('src/fonts/**/*', function(){
        gulp.start(['fonts'], reload);
    });
    $.watch('src/img/**/*', function(){
        gulp.start(['img'], reload);
    });
    $.watch('src/layoutImg/**/*', function(){
        gulp.start(['layoutImg'], reload);
    });
    $.watch('src/js/**/*', function(){
        gulp.start(['js'], reload);
    });
    <% if (!config.wordpress) { %>
    var fileWatcher = $.watch('src/**/*').on('unlink', function(currentPath){
        var filePathFromSrc = path.relative(path.resolve('src'), currentPath);
        var destFilePath = path.resolve('dest', filePathFromSrc).replace('templates/', '');
        del.sync(destFilePath);
        console.log('File removed - ' + destFilePath);
    });
    <% } %>
    $.watch('src/*.*', function(){
        gulp.start(['root'], reload);
    });
});

<% if (config.wordpress) { %>
gulp.task('start', ['styles', 'theme', 'fonts', 'img', 'layoutImg', 'js', 'root', 'sitemap', 'wp']);
<% } else { %>
gulp.task('start', ['styles', 'templates', 'fonts', 'img', 'layoutImg', 'js', 'root', 'sitemap']);
<% } %>

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sitemap = require('gulp-sitemap');

<% if (config.wordpress) { %>
const WP = require('wp-cli');
const shell = require('gulp-shell');
<% } else { %>
const del = require('del');
const path = require('path');
<% } %>


const reportError = function( error ){
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
gulp.task('htaccess', function() {
    return gulp.src('src/.htaccess')
        .pipe(gulp.dest('dest'))
        .pipe($.size({title: 'root'}));
});
<% } %>

gulp.task('sitemap', function () {
    return gulp.src('<%= folders.dest %>/**/*.html', {
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

    $.watch('src/theme/**/*', function(){
        gulp.start(['theme'], reload);
    });
    <% } else { %>
    browserSync({
        notify: false,
        server: ['dest']
    });

    $.watch('src/templates/**/*', function(){
        gulp.start(['templates'], reload);
    });
    $.watch('src/.htaccess', function(){
        gulp.start(['htaccess'], reload);
    });
    $.watch('src/**/*').on('unlink', function(currentPath){
        const filePathFromSrc = path.relative(path.resolve('src'), currentPath);
        const destFilePath = path.resolve('dest', filePathFromSrc).replace('templates/', '');
        del.sync(destFilePath);
        console.log('File removed - ' + destFilePath);
    });
    <% } %>
    $.watch('src/scss/**/*', function(){
        gulp.start(['styles'], reload);
    });
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
    $.watch('src/*.*', function(){
        gulp.start(['root'], reload);
    });
});

<% if (config.wordpress) { %>
gulp.task('start', ['styles', 'theme', 'fonts', 'img', 'layoutImg', 'js', 'root', 'sitemap', 'wp']);
<% } else { %>
gulp.task('start', ['styles', 'templates', 'fonts', 'img', 'layoutImg', 'js', 'root', 'htaccess', 'sitemap']);
<% } %>

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

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
   .pipe(gulp.dest('<%= folders.dest %>'))
   .pipe($.size({title: 'styles'}));
});

gulp.task('bower', function() {
 return gulp.src('<%= folders.src %>/bower_components/**/*')
   .pipe(gulp.dest('<%= folders.dest %>/bower_components'))
   .pipe($.size({ title: 'bower_components' }));
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

//gulp.task('js', function() {
//  return gulp.src('<%= folders.src %>/js/**/*')
//    .pipe(gulp.dest('<%= folders.dest %>/js'))
//    .pipe($.size({ title: 'js' }));
// });

gulp.task('js', function () {
   return browserify('<%= folders.src %>/js/main.js').bundle()
       .pipe(source('main.js'))
       .pipe(buffer())
       .pipe(uglify())
       .pipe(gulp.dest('<%= folders.dest %>/js'));
});

gulp.task('templates', function() {
 <% if (config.twig) { %>
   return gulp.src('<%= folders.src %>/templates/*.html.twig')
       .pipe($.twig())
       .pipe($.extReplace('.html', '.html.html'))
 <% } else { %>
   return gulp.src('<%= folders.src %>/templates/*.html')
 <% } %>
   .pipe($.prettify({ indent_size: 4 }))
   .pipe(gulp.dest('<%= folders.dest %>'))
   .pipe($.size({title: 'template'}));
});

gulp.task('watch', /*['default'],*/ function() {
 browserSync({
     notify: false,
     server: ['<%= folders.dest %>']
 });

   gulp.watch('<%= folders.src %>/scss/**/*.{scss, css}', ['styles', reload]);
   gulp.watch('<%= folders.src %>/templates/**/*', ['templates', reload]);
   gulp.watch('<%= folders.src %>/fonts/**/*', ['fonts', reload]);
   gulp.watch('<%= folders.src %>/img/**/*', ['img', reload]);
   gulp.watch('<%= folders.src %>/layoutImg/**/*', ['layoutImg', reload]);
   gulp.watch('<%= folders.src %>/js/**/*', ['js', reload]);
   gulp.watch('<%= folders.src %>/bower_components/**/*', ['bower', reload]);
});

//gulp.task('default', ['styles', 'templates', 'fonts', 'img', 'layoutImg', 'js', 'bower']);
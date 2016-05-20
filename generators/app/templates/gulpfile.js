var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

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
       precision: 6,
       outputStyle: 'expanded',
       sourceComments: true,
       indentWidth: 4,
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

gulp.task('watch', ['default'], function() {
 browserSync({
     notify: false,
     server: ['<%= folders.dest %>']
 });

   gulp.watch('<%= folders.src %>/scss/**/*.{scss, css}', ['styles', reload]);
   gulp.watch('<%= folders.src %>/templates/**/*', ['templates', reload]);
   gulp.watch('<%= folders.src %>/fonts/**/*', ['fonts', reload]);
   gulp.watch('<%= folders.src %>/img/**/*', ['img', reload]);
   gulp.watch('<%= folders.src %>/layoutImg/**/*', ['layoutImg', reload]);
   gulp.watch('<%= folders.src %>/bower_components/**/*', ['bower', reload]);
});

gulp.task('default', ['styles', 'templates', 'fonts', 'img', 'layoutImg', 'bower']);
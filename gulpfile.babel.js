'use strict';
import path from 'path';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import excludeGitignore from 'gulp-exclude-gitignore';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import plumber from 'gulp-plumber';
import coveralls from 'gulp-coveralls';

gulp.task('static', () =>
    gulp
        .src('**/*.js')
        .pipe(excludeGitignore())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('pre-test', () =>
    gulp
        .src('generators/**/*.js')
        .pipe(excludeGitignore())
        .pipe(
            istanbul({
                includeUntested: true
            })
        )
        .pipe(istanbul.hookRequire())
);

gulp.task('test', ['pre-test'], cb => {
    let mochaErr = null;

    gulp.src('test/**/*.js')
        .pipe(plumber())
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', err => {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', () => {
            cb(mochaErr);
        });
});

gulp.task('watch', () => {
    gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', ['test'], () => {
    if (!process.env.CI) {
        return;
    }

    return gulp.src(path.join(__dirname, 'coverage/lcov.info')).pipe(coveralls());
});

gulp.task('default', ['static', 'test', 'coveralls']);

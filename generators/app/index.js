/* jshint -W097, -W117 */
'use strict';
var yeoman = require('yeoman-generator');
// to log a coloured message with Yeoman
var chalk = require('chalk');
// for injecting Bower components to HTML/SCSS files
var wiredep = require('wiredep');
// tell Yeoman what to say in the console
var yosay = require('yosay');
// To create folder
var mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({
    initializing: function() {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the laudable ' + chalk.blue('stereosuper') + ' generator!'));
        this.config = {};
        this.folder = {
            src: 'src',
            dest: 'dest'
        };
        this.folderWp = {
            src: 'src',
            dest: 'dest/wp-content/themes/super'
        };
    },

    prompting: function(){
        var done = this.async();
        this.prompt([{
            type: 'input',
            name: 'name',
            message: 'What is you\'re project name? (without specials characters)',
            default: 'test',
            required: true
        }, {
            type: 'confirm',
            name: 'greensock',
            message: 'Would you like to install Greensock?',
            default: true,
            required: true
        }, {
            type: 'confirm',
            name: 'wordpress',
            message: 'Is it a Wordpress Project?',
            default: true,
            required: true
        }, {
            when: function(response){
                return !response.wordpress;
            },
            type: 'confirm',
            name: 'twig',
            message: 'Would you like to install Twig?',
            default: false,
            required: true
        }]).then(function(answers){
            for (var key in answers) {
                this.config[key] = answers[key];
            }
            done();
        }.bind(this));
    },

    writing: {
        script: function(){
            this.fs.copyTpl(
                this.templatePath('js/main.js'),
                this.destinationPath(this.folder.src + '/js/main.js'),
                { greensock: this.config.greensock }
            );
            this.fs.copyTpl(
                this.templatePath('js/requestAnimFrame.js'),
                this.destinationPath(this.folder.src + '/js/requestAnimFrame.js')
            );
            this.fs.copyTpl(
                this.templatePath('js/checkIfInView.js'),
                this.destinationPath(this.folder.src + '/js/checkIfInView.js')
            );
            this.fs.copyTpl(
                this.templatePath('js/getEltPosOnCover.js'),
                this.destinationPath(this.folder.src + '/js/getEltPosOnCover.js')
            );
            this.fs.copyTpl(
                this.templatePath('js/getUrlParam.js'),
                this.destinationPath(this.folder.src + '/js/getUrlParam.js')
            );
            this.fs.copyTpl(
                this.templatePath('js/throttle.js'),
                this.destinationPath(this.folder.src + '/js/throttle.js')
            );
        },
        wpTheme: function () {
            if (this.config.wordpress) {
                this.fs.copyTpl(
                    this.templatePath('theme/**/*'),
                    this.destinationPath(this.folder.src + '/theme')
                );
            }
        },
        fonts: function () {
            mkdirp.sync(this.destinationPath(this.folder.src + '/fonts'));
        },
        img: function () {
            mkdirp.sync(this.destinationPath(this.folder.src + '/img'));
        },
        layoutImg: function () {
            mkdirp.sync(this.destinationPath(this.folder.src + '/layoutImg'));
        },
        sass: function () {
            this.fs.copyTpl(
                this.templatePath('scss/**/*'),
                this.destinationPath(this.folder.src + '/scss')
            );
        },
        gulp: function () {
            if (this.config.wordpress) {
                this.fs.copyTpl(
                    this.templatePath('gulpfile.js'),
                    this.destinationPath('gulpfile.js'),
                    {
                        config: this.config,
                        folders: this.folderWp
                    }
                );
            }else{
                this.fs.copyTpl(
                    this.templatePath('gulpfile.js'),
                    this.destinationPath('gulpfile.js'),
                    {
                        config: this.config,
                        folders: this.folder
                    }
                );
            }
        },
        npm: function () {
            this.fs.copyTpl(
                this.templatePath('package.json'),
                this.destinationPath('package.json'),
                { name: this.config.name }
            );
        },
        template: function() {
            if (!this.config.wordpress) {
                if (this.config.twig) {
                    this.fs.copyTpl(
                        this.templatePath('twig/**/*'),
                        this.destinationPath(this.folder.src + '/templates')
                    );
                } else {
                    this.fs.copyTpl(
                        this.templatePath('html/index.html'),
                        this.destinationPath(this.folder.src + '/templates/index.html')
                    );
                }
            }
        },
        miscellaneous: function(){
            if (this.config.wordpress) {
                this.fs.copyTpl(
                    this.templatePath('.htaccess-wp'),
                    this.destinationPath(this.folder.src + '/.htaccess')
                );
                this.fs.copyTpl(
                    this.templatePath('robots-wp.txt'),
                    this.destinationPath(this.folder.src + '/robots.txt')
                );
            } else {
                this.fs.copyTpl(
                    this.templatePath('.htaccess'),
                    this.destinationPath(this.folder.src + '/.htaccess')
                );
                this.fs.copyTpl(
                    this.templatePath('robots.txt'),
                    this.destinationPath(this.folder.src + '/robots.txt')
                );
            }
            this.fs.copyTpl(
                this.templatePath('.jshintrc'),
                this.destinationPath('.jshintrc')
            );
        }
    },

    install: {
        npm: function(){
            this.npmDependencies = [
                'gulp',
                'gulp-size',
                'gulp-notify',
                'gulp-load-plugins',
                'gulp-sourcemaps',
                'gulp-sass',
                'gulp-autoprefixer',
                'gulp-prettify',
                'gulp-watch',
                'gulp-htmlmin',
                'browser-sync',
                'browserify',
                'babel-preset-es2015',
                'babelify',
                'gulp-uglify',
                'vinyl-source-stream',
                'vinyl-buffer',
                'del',
                'path',
                'jquery-slim',
            ];

            if(this.config.greensock){
                this.npmDependencies.push('gsap');
            }
            if(this.config.twig){
                this.npmDependencies.push('gulp-twig', 'gulp-ext-replace');
            }

            this.npmInstall(this.npmDependencies, { 'saveDev': true });
        }
    }
});

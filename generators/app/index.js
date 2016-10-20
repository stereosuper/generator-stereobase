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
            dest: 'dest',
        };
    },

    prompting: function(){
        var done = this.async();
        this.prompt([{
            type: 'input',
            name: 'name',
            message: 'What is you\'re project name?',
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
                this.destinationPath(this.folder.src + '/js/main.js')
            );
            this.fs.copyTpl(
                this.templatePath('js/requestAnimFrame.js'),
                this.destinationPath(this.folder.src + '/js/requestAnimFrame.js')
            );
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
        bower: function () {
            this.fs.copyTpl(
                this.templatePath('bower.json'),
                this.destinationPath('bower.json'),
                { name: this.config.name }
            );
            this.fs.copyTpl(
                this.templatePath('.bowerrc'),
                this.destinationPath('.bowerrc'),
                { src: this.folder.src + '/js/libs' }
            );
        },
        sass: function () {
            this.fs.copyTpl(
                this.templatePath('scss/**/*'),
                this.destinationPath(this.folder.src + '/scss')
            );
        },
        gulp: function () {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    config: this.config,
                    folders: this.folder
                }
            );
        },
        npm: function () {
            this.fs.copyTpl(
                this.templatePath('package.json'),
                this.destinationPath('package.json'),
                { name: this.config.name }
            );
        },
        template: function() {
            if (this.config.twig) {
                this.fs.copyTpl(
                    this.templatePath('twig/**/*'),
                    this.destinationPath(this.folder.src + '/templates'),
                    { greensock: this.config.greensock }
                );
            } else {
                this.fs.copyTpl(
                    this.templatePath('html/index.html'),
                    this.destinationPath(this.folder.src + '/templates/index.html'),
                    { greensock: this.config.greensock }
                );
            }
        }
    },

    install: {
        bower: function() {
            this.npmInstall([
                'browser-sync',
                'gulp',
                'gulp-autoprefixer',
                'gulp-load-plugins',
                'gulp-notify',
                'gulp-sass',
                'gulp-sourcemaps'
                ], { 'saveDev': true });
            this.bowerDependencies = ['jquery'];
            if(this.config.greensock){
                this.bowerDependencies.push('gsap');
            }
            this.bowerInstall(this.bowerDependencies, { 'save': true });
        },
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
                'gulp-imagemin',
                'gulp-htmlmin',
                'browser-sync',
                'browserify',
                'gulp-uglify',
                'vinyl-source-stream',
                'vinyl-buffer',
                'del',
                'path'
            ];

            if(this.config.twig){
                this.npmDependencies.push('gulp-twig', 'gulp-ext-replace');
            }

            this.npmInstall(this.npmDependencies, { 'saveDev': true });
        }
    }
});

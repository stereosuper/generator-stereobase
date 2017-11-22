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
// To handle WP
var WP = require('wp-cli');

var destPath = 'dest';

module.exports = yeoman.Base.extend({
    initializing: function() {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the laudable ' + chalk.blue('stereosuper') + ' generator!'));
        this.config = {};
        this.folder = {
            src: 'src',
            dest: destPath
        };
    },

    prompting: function(){
        var done = this.async();
        this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your project slug? (without specials characters)',
                default: 'stereosuper',
                required: true
            }, {
                type: 'input',
                name: 'url',
                message: 'What will be the final url ?',
                default: 'http://www.stereosuper.fr',
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
                message: 'Is it a WordPress project?',
                default: false,
                required: true
            }, {
                when: function(response){ return !response.wordpress; },
                type: 'confirm',
                name: 'twig',
                message: 'Would you like to install Twig?',
                default: false,
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'dbname',
                message: 'Choose a name for your database:',
                default: 'stereosuper',
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'dbuser',
                message: 'What is your database user?',
                default: 'root',
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'dbpass',
                message: 'What is your database password?',
                default: 'root',
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'dbprefix',
                message: 'Choose a prefix for your database tables:',
                default: 'stereo',
                required: true
            }
        ]).then(function(answers){
            for (var key in answers) {
                this.config[key] = answers[key];
            }
            done();
        }.bind(this));
    },

    writing: {
        script: function(){
            this.fs.copyTpl(
                this.templatePath('js/**'),
                this.destinationPath(this.folder.src + '/js'),
                { greensock: this.config.greensock }
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
                        folders: {
                            src: 'src',
                            dest_root: destPath,
                            dest: destPath + '/wp-content/themes/' + this.config.name
                        }
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
                this.fs.copyTpl(
                    this.templatePath('.gitignore-wp'),
                    this.destinationPath('.gitignore')
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
                this.fs.copyTpl(
                    this.templatePath('.gitignore-base'),
                    this.destinationPath('.gitignore')
                );
            }
            this.fs.copyTpl(
                this.templatePath('robots-preprod.txt'),
                this.destinationPath(this.folder.src + '/robots-preprod.txt')
            );
            this.fs.copyTpl(
                this.templatePath('.jshintrc'),
                this.destinationPath('.jshintrc')
            );
        },
        wp: function(){
            var that = this;
            if( that.config.wordpress ){
                that.fs.copyTpl(
                    that.templatePath('wp-config.php'),
                    that.destinationPath(that.folder.dest + '/wp-config.php'),
                    {
                        dbname: that.config.dbname,
                        dbuser: that.config.dbuser,
                        dbpass: that.config.dbpass,
                        dbprefix: that.config.dbprefix
                    }
                );

                WP.discover({path: that.folder.dest}, function( WP ){
                    WP.core.download(function( err, results ){
                        console.log(err + results);

                        WP.db.create({dbname: that.config.dbname, dbuser: that.config.dbuser, dbpass: that.config.dbpass}, function( err, results ){
                            console.log(err + results);
                        });
                    });
                });
            }
        },
        wpTheme: function () {
            if( this.config.wordpress ){
                this.fs.copyTpl(
                    this.templatePath('theme/**/*'),
                    this.destinationPath(this.folder.src + '/theme'),
                    { name: this.config.name }
                );
            }
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
                'babel-core',
                'babel-loader',
                'babelify',
                'gulp-uglify',
                'vinyl-source-stream',
                'vinyl-buffer',
                'del',
                'path',
                'jquery-slim',
                'gulp-sitemap',
                'wp-cli'
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

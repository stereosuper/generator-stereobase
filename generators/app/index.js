const Generator = require('yeoman-generator');
// to log a coloured message with Yeoman
const chalk = require('chalk');
// // tell Yeoman what to say in the console
const yosay = require('yosay');
// // To create folder
const mkdirp = require('mkdirp');
// // To handle WP
const WP = require('wp-cli');

var destPath = 'dest';

module.exports = class extends Generator {

    _script() {
        this.fs.copyTpl(
            this.templatePath('js/**'),
            this.destinationPath(this.folder.src + '/js'),
            { greensock: this.superConfig.greensock }
        );
    }

    _fonts() {
        mkdirp.sync(this.destinationPath(this.folder.src + '/fonts'));
    }

    _img() {
        mkdirp.sync(this.destinationPath(this.folder.src + '/img'));
    }

    _layoutImg() {
        mkdirp.sync(this.destinationPath(this.folder.src + '/layoutImg'));
    }

    _sass() {
        this.fs.copyTpl(
            this.templatePath('scss/**/*'),
            this.destinationPath(this.folder.src + '/scss')
        );
    }

    _gulp() {
        if (this.superConfig.wordpress) {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    config: this.superConfig,
                    folders: {
                        src: 'src',
                        dest_root: destPath,
                        dest: destPath + '/wp-content/themes/' + this.superConfig.name
                    }
                }
            );
        }else{
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    config: this.superConfig,
                    folders: this.folder
                }
            );
        }
    }
    
    _npm() {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            { name: this.superConfig.name }
        );
    }

    _template() {
        if (!this.superConfig.wordpress) {
            if (this.superConfig.twig) {
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
    }

    _miscellaneous() {
        if (this.superConfig.wordpress) {
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
    }

    _wp() {
        var that = this;
        if( that.superConfig.wordpress ){
            that.fs.copyTpl(
                that.templatePath('wp-config.php'),
                that.destinationPath(that.folder.dest + '/wp-config.php'),
                {
                    dbname: that.superConfig.dbname,
                    dbuser: that.superConfig.dbuser,
                    dbpass: that.superConfig.dbpass,
                    dbprefix: that.superConfig.name
                }
            );

            WP.discover({path: that.folder.dest}, function( WP ){
                WP.core.download({'locale': that.superConfig.lang}, function( err, results ){
                    console.log(err + results);

                    WP.db.create({}, function( err, results ){
                        console.log(err + results);
                        WP.core.install({url: 'localhost', title: that.superConfig.full_name, admin_user: that.superConfig.admin_user, admin_password: that.superConfig.admin_password, admin_email: that.superConfig.admin_email}, function( err, results ){
                            console.log(err + results);
                        });
                    });
                });
            });
        }
    }

    _wpTheme() {
        if( this.superConfig.wordpress ){
            this.fs.copyTpl(
                this.templatePath('theme/**/*'),
                this.destinationPath(this.folder.src + '/theme'),
                { name: this.superConfig.name }
            );
        }
    }


    _npmInstall() {
        this.npmDependencies = [
            'gulp',
            'gulp-size',
            'gulp-notify',
            'gulp-load-plugins',
            'gulp-sourcemaps',
            'gulp-sass',
            'gulp-shell',
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
            'wp-cli',
            'event-stream'
        ];

        if(this.superConfig.greensock){
            this.npmDependencies.push('gsap');
        }
        if(this.superConfig.twig){
            this.npmDependencies.push('gulp-twig', 'gulp-ext-replace');
        }

        this.npmInstall(this.npmDependencies, { 'saveDev': true });
    }

    
    initializing() {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the laudable ' + chalk.blue('stereosuper') + ' generator!'));
        this.superConfig = {};
        this.folder = {
            src: 'src',
            dest: destPath
        };
    }

    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'full_name',
                message: 'What is your project name?',
                default: 'Stéréosuper',
                required: true
            }, {
                type: 'input',
                name: 'name',
                message: 'What is your project slug? (without specials characters, will be used for functions and db prefix)',
                default: 'stereo',
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
                name: 'lang',
                message: 'What language will your site be in? (for french, write fr_FR)',
                default: 'en_US',
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'admin_user',
                message: 'Choose your admin username',
                default: 'adminStereo',
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'admin_email',
                message: 'Choose your admin email',
                default: 'bisous@stereosuper.fr',
                required: true
            }, {
                when: function(response){ return response.wordpress; },
                type: 'input',
                name: 'admin_password',
                message: 'Choose your admin password',
                default: 'p@ssW0rd',
                required: true
            }
        ]).then(answers => {
            for (var key in answers) {
                this.superConfig[key] = answers[key];
            }
        });
    }

    writing() {
        this._script();
        this._fonts();
        this._img();
        this._layoutImg();
        this._sass();
        this._gulp();
        this._npm();
        this._template();
        this._miscellaneous();
        this._wp();
        this._wpTheme();
    }

    install() {
        this._npmInstall();
    }

};

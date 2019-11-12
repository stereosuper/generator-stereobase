const Generator = require('yeoman-generator');
// To log a coloured message with Yeoman
const chalk = require('chalk');
// Tell Yeoman what to say in the console
const yosay = require('yosay');
// Random cool words
const { random } = require('superb');
// To create folder
const mkdirp = require('mkdirp');
// To handle WP
const WP = require('wp-cli');

var destPath = 'dest';

module.exports = class extends Generator {
    _script() {
        if (this.superConfig.wordpress) {
            this.folder.src = 'wp-content/themes/' + this.superConfig.name + '/src';
        }

        this.fs.copyTpl(this.templatePath('js/**'), this.destinationPath(this.folder.src + '/js'), {
            gsap: this.superConfig.gsap,
            customEase: this.superConfig.customEase
        });

        // If GSAP's CustomEase plugin used along with GSAP
        if (this.superConfig.gsap && this.superConfig.customEase) {
            this.fs.copyTpl(
                this.templatePath('plugins/CustomEase.js'),
                this.destinationPath(`${this.folder.src}/js/plugins/CustomEase.js`)
            );
        }
    }

    _fonts() {
        if (this.superConfig.wordpress) {
            this.folder.src = 'wp-content/themes/' + this.superConfig.name;
        }

        mkdirp.sync(this.destinationPath(this.folder.src + '/fonts'));
    }

    _img() {
        if (this.superConfig.wordpress) {
            this.folder.src = 'wp-content/themes/' + this.superConfig.name;
        }

        mkdirp.sync(this.destinationPath(this.folder.src + '/img'));
    }

    _sass() {
        if (this.superConfig.wordpress) {
            this.folder.src = 'wp-content/themes/' + this.superConfig.name + '/src';
        }

        this.fs.copyTpl(this.templatePath('scss/**/*'), this.destinationPath(this.folder.src + '/scss'));
    }

    _webpack() {
        if (this.superConfig.wordpress) {
            this.fs.copyTpl(
                this.templatePath('webpack/webpack-wordpress.config.js'),
                this.destinationPath('webpack.config.js'),
                { name: this.superConfig.name }
            );
        } else {
            this.fs.copyTpl(
                this.templatePath('webpack/webpack-static.config.js'),
                this.destinationPath('webpack.config.js')
            );
        }
    }

    _npm() {
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
            config: this.superConfig
        });
    }

    _template() {
        if (!this.superConfig.wordpress) {
            this.fs.copyTpl(
                this.templatePath('html/index.html'),
                this.destinationPath(this.folder.src + '/index.html')
            );
        }
    }

    _miscellaneous() {
        if (this.superConfig.wordpress) {
            this.fs.copyTpl(this.templatePath('.htaccess-wp'), this.destinationPath('.htaccess'));
            this.fs.copyTpl(this.templatePath('robots-wp.txt'), this.destinationPath('robots.txt'));
            this.fs.copyTpl(this.templatePath('.gitignore-wp'), this.destinationPath('.gitignore'));
            this.fs.copyTpl(this.templatePath('robots-preprod.txt'), this.destinationPath('robots-preprod.txt'));
            mkdirp.sync(this.destinationPath('wp-content/themes/' + this.superConfig.name + '/acf-json'));
        } else {
            this.fs.copyTpl(this.templatePath('.htaccess'), this.destinationPath(this.folder.src + '/.htaccess'));
            this.fs.copyTpl(this.templatePath('robots.txt'), this.destinationPath(this.folder.src + '/robots.txt'));
            this.fs.copyTpl(this.templatePath('.gitignore-base'), this.destinationPath('.gitignore'));
            this.fs.copyTpl(
                this.templatePath('robots-preprod.txt'),
                this.destinationPath(this.folder.src + '/robots-preprod.txt')
            );
        }

        // Linting with eslint and prettier
        this.fs.copyTpl(this.templatePath('.editorconfig'), this.destinationPath('.editorconfig'));
        this.fs.copyTpl(this.templatePath('.eslintrc'), this.destinationPath('.eslintrc'));
        this.fs.copyTpl(this.templatePath('.prettierrc'), this.destinationPath('.prettierrc'));
    }

    _wp() {
        var that = this;
        if (that.superConfig.wordpress) {
            that.fs.copyTpl(that.templatePath('wp-config.php'), that.destinationPath('wp-config.php'), {
                dbname: that.superConfig.dbname,
                dbuser: that.superConfig.dbuser,
                dbpass: that.superConfig.dbpass,
                dbprefix: that.superConfig.name
            });

            WP.discover({ path: './' }, function(WP) {
                WP.core.download({ locale: that.superConfig.lang }, function(err, results) {
                    console.log(err + results);

                    WP.db.create({}, function(err, results) {
                        console.log(err + results);

                        WP.core.install(
                            {
                                url: that.superConfig.name + '.local',
                                title: that.superConfig.full_name,
                                admin_user: that.superConfig.admin_user,
                                admin_password: that.superConfig.admin_password,
                                admin_email: that.superConfig.admin_email
                            },
                            function(err, results) {
                                console.log(err + results);
                            }
                        );
                    });
                });
            });
        }
    }

    _wpTheme() {
        if (this.superConfig.wordpress) {
            this.fs.copyTpl(
                this.templatePath('theme/**/*'),
                this.destinationPath('wp-content/themes/' + this.superConfig.name),
                { name: this.superConfig.name }
            );
        }
    }

    _npmInstallDev() {
        this.npmDevDependencies = [
            'browser-sync-webpack-plugin',
            'path',
            '@babel/core',
            'browser-sync',
            'babel-loader',
            'mini-css-extract-plugin',
            'css-loader',
            'file-loader',
            'sass-loader',
            'postcss-loader',
            'webpack',
            'webpack-cli',
            'optimize-css-assets-webpack-plugin'
        ];

        if (!this.superConfig.wordpress) {
            this.npmDevDependencies.push('copy-webpack-plugin');
            this.npmDevDependencies.push('webpack-dev-server');
        }

        this.npmInstall(this.npmDevDependencies, { saveDev: true });
    }

    _npmInstall() {
        this.npmDependencies = ['@stereorepo/sac', 'intersection-observer'];

        if (this.superConfig.greensock) this.npmDependencies.push('gsap');

        this.npmInstall(this.npmDependencies);
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
                message: '👉 What is your project name?',
                default: 'Stéréosuper',
                required: true
            },
            {
                type: 'input',
                name: 'name',
                message:
                    '👉 What is your project slug? (without specials characters, will be used for functions and db prefix)',
                default: 'stereo',
                required: true
            },
            {
                type: 'input',
                name: 'description',
                message: '👉 Project description',
                default: `My ${random()} Stéréobase project 😍`
            },
            {
                type: 'input',
                name: 'url',
                message: '👉 What will be the final url ?',
                default: 'http://www.stereosuper.fr',
                required: true
            },
            {
                type: 'confirm',
                name: 'gsap',
                message: '👉 Would you like to install GSAP?',
                default: true,
                required: true
            },
            {
                when: response => response.gsap,
                type: 'confirm',
                name: 'customEase',
                message: '👉 Would you like to use GSAP CustomEase plugin?',
                default: true,
                required: true
            },
            {
                type: 'confirm',
                name: 'wordpress',
                message: '👉 Is it a WordPress project?',
                default: false,
                required: true
            },
            {
                when: response => response.wordpress,
                type: 'input',
                name: 'dbname',
                message: '👉 Choose a name for your database:',
                default: 'stereosuper',
                required: true
            },
            {
                when: function(response) {
                    return response.wordpress;
                },
                type: 'input',
                name: 'dbuser',
                message: '👉 What is your database user?',
                default: 'root',
                required: true
            },
            {
                when: function(response) {
                    return response.wordpress;
                },
                type: 'input',
                name: 'dbpass',
                message: '👉 What is your database password?',
                default: 'root',
                required: true
            },
            {
                when: function(response) {
                    return response.wordpress;
                },
                type: 'input',
                name: 'lang',
                message: '👉 What language will your site be in? (for french, write fr_FR)',
                default: 'en_US',
                required: true
            },
            {
                when: function(response) {
                    return response.wordpress;
                },
                type: 'input',
                name: 'admin_user',
                message: '👉 Choose your admin username',
                default: 'adminStereo',
                required: true
            },
            {
                when: function(response) {
                    return response.wordpress;
                },
                type: 'input',
                name: 'admin_email',
                message: '👉 Choose your admin email',
                default: 'bisous@stereosuper.fr',
                required: true
            },
            {
                when: function(response) {
                    return response.wordpress;
                },
                type: 'input',
                name: 'admin_password',
                message: '👉 Choose your admin password',
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
        this._webpack();
        this._npm();
        this._wp();
        this._wpTheme();
        this._script();
        this._fonts();
        this._img();
        this._sass();
        this._template();
        this._miscellaneous();
    }

    install() {
        this._npmInstallDev();
        this._npmInstall();
    }
};

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
// Allows us to execute shell commands
const { exec } = require('child_process');
const validate = require('validate-npm-package-name');

const destPath = 'dest';

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
const sh = async cmd =>
    new Promise(function(resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                console.log(`✅ ${cmd}`);

                resolve({ stdout, stderr });
            }
        });
    });

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

    _scss() {
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
        const validation = validate(this.superConfig.name);
        validation.warnings &&
            validation.warnings.forEach(warn => {
                console.warn('Warning:', warn);
            });
        validation.errors &&
            validation.errors.forEach(err => {
                console.error('Error:', err);
            });
        validation.errors && validation.errors.length && process.exit(1);

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

        // Babel config
        this.fs.copyTpl(this.templatePath('_babel.config.js'), this.destinationPath('babel.config.js'));

        // PostCSS config
        this.fs.copyTpl(this.templatePath('_postcss.config.js'), this.destinationPath('postcss.config.js'));

        // Linting with eslint and prettier
        this.fs.copyTpl(this.templatePath('._editorconfig'), this.destinationPath('.editorconfig'));
        this.fs.copyTpl(this.templatePath('._eslintrc'), this.destinationPath('.eslintrc'));
        this.fs.copyTpl(this.templatePath('._prettierrc'), this.destinationPath('.prettierrc'));
    }

    async _wp() {
        if (this.superConfig.wordpress) {
            this.fs.copyTpl(this.templatePath('wp-config.php'), this.destinationPath('wp-config.php'), {
                dbname: this.superConfig.dbname,
                dbuser: this.superConfig.dbuser,
                dbpass: this.superConfig.dbpass,
                dbprefix: this.superConfig.name
            });

            // To prevent MySQL errors caused by MAMP and the PHP version used
            // SEE: https://make.wordpress.org/cli/handbook/installing/#using-a-custom-php-binary
            // NOTE: It needs to be done for each project install
            await sh('PHP_VERSION=$(ls /Applications/MAMP/bin/php/ | sort -n | tail -1)');
            await sh('export PATH=/Applications/MAMP/bin/php/${PHP_VERSION}/bin:$PATH');
            await sh('export PATH=$PATH:/Applications/MAMP/Library/bin/');

            WP.discover({ path: './' }, WP => {
                WP.core.download({ locale: this.superConfig.lang }, (err, results) => {
                    console.log(err + results);

                    WP.db.create({}, (err, results) => {
                        console.log(err + results);

                        WP.core.install(
                            {
                                url: this.superConfig.name + '.local',
                                title: this.superConfig.full_name,
                                admin_user: this.superConfig.admin_user,
                                admin_password: this.superConfig.admin_password,
                                admin_email: this.superConfig.admin_email
                            },
                            (err, results) => {
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
            '@babel/core',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-spread',
            '@babel/preset-env',
            'babel-loader',
            'browser-sync',
            'browser-sync-webpack-plugin',
            'css-loader',
            'file-loader',
            'mini-css-extract-plugin',
            'node-sass',
            'optimize-css-assets-webpack-plugin',
            'path',
            'postcss-loader',
            'postcss-import',
            'postcss-preset-env',
            'postcss-nested',
            'sass-loader',
            'webpack',
            'webpack-cli'
        ];

        if (!this.superConfig.wordpress) {
            this.npmDevDependencies.push('copy-webpack-plugin');
            this.npmDevDependencies.push('webpack-dev-server');
        }

        this.npmInstall(this.npmDevDependencies, { saveDev: true });
    }

    _npmInstall() {
        this.npmDependencies = ['@babel/polyfill', '@stereorepo/burger', '@stereorepo/sac', 'intersection-observer'];

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
        this._scss();
        this._template();
        this._miscellaneous();
    }

    install() {
        this._npmInstallDev();
        this._npmInstall();
    }
};

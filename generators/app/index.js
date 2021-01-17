const Generator = require('yeoman-generator');
// To log a coloured message with Yeoman
const chalk = require('chalk');
// Tell Yeoman what to say in the console
const yosay = require('yosay');
// To create folder
const mkdirp = require('mkdirp');
// To handle WP
const WP = require('wp-cli');
// Allows us to execute shell commands
const { execSync } = require('child_process');
const validate = require('validate-npm-package-name');

const destPath = 'dest';

const customLog = ({ header = '', message = '', type = 'custom' }) => {
    if (type === 'error') {
        console.error(`👉 ${chalk.red(header)}: ❌ ${message}`);
    } else if (type === 'success') {
        console.log(`👉 ${chalk.green(header)}: ✅ ${message}`);
    } else if (type === 'start') {
        console.log(`👉 ${chalk.cyan(header)}: 🏁 ${message}`);
    }
};

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

        validation.warnings && validation.warnings.forEach(warn => { console.warn('Warning:', warn); });
        validation.errors && validation.errors.forEach(err => { console.error('Error:', err); });
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

    _wpFiles() {
        if (this.superConfig.wordpress) {
            if (this.superConfig.multisite) {
                mkdirp.sync(this.destinationPath('wp-content/themes/' + this.superConfig.name + '/languages'));
            }

            this.fs.copyTpl(
                this.templatePath('theme/**/*'),
                this.destinationPath('wp-content/themes/' + this.superConfig.name),
                { name: this.superConfig.name, isMultisite: this.superConfig.multisite }
            );

            this.fs.copyTpl(this.templatePath('wp-config.php'), this.destinationPath('wp-config.php'), {
                dbname: this.superConfig.dbname,
                dbuser: this.superConfig.dbuser,
                dbpass: this.superConfig.dbpass,
                dbprefix: this.superConfig.name,
                isMultisite: this.superConfig.multisite
            });
        }
    }

    async _wp() {
        if (this.superConfig.wordpress) {
            // To prevent MySQL errors caused by MAMP and the PHP version used
            // SEE: https://make.wordpress.org/cli/handbook/installing/#using-a-custom-php-binary
            // NOTE: It needs to be done for each project install
            execSync('PHP_VERSION=$(ls /Applications/MAMP/bin/php/ | sort -n | tail -1)');
            execSync('export PATH=/Applications/MAMP/bin/php/${PHP_VERSION}/bin:$PATH');
            execSync('export PATH=$PATH:/Applications/MAMP/Library/bin/');

            return new Promise((resolve, reject) => {
                WP.discover({ path: './' }, WP => {
                    WP.core.download({ locale: this.superConfig.lang }, (err, results) => {
                        if (err) {
                            customLog({ header: 'WP-CLI', message: err, type: 'error' });
                            reject();
                        }
                        if (results) {
                            customLog({ header: 'WP-CLI', message: 'WordPress download successful', type: 'success' });
                            WP.db.create({}, async (err, results) => {
                                if (err) {
                                    customLog({ header: 'WP-CLI', message: err, type: 'error' });
                                    reject();
                                }
                                if (results) {
                                    customLog({
                                        header: 'WP-CLI',
                                        message: `Database named ${this.superConfig.dbname} created`,
                                        type: 'success'
                                    });

                                    WP.core.install(
                                        {
                                            url: this.superConfig.name + '.local',
                                            title: this.superConfig.full_name,
                                            admin_user: this.superConfig.admin_user,
                                            admin_password: this.superConfig.admin_password,
                                            admin_email: this.superConfig.admin_email
                                        },
                                        (err, results) => {
                                            if (err) {
                                                customLog({ header: 'WP-CLI', message: err, type: 'error' });
                                                reject();
                                            }
                                            if (results) {
                                                customLog({
                                                    header: 'WP-CLI',
                                                    message: 'WordPress install successful',
                                                    type: 'success'
                                                });

                                                mkdirp.sync(this.destinationPath('wp-content/mu-plugins'));
                                                resolve();
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                });
            });
        }
    }

    _npmInstallDev() {
        this.npmDevDependencies = [
            '@babel/core',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-spread',
            '@babel/preset-env',
            'babel-eslint',
            'babel-loader',
            'browser-sync',
            'browser-sync-webpack-plugin',
            'clean-webpack-plugin',
            'css-loader',
            'eslint',
            'eslint-loader',
            'eslint-config-prettier',
            'eslint-plugin-prettier',
            'file-loader',
            'mini-css-extract-plugin',
            'node-sass',
            'optimize-css-assets-webpack-plugin',
            'path',
            'postcss-loader',
            'postcss-import',
            'postcss-preset-env',
            'postcss-nested',
            'prettier',
            'sass-loader',
            'webpack',
            'webpack-bundle-analyzer',
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
        this.log(yosay(`Welcome to the laudable ${chalk.blue('stereosuper')} generator!`));
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
                default: ''
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
                type: 'confirm',
                name: 'multisite',
                message: '👉 Is the WordPress a multisite?',
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
                when: response => response.wordpress,
                type: 'input',
                name: 'dbuser',
                message: '👉 What is your database user?',
                default: 'root',
                required: true
            },
            {
                when: response => response.wordpress,
                type: 'input',
                name: 'dbpass',
                message: '👉 What is your database password?',
                default: 'root',
                required: true
            },
            {
                when: response => response.wordpress,
                type: 'input',
                name: 'lang',
                message: '👉 What language will your site be in? (for french, write fr_FR)',
                default: 'en_US',
                required: true
            },
            {
                when: response => response.wordpress,
                type: 'input',
                name: 'admin_user',
                message: '👉 Choose your admin username',
                default: 'adminStereo',
                required: true
            },
            {
                when: response => response.wordpress,
                type: 'input',
                name: 'admin_email',
                message: '👉 Choose your admin email',
                default: 'bisous@stereosuper.fr',
                required: true
            },
            {
                when: response => response.wordpress,
                type: 'input',
                name: 'admin_password',
                message: '👉 Choose your admin password',
                default: 'p@ssW0rd',
                required: true
            }
        ]).then(answers => {
            for (let key in answers) {
                this.superConfig[key] = answers[key];
            }
        });
    }

    writing() {
        this._npm();
        this._webpack();
        this._wpFiles();
        this._script();
        this._fonts();
        this._img();
        this._scss();
        this._template();
        this._miscellaneous();
    }

    async install() {
        await this._wp();

        customLog({ header: 'Npm', message: 'Installing dependencies', type: 'start' });

        this._npmInstallDev();
        this._npmInstall();
    }

    async end() {
        customLog({ header: 'Npm', message: 'Dependencies successfully installed\n', type: 'success' });
        customLog({ header: 'Eslint', message: 'Linting started', type: 'start' });
        execSync('npm run lintfix');
        customLog({ header: 'Eslint', message: 'Linting done', type: 'success' });

        if (this.superConfig.wordpress && this.superConfig.multisite) {
            console.log(
                `\n🌐 ${chalk.cyan(
                    'WordPress Multisite config'
                )}: Go to the admin dashboard in Tools => Network Setup, and click on install.\n`
            );
            console.log(
                `🌐 ${chalk.cyan(
                    'WordPress Multisite config'
                )}: Then copy and paste the lines below in the .htaccess instead of the existing WordPress rules.\n`
            );
            console.log(
                chalk.cyan(
                    'RewriteEngine On\nRewriteBase /\nRewriteRule ^index.php$ - [L]\n\n# add a trailing slash to /wp-admin\nRewriteRule ^([_0-9a-zA-Z-]+/)?wp-admin$ $1wp-admin/ [R=301,L]\n\nRewriteCond %{REQUEST_FILENAME} -f [OR]\nRewriteCond %{REQUEST_FILENAME} -d\nRewriteRule ^ - [L]\nRewriteRule ^([_0-9a-zA-Z-]+/)?(wp-(content|admin|includes).*) $2 [L]\nRewriteRule ^([_0-9a-zA-Z-]+/)?(.*.php)$ $2 [L]\nRewriteRule . index.php [L]\n'
                )
            );
            console.log(
                `\n🌐 ${chalk.cyan(
                    'WordPress Multisite config'
                )}: The wp-config rules are already in the file, simply uncomment them.\n`
            );
        }

        if (this.superConfig.wordpress) {
            console.log(
                `👉 ${chalk.red(
                    'WordPress config'
                )}: Don't forget to download and install TGMPA in the wp-content/mu-plugins directory (${chalk.red(
                    'http://tgmpluginactivation.com/download/'
                )}).\n`
            );
        }
    }
};

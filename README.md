![Logo](logo.jpg)

# generator-stereobase [![NPM version][npm-image]][npm-url]
> Generate a simple project (static or WordPress)

## Installation

First if you don't have the rights on your /usr/local folder:

```bach
sudo chown -R $USER /usr/local
```

Then, install [Gulp](http://gulpjs.com), [Yeoman](http://yeoman.io) and generator-stereobase using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g gulp
npm install -g yo
npm install -g generator-stereobase
```

Then generate your new project:

```bash
yo stereobase
```

Then launch gulp for the first time:

```bash
gulp start
```

And finally listen to file changes:

```bash
gulp watch
```

### WordPress project installation

If you need to install a WordPress project, follow these steps before launching Yeoman.

Install wp-cli (https://make.wordpress.org/cli/handbook/installing/):

```
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

To prevent MySQL errors caused by MAMP and the PHP version used (https://make.wordpress.org/cli/handbook/installing/#using-a-custom-php-binary):

```
PHP_VERSION=$(ls /Applications/MAMP/bin/php/ | sort -n | tail -1)
export PATH=/Applications/MAMP/bin/php/${PHP_VERSION}/bin:$PATH
export PATH=$PATH:/Applications/MAMP/Library/bin/
```

You can now launch Yeoman, and answer Y to the WordPress question. You need to have mysql server started to allow Yeoman to automatically create the database!

Finally, install TGMPA to manage plugins: http://tgmpluginactivation.com/installation/ (there is already commented code to handle plugins regsitration in functions.php).


### Change configstore files owner

```bash
sudo chown -R userMachine /Users/userMachine/.config/configstore/
```


## Installation of an existing project

Start with intalling npm modules:

```bash
cd project-name
npm install
```

Then launch gulp:

```bash
gulp start
gulp watch
```

### Installation of a WordPress project

First you need to follow the same steps as [above](#wordpress-project-installation): installation of wp-cli and fixes MySQL errors with MAMP.

After that, you can install npm modules:

```bash
cd project-name
npm install
```

Then you need to install the WordPress:

```bash
cd dest
wp core download --locale=en_US
wp db create
wp core install --url=localhost --title=Stéréosuper --admin_user=adminStereo --admin_password=azerty --admin_email=bisou@stereosuper.fr
```

Finally, launch gulp:

```bash
cd ..
gulp start
gulp watch
```


## Publish the Generator | New version

```bash
npm set init.author.name "Your Name"
npm set init.author.email "Your Email"
npm set init.author.url "Your Website"
npm adduser
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
npm publish
```
https://docs.npmjs.com/cli/publish


## Thanks

* Hugo Giraudel for [Sass Guidelines](https://sass-guidelin.es/)
* Chris Coyier for his book [Practical SVG](https://abookapart.com/products/practical-svg)
* [Loic Goyet](https://github.com/LoicGoyet) for the training course on Gulp and Yeoman.
* [Val Head](http://valhead.com/) for her book [Designing interface animation](http://rosenfeldmedia.com/books/designing-interface-animation/)


## License

MIT © [Adrien Le Menthéour](www.adrienlm.com) | [Elisabeth Hamel](www.e-hamel.com)


[npm-image]: https://badge.fury.io/js/generator-stereobase.svg
[npm-url]: https://npmjs.org/package/generator-stereobase
[travis-image]: https://travis-ci.org/stereosuper/generator-stereobase.svg?branch=master
[travis-url]: https://travis-ci.org/stereosuper/generator-stereobase
[daviddm-image]: https://david-dm.org/stereosuper/generator-stereobase.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stereosuper/generator-stereobase

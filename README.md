![Logo](logo.jpg)

# generator-stereobase [![NPM version][npm-image]][npm-url]

> Generate a simple project (static or WordPress)

## Installation

First if you don't have the rights on your /usr/local folder:

```bach
sudo chown -R $USER /usr/local
```

If you're on High Sierra use instead:

```bach
sudo chown -R $(whoami)
```

Then, install [Yeoman](http://yeoman.io) and generator-stereobase using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-stereobase
```

Then, you need to create a new host in Mamp called yourProjectName.local, and start the servers.

After that you can generate your project:

```bash
yo stereobase
```

And finally launch the dev server:

```bash
npm run dev
```

When you need to build use:

```bash
npm run build
```

You'll have your files in the `dest` directory.

### WordPress project installation

If you need to install a WordPress project, follow these steps before launching Yeoman.

Install wp-cli if you don't have it already (https://make.wordpress.org/cli/handbook/installing/):

```
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

You can now launch Yeoman, and answer Y to the WordPress question. You need to have mysql server started to allow Yeoman to automatically create the database!

Finally, install TGMPA to manage plugins: http://tgmpluginactivation.com/installation/ : once you've downloaded the file, place it in a directory called "mu-plugins" in /wp-content, and decomment the code to handle plugins regsitration in functions.php.

### Change configstore files owner

```bash
sudo chown -R userMachine /Users/userMachine/.config/configstore/
```

### Installation of an existing WordPress project

First you need to install wp-cli as [above](#wordpress-project-installation).

After that, you can install npm modules:

```bash
cd project-name
npm i
```

Then you need to install the WordPress:

```bash
wp core download --locale=en_US
wp db create
wp core install --url=localhost --title=Stereosuper --admin_user=adminStereo --admin_password=azerty --admin_email=bisou@stereosuper.fr
```

Finally, launch the server:

```bash
npm run dev
```

You also probably will need to connect to the admin, and install required plugins. If TGMPA was installed, go directly to Appearance > Install plugins.

## Thanks

-   Hugo Giraudel for [Sass Guidelines](https://sass-guidelin.es/)
-   Chris Coyier for his book [Practical SVG](https://abookapart.com/products/practical-svg)
-   [Loic Goyet](https://github.com/LoicGoyet) for the training course on Gulp and Yeoman.
-   [Val Head](http://valhead.com/) for her book [Designing interface animation](http://rosenfeldmedia.com/books/designing-interface-animation/)

## License

MIT © [Adrien Le Menthéour](https://www.adrienlm.com) | [Elisabeth Hamel](https://www.e-hamel.com) | [Clément Lemoine](https://clementlemoine.com) | [Alban Mezino](https://albanmezino.fr)

[npm-image]: https://badge.fury.io/js/generator-stereobase.svg
[npm-url]: https://npmjs.org/package/generator-stereobase
[travis-image]: https://travis-ci.org/stereosuper/generator-stereobase.svg?branch=master
[travis-url]: https://travis-ci.org/stereosuper/generator-stereobase
[daviddm-image]: https://david-dm.org/stereosuper/generator-stereobase.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stereosuper/generator-stereobase

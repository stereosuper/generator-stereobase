'use strict';
var yeoman = require('yeoman-generator');
// var chalk = require('chalk');
// var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is you\'re project name?',
      required: true
    }];

    this.prompt(prompts, function (props) {
      // this.props = props;
      // To access props later use this.props.someAnswer;
      this.name = props.name;

      done();
    }.bind(this));
  },

  writing: {
    html: function () {
      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath('index.html')
      );
    },
    script: function () {
      this.fs.copy(
        this.templatePath('js/script.js'),
        this.destinationPath('js/script.js')
      );
    },
    bower: function () {
      this.fs.copy(
        this.templatePath('bower.json'),
        this.destinationPath('bower.json')
      );
      this.fs.copy(
        this.templatePath('.bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },
    sass: function () {
      this.fs.copy(
        this.templatePath('scss/main.scss'),
        this.destinationPath('scss/main.scss')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});

'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

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
      //this.props = props;
      // To access props later use this.props.someAnswer;
      this.name = props.name;

      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();
  }
});

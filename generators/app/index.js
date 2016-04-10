'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
 
var OnepageGenerator = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is you\'re project name ?',
        required: true,
      }
    ], function (answers) {
      this.name = answers.name;
      done();
    }.bind(this));
  }
});
 
module.exports = OnepageGenerator;
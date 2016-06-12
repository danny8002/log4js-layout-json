'use strict';
var fs_ = require("fs");
var path_ = require("path");


module.exports = function (grunt) {
    var cfg = grunt.file.readJSON('jsconfig.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false,
                    timeout: 100000
                },
                src: ['test/**/*.js']
            }
        },
    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask("default", ["mochaTest"]);
}
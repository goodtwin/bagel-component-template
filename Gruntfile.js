/*global module, require*/
module.exports = function (grunt) {
  'use strict';

  var globalConfig = {
    docs: 'node_modules/bagel-styleguide/docs',
    styleguide: 'guide',
    dist: {
      root: 'dist',
      docs: 'dist/docs',
      style: 'dist/style'
    }
  };

  grunt.initConfig({
    globalConfig: globalConfig,
    pkg: grunt.file.readJSON('./package.json'),
    assemble : {
      docs: {
        options: {
          assets: '<%= globalConfig.docs  %>/assets',
          flatten: false,
          partials: ['<%= globalConfig.docs  %>/partials/*.hbs'],
          layout: '<%= globalConfig.docs  %>/layouts/default.hbs',
          data: ['<%= globalConfig.docs  %>/data/*.{json,yml}','config.{json,yml}']
        },
        files: [{
          expand: true,
          cwd: '<%= globalConfig.styleguide  %>',
          src: ['**/*.hbs'],
          dest: '<%= globalConfig.dist.docs  %>'
        }]
      }
    },
    clean: {
      docs: {
        files : [
        {
          dot: true,
          src: ['<%= globalConfig.dist.docs  %>/*']
        }
        ]
      }
    },
    copy: {
      docs: {
        files: [
        {
          expand: true,
          cwd: '<%= globalConfig.docs  %>/assets/',
          src: ['images/*', 'javascripts/**/*.js'],
          dest: '<%= globalConfig.dist.docs  %>/assets/'
        },
        {
          expand: true,
          cwd: '<%= globalConfig.docs  %>/assets/',
          src: ['stylesheets/*.css'],
          dest: '<%= globalConfig.dist.docs  %>/'
        }
        ]
      }
    },
    sass: {
      options: {
        loadPath: ['./', 'node_modules/']
      },
      styleguide: {
        files : {
          '<%= globalConfig.dist.docs  %>/stylesheets/styleguide.css': '<%= globalConfig.styleguide  %>/styleguide.scss'
        }
      },
      dist: {
        files : {
          '<%= globalConfig.dist.style %>/style.css': 'init.scss'
        }
      }
    },
    shared_config: {
      style: {
        options: {
          name: 'defaultConfig',
          cssFormat: 'dash',
          useSassMaps: true
        },
        src: ['node_modules/bagel-*/config.yml', 'config.yml'], // order matters
        dest: [
          'config.scss'
        ]
      }
    },
    myth: {
      options: {
        sourcemap: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= globalConfig.dist.root  %>/',
            src: ['**/*.css'],
            dest: '<%= globalConfig.dist.root  %>/'
          }
        ]
      }
    },
    watch: {
      hbs: {
        files: ['**/*.hbs'],
        tasks: ['assemble:docs']
      }
    }
  });

require('load-grunt-tasks')(grunt);
grunt.loadNpmTasks('assemble');

grunt.registerTask('default', ['build']);
grunt.registerTask('dist', ['sass:dist', 'myth:dist']);
grunt.registerTask('docs', ['copy:docs', 'sass:styleguide', 'myth:dist', 'assemble']);
grunt.registerTask('build', ['clean', 'shared_config', 'docs', 'dist']);

};

var fs = require('fs');

module.exports = function(grunt) {
  grunt.initConfig({

    compass: {                  // Task
      dev: {                   // Target
        options: {              // Target options
          sassDir: 'sass',
          cssDir: 'build/stylesheets'
        }
      },
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'build/stylesheets',
          'output-style': 'compressed'
        }
      }
    },

    concat: {
      build: {
        src: [
          'vendor/jquery.js',
          'vendor/async.js',
          'vendor/stats.js',
          'build/javascripts/ld27.js'
        ],
        dest: 'build/javascripts/ld27.concat.js'
      }
    },

    uglify: {
      build: {
        files: {
          'build/javascripts/ld27.min.js': ['build/javascripts/ld27.concat.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['build/javascripts/ld27.js'],
        tasks: ['concat', 'notify:done'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['**/*.sass'],
        tasks: ['compass:dev'],
        options: {
          livereload: true
        }
      }
    },

    notify: {
      done: {
        options: {
          message: 'compilation done!'
        }
      },
      compiling: {
        options: {
          message: 'compiling...'
        }
      }
    },

    connect: {
      server: {
        options: {
          hostname: "*"
        }
      }
    },

    watchify: {
      options: {
        debug: true,
        callback: function (b) {
          b.transform(require("coffeeify"));

          return b;
        }
      },
      ldfw: {
        src: ['./coffeescripts/framework/ldfw.coffee'],
        dest: 'build/javascripts/ldfw.js'
      },
      ld27: {
        src: ['./coffeescripts/game/application.coffee'],
        dest: 'build/javascripts/ld27.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-watchify');

  grunt.registerTask('default', ['connect', 'watchify', 'watch'])

  grunt.registerTask('build', [
    'watchify',
    'compass:dist'
  ])
};

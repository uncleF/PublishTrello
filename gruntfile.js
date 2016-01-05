//Gruntfile for the TBDBackend Project

var APP_DIR          = 'app'      // App
var SASS_DIR         = 'sass';    // Sass
var CSS_DIR          = 'css';     // CSS
var CSS_FILENAME     = 'styles';  // CSS Filename

module.exports = function(grunt) {

  var project = {
    app: APP_DIR,
    css: {
      sass: APP_DIR + '/' + SASS_DIR + '/',
      dir: APP_DIR + '/' + CSS_DIR + '/',
      filename: CSS_FILENAME
    }
  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    scsslint: {
      scssLint: {
        cwd: project.css.sass,
        src: ['**/*.scss'],
        expand: true
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      cssLint: {
        cwd: project.css.dir,
        src: ['*.css'],
        expand: true
      }
    },
    csscss: {
      options: {
        shorthand: false,
        verbose: true
      },
      csscssTest: {
        src: project.css.dir + '*.css'
      }
    },
    colorguard: {
      files: {
        src: project.css.dir + '*.css'
      }
    },

    analyzecss: {
      options: {
        outputMetrics: 'error',
        softFail: true,
        thresholds: grunt.file.readJSON('.analyzecssrc')
      },
      ananlyzeCSS: {
        cwd: project.css.dir,
        src: [project.css.filename + '.css'],
        expand: true
      }
    },

    sass: {
      options: {
        sourceMap: true,
        precision: 5
      },
      generateCSS: {
        cwd: project.css.sass,
        src: ['**/*.{scss,sass}'],
        dest: project.css.dir,
        ext: '.css',
        expand: true
      }
    },
    autoprefixer: {
      options: {
        map: true,
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Explorer >= 7'],
        cascade: false
      },
      prefixCSS: {
        cwd: project.css.dir,
        src: ['**/*.css'],
        dest: project.css.dir,
        expand: true
      }
    },

    cssc: {
      options: grunt.file.readJSON('.csscrc'),
      cssOptimize: {
        cwd: project.css.dir,
        src: ['*.css'],
        dest: project.css.dir,
        expand: true
      }
    },

    watch: {
      options: {
        spawn: false
      },
      sass: {
        files: [project.css.sass + '**/*.{scss,sass}'],
        tasks: ['build']
      }
    }

  });

  grunt.registerTask('quality', ['scsslint', 'csslint', 'csscss', 'colorguard']);

  grunt.registerTask('performance', ['analyzecss']);

  grunt.registerTask('generate-css', ['sass', 'autoprefixer']);

  grunt.registerTask('watch-project', ['watch']);

  grunt.registerTask('build', ['generate-css', 'cssc']);

};

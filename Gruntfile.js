
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    

    concat: {
     options: {
      separator: ';',
     },
     dist: {
      src: 'pub/lib/**/*.js',
      dest: 'built.js',
     },
    },  

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/ServerSpec.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: true,
        sourceMap: true
      },
      build: {
        files: {
          'public/client.min.js': 'public/client/**/*.js',
          'public/lib.min.js': ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js']
        }
      //   files: [{
      //     src: 'public/client/**/*.js',
      //     dest: 'public/client.min.js'
      //   }, {
      //     src: 'public/lib/**/*.js',
      //     dest: 'public/lib.min.js'
      //   }]
      }
    },

    jshint: {
      files: ['app/**/*.js', 'lib/**/*.js', 'public/**/*.js', 'server.js', 'server-config.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: ['public/lib/**/*.js','public/*.min.js']
      }
    },

    cssmin: {
      css:{
        src: 'public/style.css',
        dest: 'public/style.min.css'
      }   
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },


    shell: {
      options: {
        stdout: true
      },
      prodServer: {
       command: 'npm test'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);


  grunt.registerTask('build', [ 
    'jshint', 'uglify' , 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here



    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [ 
    //'shell', 
      // add your production server task here
  ]);


};

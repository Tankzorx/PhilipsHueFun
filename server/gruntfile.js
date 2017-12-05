module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    tslint: {
      options: {
          // can be a configuration object or a filepath to tslint.json 
          configuration: "tslint.json",
          // If set to true, tslint errors will be reported, but not fail the task 
          // If set to false, tslint errors will be reported, and the task will fail 
          force: false,
          fix: false
      },
      files: {
          src: "**/*.ts"
      }
    },
    ts: {
      default : {
        tsconfig: true
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['views/*'], dest: 'build/', filter: 'isFile'},
          {expand: true, src: ['public/**/*'], dest: 'build/', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('default', ['ts', 'copy']);

};

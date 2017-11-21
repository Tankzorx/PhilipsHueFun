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
          src: "src/**/*.ts"
      }
    },
    ts: {
      default : {
        tsconfig: true
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');

  // Default task(s).
  //grunt.registerTask('lint', ['tslint']);
  
  grunt.registerTask('default', ['ts']);

};
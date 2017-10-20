module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-dss');

    grunt.initConfig({
        dss: require('./dss.config.js')
    });

    grunt.registerTask('default', ['dss']);
    grunt.registerTask('docs', ['default']);
};


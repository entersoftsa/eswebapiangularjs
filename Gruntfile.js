module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                sourceMap: true
            },

            light: {
                files: {
                    'dist/eswebapi-angular-light.min.js': 
                    [
                        'src/eswebservices.js',
                        'src/esinit.js',
                        'src/eswebservices.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('build', []);
};
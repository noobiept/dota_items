module.exports = function( grunt )
{
grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        copy: {
            libraries: {
                expand: true,
                src: '../libraries/**',
                dest: '../release/<%= pkg.name %>_<%= pkg.version %>/libraries/'
            }
        },

        uglify: {
            release: {
                files: {
                    '../release/<%= pkg.name %>_<%= pkg.version %>/dota_items.min.js': [
                        '../scripts/items.js',
                        '../scripts/main.js',
                        '../scripts/message.js'
                    ]
                }
            }
        },

        cssmin: {
            release: {
                files: {
                    '../release/<%= pkg.name %>_<%= pkg.version %>/style.css': [ '../style.css' ]
                }
            }
        },

        processhtml: {
            release: {
                files: {
                    '../release/<%= pkg.name %>_<%= pkg.version %>/index.html': [ '../index.html' ]
                }
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		replace: {
  			dist: {
				options: {
                    prefix: '//@@',
				  	variables: {
				  		'debugmode': '<%= grunt.file.read("js/source/debugmode.js") %>',
				    	'toolbar': '<%= grunt.file.read("js/source/toolbar.js") %>',
				    	'sectionToolbar': '<%= grunt.file.read("js/source/sectionToolbar.js") %>',
				    	'resizer': '<%= grunt.file.read("js/source/resizer.js") %>',
				    	'tooltip': '<%= grunt.file.read("js/source/tooltip.js") %>',
				    	'htmlInspector': '<%= grunt.file.read("js/source/htmlInspector.js") %>'
				  	}
				},
				files: [
					{src: ['js/source/main.js'], dest: 'js/dm.js'}
				]
			}
		},

		watch: {
		  	main: {
		    	files: 'js/source/*.js',
		    	tasks: ['runReplace'],
		    	options: {
                    nospawn: true
		    	}
		  	}
		}
	});

	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('runReplace', ['replace']);

	grunt.registerTask('runWatch', ['watch:main']);
};
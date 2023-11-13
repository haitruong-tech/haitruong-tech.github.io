module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      files: {
        expand: true,
        cwd: "src/",
        src: "**/*.js",
        dest: "build/",
      },
    },
    cssmin: {
      files: {
        expand: true,
        cwd: "src/",
        src: "**/*.css",
        dest: "build/",
      },
    },
    htmlmin: {
      options: {
        caseSensitive: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
      files: {
        expand: true,
        cwd: "src/",
        src: "**/*.html",
        dest: "build/",
      },
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "assets/**",
            dest: "build/",
          },
          {
            expand: true,
            src: "CNAME",
            dest: "build/",
          },
        ],
      },
      // CNAME: {
      //   files: ,
      // },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("default", ["uglify", "cssmin", "htmlmin", "copy"]);
};

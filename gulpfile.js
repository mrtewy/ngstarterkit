var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var htmlify = require('gulp-angular-htmlify');
var compressor = require('gulp-compressor');
var angularTemplateCache = require('gulp-angular-templatecache');
var addStream = require('add-stream');


var baseDirs = {
  root: './',
  dist: './dist/',
  app: './src/client/',
  rootSrcServer: './src/server/'
};

var publicDirs = {
  js: 'dist/js/',
  css: 'dist/css/',
  img: 'dist/images/'
};

var bowerComponentsDir = baseDirs.root + 'bower_components/';

// Bower components first!
var appFiles = {
  js: [
    bowerComponentsDir + 'jquery/dist/jquery.min.js', // source bower
    bowerComponentsDir + 'angular/angular.min.js', // source bower
    bowerComponentsDir + 'angular-route/angular-route.min.js', // source bower
    bowerComponentsDir + 'bootstrap/dist/js/bootstrap.min.js', // source bower
    // bowerComponentsDir + 'angular-ui-router/release/js/angular-ui-router.min.js', // source bower
    baseDirs.app + 'assets/js/*.js', // static js
    baseDirs.app + '*.js', // main app js
    baseDirs.app + '**/*.js', // controller, service js
  ],
  css: [
    bowerComponentsDir + 'bootstrap/dist/css/bootstrap.min.css', // source css
    baseDirs.app + 'assets/css/**/*.css' // 
  ],
  index: [
    baseDirs.app + 'views/index.html'
  ]
};

var concatFilenames = {
  js: 'all.min.js',
  css: 'all.min.css'
};

var startupScript = 'server.js';
 
function prepareTemplates() {
  return gulp.src(baseDirs.app+'views/**/*.html')
  	.pipe(htmlify())
    .pipe(minifyHTML({empty: true}))
    .pipe(angularTemplateCache({
      module:'appTemplates', 
      standalone: true, 
      root: 'views/'
    }));
}

gulp.task('clean', function() {
  return gulp.src(baseDirs.dist, {read: false}).pipe(clean());
});

gulp.task('dev:concatjs', function () {
  return gulp.src(appFiles.js)
    .pipe(uglify())
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(concat(concatFilenames.js))
    .pipe(gulp.dest(baseDirs.root + publicDirs.js));
});

gulp.task('dev:concatcss', function () {
  return gulp.src(appFiles.css)
    .pipe(minifyCss())
    .pipe(concat(concatFilenames.css))
    .pipe(gulp.dest(baseDirs.root + publicDirs.css));
});

gulp.task('dev:minifyhtml', function() {
  var filesToMove = [
      baseDirs.app+'views/index.html',
    ];
  return gulp.src(filesToMove, { base: baseDirs.app +'views/' })
    .pipe(htmlify())
    .pipe(minifyHTML({empty: true}))
    .pipe(gulp.dest(baseDirs.dist))
});

gulp.task('nodemon', function () {
  nodemon({
      script: baseDirs.root + startupScript,
      ext: 'js',
      ignore: [
        baseDirs.app + '/'
      ]
    })
    .on('restart', function () {
      console.log('Magic restarted');
    });
});

gulp.task('livereload', ['dev:concatjs', 'dev:concatcss'], function () {
  return gulp.src(appFiles.index)
    .pipe(livereload());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch([
      appFiles.js,
      appFiles.css
    ], ['livereload'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('dist:minifycss', function() {
  return gulp.src(baseDirs.app + publicDirs.css + concatFilenames.css)
    .pipe(minifyCss())
    .pipe(gulp.dest(baseDirs.dist + publicDirs.css));
});

gulp.task('dist:minifyjs', function() {
  return gulp.src(baseDirs.app + publicDirs.js + concatFilenames.js)
    .pipe(uglify())
    .pipe(gulp.dest(baseDirs.dist + publicDirs.js));
});

gulp.task('watch', ['dev:concatjs', 'dev:concatcss', 'dist:minifycss', 'dist:minifyjs','dev:minifyhtml', 'nodemon', 'watch']);
gulp.task('default', ['dev:concatjs', 'dev:concatcss', 'dist:minifycss', 'dist:minifyjs', 'dev:minifyhtml']);
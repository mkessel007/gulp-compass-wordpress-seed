// include gulp
var 	gulp 		= require('gulp') 
 
// include plug-ins
,	jshint 		= require('gulp-jshint')
,	changed 	= require('gulp-changed')
,	imagemin 	= require('gulp-imagemin')
,	rjs 		= require('gulp-requirejs')
,	concat 		= require('gulp-concat')
,	stripDebug 	= require('gulp-strip-debug')
, 	compass		= require('gulp-compass')
,	uglify 		= require('gulp-uglify')
,	autoprefix 	= require('gulp-autoprefixer')
,	minifyCSS 	= require('gulp-minify-css')
;
 
 
// JS hint task
gulp.task('jshint', function() {
	gulp.src(['./js/*.js', './js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './img/*',
      imgDst = './min/image';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

gulp.task('requirejsBuild', function() {
    rjs({
        baseUrl: '.',
	include: 'js/main',
        out: 'r.js',
	paths : {
		jquery : 'component/jquery/dist/jquery',
		underscore : 'component/underscore/underscore',
		backbone : 'component/backbone/backbone',
		bootstrap_slider : 'component/seiyria-bootstrap-slider/js/bootstrap-slider'
	},
        shim: {
		'backbone': {
		    //These script dependencies should be loaded before loading
		    //backbone.js
		    deps: ['underscore', 'jquery'],
		    //Once loaded, use the global 'Backbone' as the
		    //module value.
		    exports: 'Backbone'
		},
		'underscore': {
		    exports: '_'
		},
        }
        // ... more require.js options
    })
        .pipe(gulp.dest('./min/js')); // pipe it to the output DIR
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('min/js/r.js')//['./js/main.js', './js/*.js', './js/**/*.js'])
    .pipe(concat('app.js'))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(gulp.dest('./min/js'));
});

// Process compass scss to css
gulp.task('compass', function() {
  gulp.src('./scss/*.scss')
  .pipe(compass({
    config_file: './config.rb',
    css: 'css',
    sass: 'scss'
  }))
  .pipe(gulp.dest('./css'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./css/screen.css', './css/base.css', './css/ie.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./min/css'));
});


// default task
gulp.task('default', ['imagemin', 'requirejsBuild', 'scripts', 'compass', 'styles'], function() {

  // watch for JS changes
  gulp.watch('./js/*.js', ['jshint', 'requirejsBuild', 'scripts']);
 
  // watch for CSS changes
  gulp.watch('./scss/*.scss', ['compass']);
  gulp.watch('./css/*.css', ['styles']);

});

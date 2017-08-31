var gulp = require('gulp');
var sass = require('gulp-sass');
var npmDist = require('gulp-npm-dist');


gulp.task('sass', function() {
  return gulp.src('app/scss/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
});


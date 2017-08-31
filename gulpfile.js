var gulp = require('gulp');
var sass = require('gulp-sass');
var npmDist = require('gulp-npm-dist');


gulp.task('sass', function() {
  return gulp.src('app/scss/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
});

// Copy dependencies to ./public/libs/
gulp.task('copy-npm-dependencies', function() {
  gulp.src(npmDist(), {base:'./node_modules'})
    .pipe(gulp.dest('./public/libs'));
});

var del = require('del');
var gulp = require("gulp");
var concat = require("gulp-concat");
var gutil = require("gulp-util");
var babel = require("gulp-babel");
var nodemon = require("gulp-nodemon");
var sass = require('gulp-ruby-sass');

/*    Server
 */
gulp.task("server:config", function () {
  return gulp.src('src/config/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/config"));
});

gulp.task("develop", function() {
  nodemon({script: './bin/www', ext: 'js hjs json', legacyWatch: true});
});

gulp.task("server:feeder", function () {
  return gulp.src('src/feeder/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/feeder"));
});

gulp.task("server:models", function () {
  return gulp.src('src/models/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/models"));
});

gulp.task("server:routes", function () {
  return gulp.src('src/routes/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/routes"));
});

gulp.task('build:server', [
  'server:config',
  'server:feeder',
  'server:models',
  'server:routes'
]);

/*    Web App
 */
gulp.task('app:sass', function() {
  return sass('src/public/sass/base.sass')
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/public/css'));
});

gulp.task('app:main', function() {
  return gulp.src('src/public/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/public/js"));
});

gulp.task('build:app', ['app:main', 'app:sass']);

gulp.task("watch", function() {
  gulp.watch('src/config/*.js', ['server:config']);
  gulp.watch('src/feeder/*.js', ['server:feeder']);
  gulp.watch('src/models/*.js', ['server:models']);
  gulp.watch('src/routes/*.js', ['server:routes']);
  gulp.watch('src/public/js/*.js', ['app:main']);
  gulp.watch('src/public/sass/base.sass', ['app:sass']);
});

gulp.task('clean', function(callback) {
  return del(['dist'], callback);
});

gulp.task('build', ['clean'], function() {
  gulp.run(['build:server', 'build:app', 'watch', 'develop']);
});

gulp.task('default', ['build']);

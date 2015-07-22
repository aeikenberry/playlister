var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("build", function () {
  return gulp.src(["pitchfork.js", "app.js", "spotify.js"])
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function() {
  gulp.watch('*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);

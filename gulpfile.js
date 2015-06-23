var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src(["pitchfork.js", "app.js", "spotify.js"])
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

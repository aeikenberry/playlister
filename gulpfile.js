var gulp = require("gulp");
var gutil = require("gulp-util");
var babel = require("gulp-babel");
var webpack = require("webpack");

gulp.task("build", function () {
  return gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task('app:build', function(done) {
  webpack({
    entry: {
      Playlister: './public/js/src/entry.js'
    },
    target: 'web',
    debug: false,
    cache: true,
    output: {
      path: './public/js/playlister',
      filename: '[name].js'
    },
    resolve: {
      modulesDirectories: ['node_modules']
    },
    module: {
      loaders: [
        {test: /.*\.js$/, loader: 'jsx-loader'}
      ]
    },
  }, function(error, stats) {
    if (error) {
      throw new gutil.PluginError('webpack', error);
    }
    gutil.log(stats.toString({colors: true}));
    done();
  });
});

gulp.task("watch", function() {
  gulp.watch('src/*.js', ['build']);
  gulp.watch('public/js/src/apps/**/*.js', ['app:build']);
});

gulp.task('default', ['build', 'app:build', 'watch']);

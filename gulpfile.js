var gulp = require("gulp");
var gutil = require("gulp-util");
var babel = require("gulp-babel");
var sass = require('gulp-sass');
var webpack = require("webpack");

var PRODUCTION = process.env.NODE_ENV === 'production';

gulp.task("build", function () {
  return gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task('app:sass', function() {
  return gulp.src('public/sass/*.sass')
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('public/css'));
});

gulp.task('app:js', function(callback) {
  var config = {
    entry: {
      'Playlister': __dirname + '/public/js/src/entry.js',
      'vendor': [
        'lodash',
        'marty',
        'react/addons'
      ],
    },
    module: {
      loaders: [
        {
            test: /\.jsx|\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
      new webpack.optimize.DedupePlugin()
    ],
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.jsx', '.js', '.json']
    },
    output: {
      path: __dirname + '/public/js/playlister',
      filename: '[name].js',
    }
  };

  if (PRODUCTION) {
    config.bail = true;
    config.debug = false;
    config.profile = false;
    config.output.pathInfo = false;
    config.devtool = '#source-map';
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        mangle: {
          except: ['require', 'export', '$super']
        },
        compress: {
          warnings: false,
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      }),
      new CompressionPlugin({
        asset: "{file}.gz",
        algorithm: "gzip",
        regExp: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]);
  };

  webpack(config, function(error, stats) {
    if (error) {
      throw new gutil.PluginError('webpack', error);
    }
    gutil.log(stats.toString({colors: true}));
    callback();
  })
});

gulp.task('app:build', ['app:js', 'app:sass']);

gulp.task("watch", function() {
  gulp.watch('src/*.js', ['build']);
  gulp.watch('public/js/src/apps/**/*.js', ['app:js']);
  gulp.watch('public/sass/*.sass', ['app:sass']);
});

gulp.task('default', ['build', 'app:build', 'watch']);

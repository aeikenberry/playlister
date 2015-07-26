var gulp = require("gulp");
var gutil = require("gulp-util");
var babel = require("gulp-babel");
var sass = require('gulp-sass');
var webpack = require("webpack");

var PRODUCTION = process.env.NODE_ENV === 'production';

/*    Server
 */
gulp.task("server:config", function () {
  return gulp.src('src/config/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/config"));
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
  return gulp.src('src/public/sass/*.sass')
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/public/css'));
});

gulp.task('app:Playlister', function(callback) {
  var config = {
    entry: {
      'Playlister': __dirname + '/src/public/js/playlister-main.js',
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
      path: __dirname + '/dist/public/js/playlister',
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

gulp.task('app:main', function() {
  return gulp.src('src/public/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist/public/js"));
});

gulp.task('build:app', ['app:Playlister', 'app:main', 'app:sass']);

gulp.task("watch", function() {
  gulp.watch('src/config/*.js', ['server:config']);
  gulp.watch('src/feeder/*.js', ['server:feeder']);
  gulp.watch('src/models/*.js', ['server:models']);
  gulp.watch('src/routes/*.js', ['server:routes']);
  gulp.watch('src/public/js/*.js', ['app:main']);
  gulp.watch('src/public/js/Playlister/**/*.js', ['app:Playlister']);
  gulp.watch('src/public/sass/*.sass', ['app:sass']);
});

gulp.task('build', ['build:server', 'build:app']);
gulp.task('default', ['build', 'watch']);

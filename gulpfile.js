var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    argv = require('yargs').argv,
    url = require('url'),
    proxy = require('proxy-middleware'),
    preprocess = require('gulp-preprocess'),
    strip = require('gulp-strip-debug'),c
    shell = require('gulp-shell'),
    svgstore = require('gulp-svgstore'),
    cheerio = require('gulp-cheerio'),
    svgmin = require('gulp-svgmin'),
    path = require('path'),
    del = require('del'),
    fs = require('fs')

// Static server with proxy
gulp.task('default', ['build', 'sass:watch', 'preprocess:watch'], function () {
  browserSync.init({
    port: 8888,
    files: ["*.html", "src/lib/**"],
    server: {
      baseDir: ["./dist", "./"]
    },
    open: false,
    notify: false,
    inject: true
  })
})
 
gulp.task('sass', ['clean'], function () {
  return gulp.src('./src/assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(minify())
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.stream())
});
 
gulp.task('sass:watch', ['sass'], function () {
  gulp.watch('./src/assets/sass/**/*.scss', ['sass'])
})

gulp.task('preprocess', ['svg'], function() {
  return gulp.src('./src/*.html')
    .pipe(preprocess({context: { NODE_ENV: argv.production ? 'production' : 'development'}}))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('preprocess:watch', ['preprocess'], function() {
  gulp.watch('./src/*.html', ['preprocess'])
})

gulp.task('js', ['clean'], function() {
  if(argv.production) {
    return gulp.src('')
      .pipe(shell([
        'jspm bundle-sfx ./src/lib/main ./dist/assets/js/main.js --minify --skip-source-maps'
      ]))
  }
})

gulp.task('debug', ['js'], function() {
  return gulp.src('./dist/assets/js/*.js')
    .pipe(strip())
    .pipe(gulp.dest('./dist/assets/js/'))
})

gulp.task('svg', ['clean'], function () {
    return gulp.src('./src/assets/svg/*.svg')
      .pipe(svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative))
        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
        }]
      }
    }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgstore({inlineSvg: true}))
  .pipe(gulp.dest('./src/assets/svg'))
})

gulp.task('copy', ['clean', 'sass', 'js', 'svg', 'debug'], function() {
  var files = [
    'src/media/**/*',
    'src/assets/images/**/*',
    'src/favicon.ico',
    'src/apple-touch-icon.png'
  ]
  if(!argv.production) {
    files.push('src/lib/**/*')
  }
  gulp.src(files, { base: './src' })
    .pipe(gulp.dest('./dist/'))
})

gulp.task('clean', function(cb) {
  del(['./dist/**/*',], cb)
})

gulp.task('build', ['clean', 'sass', 'js', 'svg', 'copy', 'preprocess'])

// Imgur tasks
var request = require('request'),
    imgurCredentials = require('./credentials-imgur.js')

gulp.task('imgur:create', function () {
  return request({
    url: "https://api.imgur.com/3/album/",
    method: 'post',
    headers: {
      'Authorization': 'Client-ID ' + imgurCredentials.clientId
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body)
      console.log("Album ID: " + data.data.id)
      console.log("Album deletehash: " + data.data.deletehash)
    }
  })
})

'use strict';
var file, msg = '**/*-test.js';
process.argv.forEach(function (val, index, array) {
    if (val === '-file' || val === '--f') {
        let env_val = array[index + 1];
        msg = '**/*' + env_val+ '*-test.js';
        file = env_val;
    }
});

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    appRoot = process.cwd(),
    paths = {
        js: [
            appRoot + '/index.js',
            appRoot + '/lib/**/*.js'
        ],
        jsTests: [appRoot + '/test/**/*-test.js']
    };

var defaultTasks = ['env:development', 'dev:eslint', 'dev:mocha', 'watch'];

gulp.task('env:development', function () {
    process.env.NODE_ENV = 'development';
    console.log('use => load tests: ', msg);
});

gulp.task('dev:eslint', function () {
    return gulp.src(paths.js.concat(paths.jsTests))
        .pipe(plugins.plumber())
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
});


gulp.task('dev:mocha', ['dev:eslint'], function () {
    let jsTests = '/test/**/' + (file ? '*'+file : '' ) +  '*-test.js';
    return gulp.src(appRoot + jsTests)
        .pipe(plugins.plumber())
        .pipe(plugins.mocha({
            reporters: 'spec'
        }));
});

gulp.task('watch', ['dev:mocha'], function () {
    gulp.watch(paths.js.concat(paths.jsTests), ['dev:eslint', 'dev:mocha'])
        .on('error', e => console.error(e));
});

gulp.task('development', defaultTasks);
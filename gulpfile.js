/**
 * Gulp automation
 */

'use strict';

const gulp = require('gulp');
const copy = require('copy');
const Async = require('async');

const functions = [
    'request-create'
];

gulp.task('copy:shared', done => {

    Async.each(functions, (func, cb) => copy('shared/**.js', `./${func}/shared`, cb), done);
});

gulp.task('copy', gulp.parallel(['copy:shared']));
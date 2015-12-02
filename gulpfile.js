var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var shell = require('gulp-shell');
var replace = require('gulp-replace');
var glob = require('glob');
var dtsGenerator = require('dts-generator').default;

gulp.task('clean', function (cb) {
    return del(['./build/**'], cb);
});

gulp.task('compile', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            './node_modules/.bin/tsc'
        ]));
});

gulp.task('package-files', function() {
    return gulp.src('./build/es5/src/**/*')
        .pipe(gulp.dest('./build/package'));
});

gulp.task('package-prepare-package-json', function() {
    return gulp.src('./package.json')
        .pipe(replace('"private": true,', '"private": false,'))
        .pipe(gulp.dest('./build/package'));
});

gulp.task('package-readme-md', function() {
    return gulp.src('./README.md')
        .pipe(replace(/```typescript([\s\S]*?)```/g, '```javascript$1```'))
        .pipe(gulp.dest('./build/package'));
});

gulp.task('package-generate-dts', function () {
    glob('./src/**/*.ts', function(err, files) {
        var name = require('./package.json').name;
        dtsGenerator({
            name: name,
            baseDir: './src',
            files: files,
            out: './build/package/' + name + '.d.ts'
        });
    });
});

gulp.task('package', function(cb) {
    return runSequence(
        'clean',
        'compile',
        ['package-files', 'package-prepare-package-json', 'package-readme-md', 'package-generate-dts'],
        cb
    );
});
var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var plumber = require('gulp-plumber');
var ts = require('gulp-typescript');
var dtsGenerator = require('dts-generator');
var exec = require('gulp-exec');

gulp.task('clean', function (cb) {
    return del(['./built/**'], cb);
});

gulp.task('compile', function() {
    var tsProject = ts.createProject('tsconfig.json', {
        sortOutput: true,
        typescript: require('typescript')
    });
    return tsProject.src()
        .pipe(plumber())
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./built/es5'));
});

gulp.task('tsd', function() {
    return gulp.src('./')
        .pipe(exec('./node_modules/.bin/tsd install'))
        .pipe(exec('./node_modules/.bin/tsd rebundle'))
        .pipe(exec('./node_modules/.bin/tsd link'))
        .pipe(exec.reporter());
});

gulp.task('build-package-copy-src', function() {
    return gulp.src('./built/es5/src/**/*')
        .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-copy-package-json', function() {
    return gulp.src('./package.json')
        .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-generate-dts', function () {
    var name = require('./package.json').name;
    dtsGenerator.generate({
        name: name,
        baseDir: './src',
        files: [
            './src/ActionMetadata.ts',
            './src/ActionRegistry.ts',
            './src/Annotations.ts',
            './src/ControllerMetadata.ts',
            './src/ControllerUtils.ts',
            './src/ExtraParamMetadata.ts'
        ],
        out: './built/package/' + name + '.d.ts'
    });
});

gulp.task('build', function(cb) {
    return runSequence(
        'clean',
        'tsd',
        'compile',
        cb
    );
});

gulp.task('package', function(cb) {
    return runSequence(
        'build',
        ['build-package-copy-src', 'build-package-copy-package-json', 'build-package-generate-dts'],
        cb
    );
});

gulp.task('default', ['build']);
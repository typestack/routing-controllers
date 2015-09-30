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
        .js.pipe(gulp.dest('.'));
});

gulp.task('generate-dts', function () {
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
        out: './' + name + '.d.ts'
    });
});

gulp.task('tsd', function() {
    return gulp.src('./')
        .pipe(exec('./node_modules/.bin/tsd install'))
        .pipe(exec('./node_modules/.bin/tsd rebundle'))
        .pipe(exec.reporter());
});

gulp.task('default', function(cb) {
    return runSequence(
        'clean',
        'tsd',
        ['compile', 'generate-dts'],
        cb
    );
});
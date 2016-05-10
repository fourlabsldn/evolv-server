const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jshintReporter = require('jshint-stylish');
const shell = require('gulp-shell');
const open = require('gulp-open');
const os = require('os');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');

const paths = {
	src: [
		'./models/**/*.js',
		'./routes/**/*.js',
		'keystone.js',
		'package.json'
	],
	style: {
		src: [
			'./front-end-src/scss/**/*.scss',
			'./public/styles/**/*.scss'
		],
		dest: './public/styles/'
	},
	js: {
		src: [
			'./front-end-src/js/**/*.js',
			'!./front-end-src/js/**/_*.*',
			'!./front-end-src/js/**/_*/*'
		],
		dest: './public/js/'
	},
	assets: {
		src: './front-end-src/assets/**/*.*',
		dest: './public/assets/'
	},
	img: {
		src: './front-end-src/img/**/*.*',
		dest: './public/img/'
	}
};

// gulp lint
gulp.task('lint', () => {
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// gulp watcher for lint
gulp.task('watch:lint', () => {
	gulp.watch(paths.src, ['lint']);
});


gulp.task('watch:sass', () => {
	gulp.watch(paths.style.src, ['sass']);
});

gulp.task('sass', () => {
	gulp.src(paths.style.src)
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(postcss([autoprefixer({ browsers: ['last 15 versions'] })]))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.style.dest));
});


gulp.task('rollup', () => {
  gulp.src(paths.js.src)
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
			babel({ exclude: 'node_modules/**', presets: ['es2015-rollup'] })
		] }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch:rollup', () => {
	gulp.watch(paths.js.src, ['rollup']);
});

gulp.task('assets', () => {
	gulp.src(paths.assets.src)
	.pipe(gulp.dest(paths.assets.dest));
});

gulp.task('watch:assets', () => {
	gulp.watch(paths.js.src, ['assets']);
});

gulp.task('img', () => {
	gulp.src(paths.img.src)
	.pipe(gulp.dest(paths.img.dest));
});

gulp.task('watch:img', () => {
	gulp.watch(paths.js.src, ['img']);
});

gulp.task('runKeystone', shell.task('node keystone.js'));
gulp.task('watch', [
  'watch:sass',
  'watch:lint',
	'watch:rollup',
	'watch:assets',
	'watch:img'
]);

gulp.task('open', () => {
	const platform = os.platform;
	let browserName;
	switch (platform) {
		case 'darwin': // OSX
			browserName = 'google chrome';
			break;
		case 'win32': // Windows
			browserName = 'chrome';
			break;
		default: // linux
			browserName = 'google-chrome';
	}
	gulp.src(__filename)
	.pipe(open({
		uri: 'http://localhost:3000',
		app: browserName
	}));
});

gulp.task('default', ['rollup', 'watch', 'runKeystone', 'open']);
gulp.task('build-watch', ['rollup', 'sass', 'assets', 'img', 'watch']);

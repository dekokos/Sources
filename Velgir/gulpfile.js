var config = {
	srcDir: 'app',
	sassPattern: 'sass/**/*.scss',
	jsDir: 'app/js'
};

var gulp           = require('gulp'),
		sass         	 = require('gulp-sass'),
		autoprefixer 	 = require('gulp-autoprefixer'),
		sourcemaps 		 = require('gulp-sourcemaps'),
		concat         = require('gulp-concat'),
		cleanCSS			 = require('gulp-clean-css'),
		uglify				 = require('gulp-uglify'),
		plumber				 = require('gulp-plumber'),
		notify				 = require('gulp-notify'),
		imagemin		 	 = require('gulp-imagemin'),
		pngquant		 	 = require('imagemin-pngquant'),
		browserSync    = require('browser-sync'),
		del            = require('del'),
		rename         = require('gulp-rename'),
		cache          = require('gulp-cache');
		
gulp.task('sass', function() {
	// return gulp.src(['app/sass/**/*.sass', 'app/sass/**/*.scss'])
	return gulp.src(config.srcDir+'/'+config.sassPattern)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', notify.onError()))//({outputStyle: 'compressed'}) nested-вложенный по умолч/expanded-развернутый/compact-компактный(селектор и св-ва в 1 строку)/compressed-сжатый...on('error', sass.logError))-при ошибке не нужно перезагружать команду и будет видно в какой строке sass-файла ошибка, sass.logError
		// .pipe(concat('main.css'))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.srcDir + '/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('common-js', function() {
	return gulp.src([
		config.jsDir + '/common.js',
		])
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(config.jsDir));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		// 'app/libs/jquery/dist/jquery.min.js',
		config.srcDir + '/libs/jquery/jquery-3.2.1.min.js',
		config.srcDir + '/libs/owlcarousel/owl.carousel.min.js',
		config.jsDir + '/common.min.js' // Всегда в конце
		])
	.pipe(plumber())
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest(config.jsDir))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('imagemin', function() {
	return gulp.src(config.srcDir + '/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: config.srcDir
		},
		notify: true,//false
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch(config.srcDir + '/' + config.sassPattern, ['sass']);
	gulp.watch(['libs/**/*.js', config.jsDir + '/common.js'], ['js']);
	gulp.watch(config.srcDir + '/*.html', browserSync.reload);
});

gulp.task('build', ['imagemin', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		config.srcDir + '/*.html',
		config.srcDir + '/.htaccess'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		config.srcDir + '/css/main.min.css',
		config.srcDir + '/css/normalize.css'
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		config.jsDir + '/scripts.min.js'
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		config.srcDir + '/fonts/**/*'
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('clean', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
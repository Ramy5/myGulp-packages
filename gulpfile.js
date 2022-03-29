var gulp = require("gulp"), // to import gulp from gulp modules
    concat = require("gulp-concat"), // to concat files
    prefix = require("gulp-autoprefixer"), // for add prefixes to css
    sass = require("gulp-sass")(require("sass")), // for compile sass to css
    pug = require("gulp-pug"), // for compile pug to html
    livereload = require("gulp-livereload"), // to make live reload 
    sourcemaps = require("gulp-sourcemaps"), // to make a map so we can find selector easier
    uglify = require("gulp-uglify"), // to minify js file 
    notify = require("gulp-notify"), // to make notification on every changes
    zip = require("gulp-zip"), // to compress your file (last step)
    plumber = require('gulp-plumber'); // to escape error 

// css task 
gulp.task("css", async function () {
    return gulp.src("project/css/main.scss")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(prefix("last 2 version"))
        .pipe(concat("all.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css"))
        .pipe(notify("css file has been changed"))
        .pipe(livereload())
})

// js task 
gulp.task("js", async function () {
    return gulp.src("project/js/*.js")
        .pipe(plumber())
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
        .pipe(notify("js file has been changed"))
        .pipe(livereload())
})

// html task 
gulp.task("html", async function () {
    require("./server.js")
    return gulp.src("project/index.pug")
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("dist"))
        .pipe(notify("html file has been changed"))
        .pipe(livereload())
})

// compress file 
gulp.task("compress", async function () {
    return gulp.src("dist/**/*.*")
        .pipe(zip("website.zip"))
        .pipe(gulp.dest("."))
        .pipe(notify("Your project has been compressed."))
})

// watch all files 
gulp.task("watch", async function () {
    require("./server.js")
    livereload.listen()
    gulp.watch("project/css/**/*.scss", gulp.series("css"))
    gulp.watch("project/**/*.pug", gulp.series("html"))
    gulp.watch("project/js/*.js", gulp.series("js"))
    gulp.watch("dist/**/*.*", gulp.series("compress"))
})

// default task 
gulp.task("default", gulp.series("watch"))

// for vinyl-ftp 
// gulp.task( 'deploy', function () {

//     var conn = ftp.create( {
//         host:     'mywebsite.tld',
//         user:     'me',
//         password: 'mypass',
//         parallel: 10
//     } );

//     // using base = '.' will transfer everything to /public_html correctly
//     // turn off buffering in gulp.src for best performance

//     return gulp.src( ["dist/**/*.*"], { base: '.', buffer: false } )
//         .pipe( conn.newer( '/public_html' ) ) // only upload newer files
//         .pipe( conn.dest( '/public_html' ) );

// } );
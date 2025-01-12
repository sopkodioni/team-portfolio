import gulp from 'gulp'
import * as sassLib from 'sass'
import gulpSass from 'gulp-sass'
import cssnano from 'cssnano'
import autoprefixer from 'gulp-autoprefixer'
import rename from 'gulp-rename'
import browserSync from 'browser-sync'
import imagemin from 'gulp-imagemin'
import clean from 'gulp-clean'
import postCss from 'gulp-postcss'
import mergeCssRules from 'postcss-merge-rules'

const sass = gulpSass(sassLib)
const bsc = browserSync.create()

export const htmlHandler = () => {
    return gulp.src('./src/*.html')
                .pipe(gulp.dest('./build'))
}

export const cssHandler = async () => {
    const postCssPlugins = [
        mergeCssRules(), 
        cssnano()
    ]

    return gulp.src('./src/styles/main.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(postCss(postCssPlugins))
                .pipe(autoprefixer({cascade: false}))
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('./build/styles'))
}

export const imgHandler = () => {
    return gulp.src('./src/images/*', {encoding: false})
                .pipe(imagemin())
                .pipe(gulp.dest('./build/images'))
}

export const fontsHandler = () => {
    return gulp.src('./src/fonts/**/*', {encoding: false}).pipe(gulp.dest('./build/fonts'))
}

export const cleaner = () => {
    return gulp.src('./build', {allowEmpty: true}).pipe(clean())
}

export const buildProject = gulp.series(cleaner, gulp.parallel(htmlHandler, cssHandler, imgHandler, fontsHandler))
 
export const browserSyncStart = () => {
    bsc.init({
        server: {
            baseDir: './build'
        }
    })
    
    gulp.watch('./src/**/*', buildProject)
    gulp.watch('./src/**/*').on('change', browserSync.reload) 
}

export const startDev = () => {
    const buildAndStartBsc = gulp.series(buildProject, browserSyncStart)
    buildAndStartBsc()
}

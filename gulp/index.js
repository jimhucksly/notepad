const gulp = require('gulp')
const zip = require('gulp-zip')
const { name } = require('../package.json')
const p = require('path')

function run() {
  const location = p.join(__dirname, '../')
  const src = location + '/build/*.exe'
  return gulp.src(src)
    .pipe(zip(`${name}.zip`))
    .pipe(gulp.dest(location))
}

run()

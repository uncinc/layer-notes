import fs from 'fs';
import gulp from 'gulp';
import {
  merge
} from 'event-stream';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import preprocessify from 'preprocessify';
import gulpif from 'gulp-if';

const $ = require('gulp-load-plugins')();

//Get the vars that are past in the gulp run
var production = process.env.NODE_ENV === 'production';
var target = process.env.TARGET || 'chrome';
var environment = process.env.NODE_ENV || 'development';

//Get from the vars the specific JSON file. So these configs are now in these vars
var generic = JSON.parse(fs.readFileSync(`./config/${environment}.json`));
var specific = JSON.parse(fs.readFileSync(`./config/${target}.json`));
var context = Object.assign({}, generic, specific);

var manifest = {
  //Add this to the manifest file So the livereload scritpt is also enqluded in the development
  dev: {
    'background': {
      'scripts': [
        'scripts/livereload.js',
        'scripts/background/index.js'
      ]
    }
  },

  firefox: {
    'applications': {
      'gecko': {
        'id': 'layernotes@uncinc.nl',
        'strict_min_version': '48.0',
      }
    }
  }
};

//this are the sizes of the icons
const pluginIconConfig = [{
  width: 16,
  rename: {
    suffix: '-16'
  }
}, {
  width: 19,
  rename: {
    suffix: '-19'
  }
}, {
  width: 38,
  rename: {
    suffix: '-38'
  }
}, {
  width: 48,
  rename: {
    suffix: '-48'
  }
}, {
  width: 96,
  rename: {
    suffix: '-96'
  }
}, {
  width: 128,
  rename: {
    suffix: '-128'
  }
}];

// Tasks
gulp.task('clean', () => {
  return pipe(`./build/${target}`, $.clean());
});

//Build the exention
gulp.task('build', (cb) => {
  $.runSequence('clean', 'styles', 'icons', 'sprites', 'ext', 'copy-fonts', 'copy-react', 'copy-react-dom', cb);
});

gulp.task('watch', ['build'], () => {
  //start live reload
  $.livereload.listen();

  gulp.watch(['./src/icons/**/*']).on('change', () => {
    $.runSequence('icons', $.livereload.reload);
  });
  gulp.watch(['./src/scripts/**/*']).on('change', () => {
    $.runSequence('js', $.livereload.reload);
  });
  gulp.watch(['./src/styles/**/*']).on('change', () => {
    $.runSequence('styles', $.livereload.reload);
  });
});

//The defualt task
gulp.task('default', ['build']);

//Merge the vars and the manifest file
gulp.task('ext', ['manifest', 'js'], () => {
  return mergeAll(target);
});

// ----------------
// IMAGES
// ________________
gulp.task('icons', function () {
  return gulp.src('./src/icons/*.{jpg,png}')
    .pipe($.responsive({
      '*': pluginIconConfig
    }, {
      quality: 95,
      progressive: true,
      compressionLevel: 6,
      withMetadata: false
    }))
    .pipe(gulp.dest(`./build/${target}/icons`));
});

// ----------------
// sprites
// Create a sprite form al the SVG's in the folder
// ________________
gulp.task('sprites', function () {
  return gulp.src('./src/images/sprite/*.svg')
    .pipe($.svgSprites({
      cssFile: '../../../src/styles/modules/_sprites.scss', //Place the file here
      //Add the exention css file path to the path of the svg in the generated css file
      svgPath: `${context.cssFilePath}images/%f`,
      pngPath: `${context.cssFilePath}images/%f`,
      common: 'ln-icon', //this is the main class
      selector: 'ln-%f', // Add the name space 'ln-' in the generated icon classes
      svg: {
        sprite: 'sprite.svg' //this is the name of the svg
      },
      baseSize: 16, //the base size in px
      preview: false //Do not generate a previeuw html
    }))
    .pipe(gulp.dest(`./build/${target}/images`));
});

// -----------------
// COMMON
// -----------------
gulp.task('js', () => {
  return buildJS(target);
});

gulp.task('styles', () => {
  return gulp.src([`src/styles/index.${target}.scss`])
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.concat('index.css'))
    .pipe(gulp.dest(`build/${target}/styles`));
});

//change the manifest
gulp.task('manifest', () => {
  return gulp.src('./manifest.json') //generate the manifest file
    .pipe(gulpif(!production, $.mergeJson({
      fileName: 'manifest.json',
      jsonSpace: ' '.repeat(2),
      endObj: manifest.dev
    })))
    .pipe(gulpif(target === 'firefox', $.mergeJson({
      fileName: 'manifest.json',
      jsonSpace: ' '.repeat(2),
      endObj: manifest.firefox
    })))
    .pipe(gulp.dest(`./build/${target}`));
});



// -----------------
// COPY REACT
// -----------------
// Copy react.js and react-dom.js to assets/js/src/vendor
// only if the copy in node_modules is 'newer'
gulp.task('copy-react', function () {
  return gulp.src('node_modules/react/cjs/react.development.js')
    .pipe($.newer('./src/scripts/vendor/react.min.js'))
    .pipe(gulp.dest('./src/scripts/vendor/'));
});

gulp.task('copy-react-dom', function () {
  return gulp.src('node_modules/react-dom/dist/react-dom.min.js')
    .pipe($.newer('./src/scripts/vendor/react-dom.min.js'))
    .pipe(gulp.dest('./src/scripts/vendor/'));
});

//copy the fonts to the right folder
gulp.task('copy-fonts', function () {
  return gulp.src('./src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(`./build/${target}/fonts`));
});

// -----------------
// DIST
// -----------------
gulp.task('dist', (cb) => { // generate a zip
  $.runSequence('build', 'zip', cb);
});

gulp.task('zip', () => {
  return pipe(`./build/${target}/**/*`, $.zip(`${target}.zip`), './dist');
});


// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string';
    return stream.pipe(isDest ? gulp.dest(transform) : transform);
  }, gulp.src(src));
}

function mergeAll(dest) {
  return merge(
    // pipe('./src/icons/**/*', `./build/${dest}/icons`),
    pipe(['./src/_locales/**/*'], `./build/${dest}/_locales`),
    pipe([`./src/images/${target}/**/*`], `./build/${dest}/images`),
    pipe(['./src/images/shared/**/*'], `./build/${dest}/images`),
    pipe(['./src/**/*.html'], `./build/${dest}`)
  );
}

function buildJS(target) {
  const files = [{
      source: 'background/index.js',
      export: 'background/index.js'
    },
    {
      source: 'contentscript/index.js',
      export: 'contentscript/index.js'
    },
    {
      source: 'options.js',
      export: 'options.js'
    },
    {
      source: 'livereload.js',
      export: 'livereload.js'
    }
  ];

  let tasks = files.map(file => {
    return browserify({
        entries: 'src/scripts/' + file.source,
        debug: true
      })
      .transform('babelify', {
        presets: [
          'es2015',
          'stage-2',
          'react'
        ],
        plugins: [
          'transform-class-properties',
          'transform-es2015-modules-commonjs'
        ]
      })
      .transform(preprocessify, {
        includeExtensions: ['.js', '.jsx'],
        context: context
      })
      .bundle()
      .pipe(source(file.source))
      .pipe(buffer())
      .pipe(gulpif(!production, $.sourcemaps.init({
        loadMaps: true
      })))
      .pipe(gulpif(!production, $.sourcemaps.write('./')))
      .pipe(gulpif(production, $.uglify({
        'mangle': false,
        'output': {
          'ascii_only': true
        }
      })))
      .pipe(gulp.dest(`build/${target}/scripts`));
  });

  return merge.apply(null, tasks);
}

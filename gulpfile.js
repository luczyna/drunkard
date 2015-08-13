var pkg = require('./package.json');
var gulp = require('gulp');


// Auto load all gulp plugins
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();
// Load common utilities for gulp
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);


// Use a product/development switch.
//   run `gulp --production`
var type = gutil.env.production ? 'production' : 'development';
gutil.log( 'Building for', gutil.colors.magenta(type) );
// gutil.beep();




//
// HERE LIES TASKS TO GET STUFF DONE
//

// Lint the code
gulp.task('jshint', function () {
    return gulp
        .src( pkg.paths.source.js )
        .pipe ( plug.plumber() )
        .pipe( plug.jshint()
            .on( 'error', gutil.log )
        )
        .pipe( plug.jshint.reporter('jshint-stylish') );
});

// Uglify the code
// Love the code
gulp.task('bundlejs', ['jshint'], function() {
    var bundlefile = pkg.name + ".js";
    var options = {newLine: ';'};

    return gulp
        .src( pkg.paths.source.js )
        .pipe( plug.sourcemaps.init() )
            // .pipe( plug.uglify() )
            .pipe( plug.concat(bundlefile, options) )
        .pipe( plug.sourcemaps.write() )
        .pipe( gulp.dest(pkg.paths.dest.js) );
});




// Compile SCSS to CSS
gulp.task('sass', function() {
    var bundlefile = pkg.name + ".css";
    var sassoptions = {
        includePaths: ['./src/app', './src/common']
    };

    return gulp
        .src( pkg.paths.source.sass )
        .pipe( plug.plumber(beerror) )
        .pipe( plug.sass(sassoptions)
            // .on( 'error', plug.sass.logError )
            // .on( 'error', gutil.log )
        )
        .pipe( gulp.dest(pkg.paths.dest.css) );
});

// Minify and bundle the CSS
gulp.task('minicss', function() {
    var minifile = pkg.name + ".min.css";
    return gulp
        .src( pkg.paths.dest.css )
        .pipe( plug.minifyCss() )
        .pipe( gulp.dest((pkg.paths.dest.css)) );
});



// Creating template cache
gulp.task('templatecache', function() {
    // log('Creating an AngularJS $templateCache');
    // gutil.log( 'Creating an AngularJS ', gutil.colors.blue('$templateCache') );
    var options = {
        moduleSystem: 'IIFE',
        module: 'drunkard.templates',
        standalone: true
    };

    return gulp
        .src( pkg.paths.source.html )
        .pipe( plug.angularTemplatecache(options) )
        .pipe(gulp.dest( pkg.paths.dest.base ));
});

// Write the index template
gulp.task('templatecompile', function() {
    var options = {
        scripts: pkg.includejs,
        style: ['content/drunkard.css']
    };
    return gulp
        .src( pkg.paths.source.base + 'index.html' )
        .pipe( plug.template(options) )
        .pipe( gulp.dest(pkg.paths.dest.base) );
});

// Copy necessary files
gulp.task('copy', function() {
    copyVendorFiles();
    copyAssetFiles();
});

function copyVendorFiles() {
    return gulp
        .src( pkg.vendor )
        .pipe( gulp.dest(pkg.paths.dest.vendor) );
}

function copyAssetFiles() {
    return gulp
        .src( pkg.paths.source.assets )
        .pipe (gulp.dest(pkg.paths.dest.css) );
}



// Remove all files from the output folders
gulp.task('clean', function(){
    return gulp
        .src( [
            pkg.paths.dest.base,
            pkg.paths.production
        ],
        {read: false}
        )
        .pipe( plug.clean({force: true}) );
});



// Create a server
gulp.task('server', function() {
    var arg = {
        path: './server.js'
    };
    plug.developServer.listen(arg);
});
// Restart the server
gulp.task('restartserver', function() {
    gulp
        .watch( 
            [ './server.js' ], 
            plug.developServer.restart
        );
});










//
// HERE LIES TASKS THAT MAKE THE STUFF GET DUN
//
// Default Task, start a watch
// var default_task;
// if (type === 'development') {
//     default_task = plug.sequence(
//         'clean',
//         ['bundlejs', 'sass', 'templatecompile'],
//         ['copy', 'server']
//     );
// } else {
//     default_task = plug.sequence(
//         'clean',
//         ['bundlejs', 'sass', 'minicss', 'templatecompile'],
//         ['copy', 'server']
//     );
// }
gulp.task('default', function (cb) {
    plug.sequence(
        'clean', 
        ['templatecache'],
        ['bundlejs', 'sass', 'templatecompile'], 
        ['copy', 'server'], 
        ['watch'], 
        cb
    );
    // gulp.start('watch');
});

gulp.task('watch', function() {
    // on scss change
    gulp
        .watch( pkg.paths.source.sass )
        .on('change', function() {
            gulp.start('sass');
        });

    // on js change
    gulp
        .watch( pkg.paths.source.js )
        .on('change', function() {
            gulp.start('bundlejs');
        });

    // on template changes
    gulp
        .watch( pkg.paths.source.html )
        .on('change', function(event) {
            gulp.start('templatecache');
            gulp.start('templatecompile');
        });
});








//error handler helper for plumber
function beerror (error) {
    gutil.log(gutil.colors.red(error.message));
    gutil.log('\n');
    this.emit('end');
}

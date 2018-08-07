'use strict';

const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
// const handlebars = require('handlebars');
const discoverPartials = require('metalsmith-discover-partials');
// const collections = require('metalsmith-collections');
// const permalinks = require('metalsmith-permalinks');
const assets = require('metalsmith-assets');
// const concat = require('metalsmith-concat');
// const cleanCSS = require('metalsmith-clean-css');
const serve = require('metalsmith-serve');
const watch = require('metalsmith-watch');

const dir = {
  base: __dirname + '/',
  //   lib: __dirname + '/lib/',
  source: './src/',
  dest: './build/'
};
const templateConfig = {
  engine: 'handlebars',
  directory: dir.source + 'layouts/',
  default: 'index.hbs'
};

metalsmith(dir.base)
  .clean(true)
  .metadata({
    site: {
      name: 'Fluid Self',
      description: 'Projects and book notes'
    }
  })
  .source(dir.source + 'html/')
  .destination(dir.dest)
  //   .use(
  //     collections({
  //       books: {
  //         pattern: dir.source + 'html/books/**/*',
  //         // sortBy: 'title',
  //         // reverse: false,
  //         refer: false
  //       }
  //     })
  //   )
  .use(markdown())
  //   .use(
  //     permalinks({
  //       relative: false,
  //       pattern: ':title'
  //     })
  //   )
  .use(
    discoverPartials({
      directory: dir.source + 'partials/'
    })
  )
  .use(layouts(templateConfig))
  .use(
    serve({
      port: 3000,
      verbose: true
    })
  )
  .use(
    watch({
      paths: {
        'src/**/*': true,
        'src/layouts/**/*': true
      }
    })
  )
  .use(
    assets({
      source: dir.source + 'assets/',
      destination: './'
    })
  )
  .build(function(err) {
    if (err) {
      console.log(err);
    }
  });

// const devBuild = (process.env.NODE_ENV || '').trim().toLowerCase() !== 'production';

// const metalsmith = require('metalsmith');
// const markdown = require('metalsmith-markdown');
// const publish = require('metalsmith-publish');
// // const collections = require('metalsmith-collections');
// // const permalinks = require('metalsmith-permalinks');
// const inplace = require('metalsmith-in-place');
// const layouts = require('metalsmith-layouts');
// const assets = require('metalsmith-assets');
// // const htmlmin = devBuild ? null : require('metalsmith-html-minifier');
// const browsersync = devBuild ? require('metalsmith-browser-sync') : null;

// // custom plugins
// // moremeta = require(dir.lib + 'metalsmith-moremeta'),
// // debug = consoleLog ? require(dir.lib + 'metalsmith-debug') : null,

// // const pkg = require('./package.json');

// const dir = {
//   base: __dirname + '/',
//   //   lib: __dirname + '/lib/',
//   source: './src/',
//   dest: './build/'
// };

// const siteMeta = {
//   name: 'Fluid Self',
//   description: 'Portfolio site'
// };

// const templateConfig = {
//   engine: 'handlebars',
//   directory: dir.source + 'template/',
//   partials: dir.source + 'partials/',
//   default: 'index.html'
// };

// const ms = metalsmith(dir.base)
//   //.clean(!devBuild) // clean folder before a production build
//   .clean(true)
//   .source(dir.source + 'html/')
//   .destination(dir.dest)
//   .metadata(siteMeta)
//   //.use(publish()) // draft, private, future-dated
//   //   .use(
//   //     collections({
//   //       // determine page collection/taxonomy
//   //       page: {
//   //         pattern: '**/index.*',
//   //         sortBy: 'priority',
//   //         reverse: true,
//   //         refer: false
//   //       },
//   //       start: {
//   //         pattern: 'start/**/*',
//   //         sortBy: 'priority',
//   //         reverse: true,
//   //         refer: true,
//   //         metadata: {
//   //           layout: 'article.html'
//   //         }
//   //       },
//   //       article: {
//   //         pattern: 'article/**/*',
//   //         sortBy: 'date',
//   //         reverse: true,
//   //         refer: true,
//   //         limit: 50,
//   //         metadata: {
//   //           layout: 'article.html'
//   //         }
//   //       }
//   //     })
//   //   )
//   .use(markdown()) // convert markdown
//   //   .use(
//   //     permalinks({
//   //       // generate permalinks
//   //       pattern: ':mainCollection/:title'
//   //     })
//   //   )
//   //   .use(moremeta()) // determine root paths and navigation
//   .use(inplace(templateConfig)) // in-page templating
//   .use(layouts(templateConfig)); // layout templating

// //if (htmlmin) ms.use(htmlmin()); // minify production HTML

// //if (debug) ms.use(debug()); // output page debugging information

// if (browsersync)
//   ms.use(
//     browsersync({
//       // start test server
//       server: dir.dest,
//       files: [dir.source + '**/*']
//     })
//   );

// ms.use(
//   assets({
//     // copy assets: CSS, images etc.
//     source: dir.source + 'assets/',
//     destination: './'
//   })
// ).build(function(err) {
//   // build
//   if (err) throw err;
//   console.log('done');
// });

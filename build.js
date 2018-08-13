'use strict';
const devBuild = (process.env.NODE_ENV || '').trim().toLowerCase() !== 'production';

const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const discoverPartials = require('metalsmith-discover-partials');
const permalinks = require('metalsmith-permalinks');
const assets = require('metalsmith-assets');
const htmlmin = devBuild ? null : require('metalsmith-html-minifier');
const serve = devBuild ? require('metalsmith-serve') : null;
const watch = devBuild ? require('metalsmith-watch') : null;

const dir = {
  base: __dirname + '/',
  source: './src/',
  dest: './build/'
};
const templateConfig = {
  engine: 'handlebars',
  directory: dir.source + 'layouts/',
  default: 'index.hbs'
};

const ms = metalsmith(dir.base)
  .clean(true) // clean build folder
  .metadata({
    // add meta data to every page
    site: {
      name: 'Fluid Self',
      description: "Thomas Hauge's portfolio site and book notes"
    }
  })
  .source(dir.source + 'html/') // source folder
  .destination(dir.dest) // build folder
  .use(markdown()) // convert markdown
  .use(
    // generate permalinks
    permalinks({
      relative: false
    })
  )
  .use(
    // enable Handlebars partials
    discoverPartials({
      directory: dir.source + 'partials/'
    })
  )
  .use(layouts(templateConfig));

if (htmlmin) ms.use(htmlmin()); // minify production HTML

if (serve)
  // start test server when not running production build
  ms.use(
    serve({
      port: 3000,
      verbose: true
    })
  ).use(
    watch({
      paths: {
        'src/**/*': true,
        'src/layouts/**/*': true
      }
    })
  );

ms.use(
  // copy assets: CSS, images, etc.
  assets({
    source: dir.source + 'assets/',
    destination: './'
  })
).build(function(err) {
  // build
  if (err) {
    console.log(err);
  }
});

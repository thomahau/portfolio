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
  .clean(true)
  .metadata({
    site: {
      name: 'Fluid Self',
      description: 'Projects and book notes'
    }
  })
  .source(dir.source + 'html/')
  .destination(dir.dest)
  .use(markdown())
  .use(
    permalinks({
      relative: false
    })
  )
  .use(
    discoverPartials({
      directory: dir.source + 'partials/'
    })
  )
  .use(layouts(templateConfig));

if (htmlmin) ms.use(htmlmin()); // minify production HTML
// start test server
if (serve)
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
  assets({
    source: dir.source + 'assets/',
    destination: './'
  })
).build(function(err) {
  if (err) {
    console.log(err);
  }
});

'use strict';
require('dotenv').config();
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
const algolia = require('metalsmith-algolia');
const _ = require('lodash');

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

function bookFileParser(file, metadata) {
  const documents = [];

  documents.push({
    title: metadata.title,
    url: metadata.link
  });
  return documents;
}

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
  .use(layouts(templateConfig))
  // add metadata field to all book files
  .use(function(files, metalsmith, done) {
    _.map(files, function(file) {
      return file.layout === 'book.hbs' ? _.extend(file, { algolia: true }) : file;
    });
    done();
  })
  // index books for search
  .use(
    algolia({
      projectId: process.env.ALGOLIA_APP_ID,
      privateKey: process.env.ALGOLIA_API_KEY,
      index: process.env.ALGOLIA_INDEX,
      clearIndex: true,
      fileParser: bookFileParser
    })
  );

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

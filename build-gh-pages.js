import Metalsmith from 'metalsmith';
import collections from 'metalsmith-collections';
import layouts from 'metalsmith-layouts';
import inPlace from 'metalsmith-in-place';
import markdown from 'metalsmith-markdown';
import permalinks from 'metalsmith-permalinks';
import sass from 'metalsmith-sass';
import htmlMinifier from 'metalsmith-html-minifier';
import fs from 'fs';

Metalsmith(__dirname)
  .destination('gh-pages')
  .use(collections({
    posts: {
      pattern: 'blog/!(index).md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(sass({
    outputDir: 'css'
  }))
  .use(markdown({
    gfm: true
  }))
  .use(permalinks({
    pattern: 'blog/:title'
  }))
  .use(layouts({
    engine: 'liquid',
    directory: 'layouts',
    includeDir: 'layouts/includes'
  }))
  .use(inPlace({
    engine: 'liquid',
    pattern: '**/*.html',
    includeDir: 'layouts/includes'
  }))
  .use((files) => {
    for(var filename in files) {
      // var string = fs.readFileSync(files[filename].contents, {encoding: 'utf8'});
      if (files[filename].title) {
        var string = files[filename].contents.toString('utf8');
        string = string.replace(/href\=\"/g, 'href="/metalsmith-blog');
        string = string.replace(/href\=\"\/metalsmith-blog\/\//g, 'href="//');
        files[filename].contents = new Buffer(string);
      }
    }
  })
  .use(htmlMinifier())
  .build(function () {
    console.log('Cheers!');
  });
  
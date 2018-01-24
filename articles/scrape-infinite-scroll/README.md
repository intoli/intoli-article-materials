# Using Puppeteer to Scrape Websites with Infinite Scrolling

This directory is centered around [scrape-infinite-scroll.js](scrape-infinite-scroll.js), which uses Puppeteer to scrape infinite scroll items from a [demo page](https://intoli.com/blog/scrape-infinite-scroll/demo.html) set up for it.
The script's implementation details are described in the [Using Puppeteer to Scrape Websites with Infinite Scrolling]() article published on the Intoli blog.
Customizing the script should be straightfoward after this article.

To run the script, you need to have [Node.js](https://nodejs.org/en/) installed, which you can do using [nvm](https://github.com/creationix/nvm).
With that out of the way, download the contents of this directory to disk.

```bash
git clone https://github.com/Intoli/intoli-article-materials.git
cd intoli-article-materials/articles/scrape-infinite-scroll
```

And then install Puppeteer with

```bash
npm install
```

Finally, run the script with

```bash
node scrape-infinite-scroll.js
```

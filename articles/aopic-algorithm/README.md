# Performing Efficient Broad Crawls with the AOPIC Algorithm

[Performing Efficient Broad Crawls with the AOPIC Algorithm](https://intoli.com/blog/aopic-algorithm/) article explains how the the Adaptive On-Line Page Importance Computation (AOPIC) algorithm for performing efficient broad crawls works.
AOPIC is similar to Google's PageRank in that it iteratively estimates page importance based on links between pages, but it's pretty simple to understand and implement, and produces good results in practice.

This folder contains the code used to generate the AOPIC simulation widgets and plots in the article.


## Widget Development

To get started, clone this repository and navigate to this article's directory:

```bash
git clone https://github.com/intoli/intoli-article-materials.git
cd intoli-article-materials/articles/aopic-algorithm
```

Then, install the project's dependencies via Yarn

```bash
yarn install
```

This will also copy the required [Cytoscape](http://js.cytoscape.org/) global dependency into `./public/`, to be served with the application.
With the basic setup out of the way, you can start the development app with hot reloading with

```bash
yarn start
```

You can view the app at `http://localhost:3000`, and build with `yarn build`.


## Plot Generation

The scale-free network graph example and dynamic history update plots from the article were generated using code in [miscellaneous.py](./miscellaneous.py).

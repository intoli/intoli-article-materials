# Using Webpack to Render Markdown in React Apps

[Using Webpack to Render Markdown in React Apps](https://intoli.com/blog/webpack-markdown-setup) is a short article describing the concrete steps you need to take in order to automatically render Markdown documents through Webpack.
This folder contains a working example of the configuration described in that tutorial.
The code is organized as follows:

- [webpack.config.js](webpack.config.js) - Contains the loader setup which makes Markdown rendering and code highlighting possible.
- [src/](src/) - Contains a wep app built by the above Webpack config.
    It's entry point, [src/index.jsx](src/index.jsx), shows how to load a React component that accepts imported Markdown content.
- [src/article.md] - The Markdown file that's renderd by this app is a listing of various Markdown features, and serves to show off how a wide range of elements get rendered.


## Running This Example

First, clone this repository and navigate to this article's directory:

```bash
git clone https://github.com/intoli/intoli-article-materials.git
cd intoli-article-materials/articles/webpack-markdown-setup
```

Then, install the project's dependencies via Yarn

```bash
yarn install
```

With the basic setup out of the way, you can start the app.
The default script is run via

```bash
yarn start
```

and its starts a hot reloading server that will re-render the app on any chanages in real time.
You can view the app at `http://localhost:3000` (customizable in the Webpack config).

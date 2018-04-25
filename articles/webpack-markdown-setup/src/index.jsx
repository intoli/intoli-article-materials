import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Article from './components/Article/index';
import content from './article.md';


const App = () => <Article content={content} />;


ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

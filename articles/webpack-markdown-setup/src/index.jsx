import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Article from './components/Article/index';
import markdown from './article.md';


const App = () => <Article markdown={markdown} />;


ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

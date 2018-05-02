import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Markdown from './components/Markdown';
import content from './article.md';


ReactDOM.render(
  <Markdown content={content} />,
  document.getElementById('app'),
);

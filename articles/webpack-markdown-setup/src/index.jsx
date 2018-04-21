import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (<div>Hello, world!</div>);


ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

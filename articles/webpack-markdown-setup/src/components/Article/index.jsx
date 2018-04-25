import PropTypes from 'prop-types';
import React from 'react';

// Set the rendered code theme.
import './gruvbox-dark.css';
// Customize the way markdown is rendered.
import './markdown.css';


const wrapMarkup = html => ({
  __html: html,
});


const Markdown = ({ content }) => (
  // eslint-disable-next-line react/no-danger
  <div className="markdown" dangerouslySetInnerHTML={wrapMarkup(content)} />
);

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
};


export default Markdown;

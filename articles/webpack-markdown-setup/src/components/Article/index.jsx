import PropTypes from 'prop-types';
import React from 'react';

// Set the rendered code theme.
import './gruvbox-dark.css';
// Customize the way markdown is rendered.
import './markdown.css';


const wrapMarkup = html => ({
  __html: html,
});


const Article = ({ content }) => (
  // eslint-disable-next-line react/no-danger
  <div className="article" dangerouslySetInnerHTML={wrapMarkup(content)} />
);

Article.propTypes = {
  content: PropTypes.string.isRequired,
};


export default Article;

import PropTypes from 'prop-types';
import React from 'react';

// Set the rendered code theme.
import './gruvbox-dark.css';
// Customize the way markdown is rendered.
import './markdown.css';


const wrapMarkup = content => ({
  __html: content,
});


const Article = ({ markdown }) => (
  // eslint-disable-next-line react/no-danger
  <div className="article" dangerouslySetInnerHTML={wrapMarkup(markdown)} />
);

Article.propTypes = {
  markdown: PropTypes.string.isRequired,
};


export default Article;

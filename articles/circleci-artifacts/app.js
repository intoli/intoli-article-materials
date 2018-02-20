const https = require('https');

const express = require('express');
const app = express();


app.get('/artifacts/:username/:project/*', (req, res) => {
  // Mandatory positional arguments.
  const file = req.params[0];
  const { project, username } = req.params;

  // Optional query string parameters.
  const branch = req.query.branch || 'master';
  const build = req.query.build || 'latest';
  const filter = req.query.filter || 'successful';
  const vcsType = req.query.vcsType || 'github';

  // Construct the request options for hitting CircleCI's API.
  const requestOptions = {
    hostname: 'circleci.com',
    path: `/api/v1.1/project/${vcsType}/${username}/${project}` +
      `/${build}/artifacts?branch=${branch}&filter=${filter}`,
    port: 443,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  };

  // Make the request.
  https.get(requestOptions, response => {
    // Accumulate the response body.
    let body = '';
    response.setEncoding('utf8');
    response.on('data', data => body += data);

    // Process the complete response.
    response.on('end', () => {
      try {
        // Loop through and try to find the specified artifact.
        const artifacts = JSON.parse(body);
        for (let i = 0; i < artifacts.length; i++) {
          const artifact = artifacts[i];
          if (artifact.path === file) {
            // Redirect to the artifact URL if we can find it.
            return res.redirect(303, artifact.url);
          }
        }
        // Return a 404 if there are no matching artifacts.
        return res.status(404).send('Not found.');
      } catch (e) {
        console.error(e);
        return res.status(500).send(`Something went wrong: ${e.message}`);
      }
    });
  });
});


// Run the app when the file is being run as a script.
if (!module.parent) {
  app.listen(3000, () => console.log('Listening on port 3000!'))
}

// Export the app for use with lambda.
module.exports = app;

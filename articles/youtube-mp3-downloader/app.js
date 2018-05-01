const AWS = require('aws-sdk');
const express = require('express');
const nunjucks = require('nunjucks');
const ytdl = require('ytdl-core');

const apiStage = 'v1';
const transcoderFunctionName = 'YoutubeMp3TranscoderFunction';
const lambda = new AWS.Lambda({ region: 'us-east-2' });
const s3 = new AWS.S3({ signatureVersion: 'v4' });
const s3Bucket = 'youtube-mp3-downloader';

const app = express();
nunjucks.configure('.', { express: app });
const router = express.Router();


router.get('/transcode/:videoId', (req, res) => {
  const timestamp = Date.now().toString();
  const { videoId } = req.params;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Get information on the available video file formats.
  Promise.resolve().then(() => new Promise((resolve, revoke) => {
    ytdl.getInfo(videoUrl, (error, info) => error ? revoke(error) : resolve(info))
  }))
  // Choose the best format and construct the Lambda event.
  .then(({ formats, title }) => {
    // We'll just pick the largest audio source file size for simplicity here,
    // you could prioritize things based on bitrate, file format, etc. if you wanted to.
    const format = formats
      .filter(format => format.audioEncoding != null)
      .filter(format => format.clen != null)
      .sort((a, b) => parseInt(b.clen, 10) - parseInt(a.clen, 10))[0];

    return {
      filename: `${title}.mp3`,
      logKey: `log/${timestamp} - ${title}.log`,
      mp3Key: `mp3/${timestamp} - ${title}.mp3`,
      s3Bucket,
      url: format.url,
    };
  })
  // Trigger the actual conversion in the other Lambda function.
  .then(lambdaEvent => new Promise((resolve, revoke) => {
    lambda.invoke({
      FunctionName: transcoderFunctionName,
      InvocationType: 'Event',
      Payload: JSON.stringify(lambdaEvent),
    }, (error, data) => error ? revoke(error) : resolve(lambdaEvent));
  }))
  // Send a response
  .then(({ logKey, mp3Key }) => {
    res.status(200).send(JSON.stringify({ logKey, mp3Key }));
  })
  // Handle errors.
  .catch((error) => {
    return res.status(500).send(`Something went wrong: ${error.message}`);
  });
});


router.get('/signed-url/:logKey/:mp3Key', (req, res) => {
  const logKey = decodeURIComponent(req.params.logKey);
  const mp3Key = decodeURIComponent(req.params.mp3Key);
  s3.headObject({
    Bucket: s3Bucket,
    Key: logKey,
  }, (error) => {
    if (error && error.code === 'NotFound') {
      res.status(200).send(JSON.stringify({ url: null }));
    } else {
      s3.getSignedUrl('getObject', {
        Bucket: s3Bucket,
        Expires: 3600,
        Key: mp3Key,
      }, (error, url) => {
        res.status(200).send(JSON.stringify({ url }));
      });
    }
  });
});


router.get('/*', (req, res) => {
  // Handle extracting the path from the original URL.
  const originalUrl = module.parent ? req.originalUrl.slice(1) :
    req.originalUrl.slice(`/${apiStage}/`.length);
  const path = decodeURIComponent(originalUrl);

  // Handle full youtube URLs or just the video ID.
  const urlPrefixes = ['https://', 'http://', 'www.youtube.com', 'youtube.com'];
  let videoId, videoUrl;
  if (urlPrefixes.some(prefix => path.startsWith(prefix))) {
    videoUrl = path;
    videoId = videoUrl.match(/v=([^&]*)/)[1];
  } else {
    videoId = path;
    videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Render the download page template.
  res.render('download.html', { apiStage, videoId, videoUrl });
});

// Run the app when the file is being run as a script.
if (!module.parent) {
  app.use(`/${apiStage}/`, router);
  app.listen(3000, () => console.log('Listening on port 3000!'))
} else {
  app.use('/', router);
}

// Export the app for use with lambda.
module.exports = app;

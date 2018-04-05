const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
const request = require('request');
const tempy = require('tempy');

const s3 = new AWS.S3();


exports.handler = (event, context, callback) => {
  // We're going to do the transcoding asynchronously, so we callback immediately.
  callback();

  // Extract the event parameters.
  const { mp3Key, url } = event;
  const filename = event.filename || path.basename(mp3Key);
  const logKey = event.logKey || `${mp3Key}.log`;
  const s3Bucket = event.s3Bucket || 'youtube-mp3-downloader';

  // Create temporary input/output filenames that we can clean up afterwards.
  const inputFilename = tempy.file();
  const mp3Filename = tempy.file({ extension: 'mp3' });

  // Download the source file.
  Promise.resolve().then(() => new Promise((resolve, revoke) => {
    const writeStream = fs.createWriteStream(inputFilename);
    writeStream.on('finish', resolve);
    writeStream.on('error', revoke);
    request(url).pipe(writeStream);
  }))
  // Perform the actual transcoding.
  .then(() => {
    // Use the Exodus ffmpeg bundled executable.
    const ffmpeg = path.resolve(__dirname, 'exodus', 'bin', 'ffmpeg');

    // Convert the FLV file to an MP3 file using ffmpeg.
    const ffmpegArgs = [
      '-i', inputFilename,
      '-vn', // Disable the video stream in the output.
      '-acodec', 'libmp3lame', // Use Lame for the mp3 encoding.
      '-ac', '2', // Set 2 audio channels.
      '-q:a', '6', // Set the quality to be roughly 128 kb/s.
      mp3Filename,
    ];
    const process = child_process.spawnSync(ffmpeg, ffmpegArgs);
    return process.stdout.toString() + process.stderr.toString();
  })
  // Upload the generated MP3 to S3.
  .then(logContent => new Promise((resolve, revoke) => {
    s3.putObject({
      Body: fs.createReadStream(mp3Filename),
      Bucket: s3Bucket,
      Key: mp3Key,
      ContentDisposition: `attachment; filename="${filename.replace('"', '\'')}"`,
      ContentType: 'audio/mpeg',
    }, (error) => {
      if (error) {
        revoke(error);
      } else {
        // Update a log of the FFmpeg output.
        const logFilename = path.basename(logKey);
        s3.putObject({
          Body: logContent,
          Bucket: s3Bucket,
          ContentType: 'text/plain',
          ContentDisposition: `inline; filename="${logFilename.replace('"', '\'')}"`,
          Key: logKey,
        }, resolve);
      }
    })
  }))
  .catch(console.error)
  // Delete the temporary files.
  .then(() => {
    [inputFilename, mp3Filename].forEach((filename) => {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
      }
    });
  });
};

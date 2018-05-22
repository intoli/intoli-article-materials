# Building a YouTube MP3 Downloader with Exodus, FFmpeg, and AWS Lambda

[Running FFmpeg on AWS Lambda for 1.9% the cost of AWS Elastic Transcoder](https://intoli.com/blog/transcoding-on-aws-lambda) and [Building a YouTube MP3 Downloader with Exodus, FFmpeg, and AWS Lambda](https://intoli.com/blog/youtube-mp3-downloader) form a two part tutorial for building a practical bookmarklet that uses [AWS Lambda](https://aws.amazon.com/lambda/) to convert YouTube videos to MP3 files and then downloads them.
The project consists of two Lambda functions:

- `YoutubeMP3TranscoderFunction` - Defined in [transcoder.js](transcoder.js), this function first downloads a configurable media file, converts it to an MP3 using a bundled version of [FFmpeg](https://www.ffmpeg.org), and then uploads the MP3 to an S3 bucket.
    The behavior of the Lambda function can be controlled, by specifying the following keys in the invocation event.
    - `filename` - The filename to use in the MP3 file's [Content-Disposition header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) when a user downloads it.
        This determines the filename that will be suggested to the user when they save it to their computer.
    - `logKey` - An S3 key where the output of FFmpeg will be placed for logging purposes.
    - `mp3Key` - An S3 key where the converted MP3 file will be placed.
    - `s3Bucket` - The S3 bucket where the log and MP3 files will be placed.
    - `url` - The URL where the input audio/video file can be downloaded from.
- `YoutubeMP3DownloaderFunction` - Defined in [app.js](app.js) and [lambda.js](lambda.js), this function is designed to integrate with [API Gateway](https://aws.amazon.com/api-gateway/) using [aws-serverless-express](https://github.com/awslabs/aws-serverless-express).
    This function will serve up the YouTube MP3 Downloader's HTML download page as well as provide the internal API methods that it uses behind the scenes.

Note that you'll need to perform the deployment steps on Linux because we'll be bundling a locally installed version of FFmpeg.
If you use either Windows or macOS, then you'll need to work inside of a virtual machine running Linux.
You could alternatively spin up an EC2 instance, and work on the remote machine.

Before deploying the Lambda function, it will be necessary to install several dependencies.
You'll first need to make sure that `aws-cli`, `jq`, `git`, `node`, `npm`, `yarn`, `python`, `pip`, and `ffmpeg` are all available.
All of these should be available in your system package manager, and you already likely have most of them installed.

After that, you'll need to install [Exodus](https://github.com/intoli/exodus).
This can be done by running the following.

```bash
# Install the `exodus_bundler` package.
pip install --user exodus_bundler

# Make sure that `exodus` is in your `PATH`.
export PATH="${HOME}/.local/bin/:${PATH}"
```

You might also want to add the `export PATH="${HOME}/.local/bin/:${PATH}"` line to your `~/.bashrc` file, so that the `exodus` command will be in your path in the future.

Next, you'll need to clone the [intoli-article-materials repository](https://github.com/intoli/intoli-article-materials), move into this article's directory, and install the Node dependencies.

```bash
# Clone the repository and move into the directory.
git clone https://github.com/intoli/intoli-article-materials.git
cd intoli-article-materials/articles/youtube-mp3-downloader/

# Install the node dependencies from `package.json` and `yarn.lock`.
yarn install
```

After the Node dependencies finish installing, you must create a local Exodus bundle for FFmpeg.
The following command will create a local directory called `exodus` that includes FFmpeg as well as all of its dependencies.

```bash
# Create an `ffmpeg` bundle and extract it in the current directory.
exodus --tarball ffmpeg | tar -zx
```

At this stage, you're very close to being ready to deploy everything.
The last thing that you need to do is to customize the names of the S3 bucket, the Lambda functions, and other AWS resources which must have unique names.
These are defined at the top of the [deploy-everything.sh](deploy-everything.sh) and [app.js](app.js) files.
After setting these to uniques values, you can simply run

```bash
./deploy-everything.sh
```

to deploy all of the AWS resources.
This will echo out a lot of information about the AWS resources being created, and then at the end you should see something like this.

```
Now just create a bookmarklet with the following contents!
javascript:window.open(`https://osacfvxuq7.execute-api.us-east-2.amazonaws.com/v1/${window.location.href}`);
```

Then just create the bookmarklet, navigate to a video on YouTube, and click the bookmarklet to try it out!

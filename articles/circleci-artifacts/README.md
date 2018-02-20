# Extending CircleCI's API with a Custom Microservice on AWS Lambda

[Extending CircleCI's API with a Custom Microservice on AWS Lambda](https://intoli.com/blog/circleci-artifacts/) is a tutorial that describes the process of setting up a [nodejs](https://nodejs.org/) [express](https://expressjs.com/) app as an API using Amazon's [Lambda service](https://aws.amazon.com/lambda/).
The guide is comprehensive and covers everything from writing the initial express app to deploying it as an API on a custom domain name.
The actual purpose of the service that is developed is to provide a mechanism to access the latest version of a build artifact from [CircleCI](https://circleci.com/).
The finished API is provided free of charge to any open source projects that would like to use it, and it's accessible using the following URL pattern.

```
https://circleci.intoli.com/artifacts/github-username/repo-name/path/to/the/artifact
```

All of the resources required to deploy your own version of the proxy app are included inside of this directory.
The JavaScript dependencies are included in [package.json](package.json) and [yarn.lock](yarn.lock), and they can be installed by running the following.

```bash
yarn install
```

The app itself is defined in [app.js](app.js).
You can run this locally on your own machine by invoking it directly with node.

```bash
node app.js
```

A little bit of glue is required in order to get the script working on Lambda, and this is provided by the [lambda.js](lambda.js) file which exports a Lambda handler that will proxy requests to the app.

You'll need to package the app before deploying it.
This can be done using the `zip` command.

```bash
zip -r circleci-artifacts.zip app.js lambda.js node_modules/ package.json
```

The above command will create a `circleci-artifacts.zip` file that contains everything necessary to run the app on Amazon Lambda.

The [deploy-app.sh](deploy-app.sh) script walks through all of the steps necessary to actually deploy the app.
Note, however, that it isn't really meant to be run directly.
There is a point where you will need to confirm domain ownership before proceeding.
You'll also need to replace `example.com` with your own domain name.

The last two pieces of supporting materials are [circleci-artifacts-role-policy-document.json](circleci-artifacts-role-policy-document.json) and [circleci-artifacts-policy.json](circleci-artifacts-policy.json).
These are used by the commands in [deploy-app.sh](deploy-app.sh) to specify the AWS role and policy for the service.

If any of this is confusing, then by sure to check out the original [Extending CircleCI's API with a Custom Microservice on AWS Lambda](https://intoli.com/blog/circleci-artifacts/) article.
This directory is meant to be a supplement to the longer explanations there rather than a replacement.

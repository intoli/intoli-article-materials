#! /bin/bash

# You'll need to configure these settings, they must be unique.
export bucket_name="youtube-mp3-downloader"

export role_name="YoutubeMp3DownloaderRole"
export policy_name="YoutubeMp3DownloaderPolicy"

export transcoder_function_name="YoutubeMp3TranscoderFunction"
export downloader_function_name="YoutubeMp3DownloaderFunction"
export downloader_api_name="YoutubeDownloaderApi"


# Make a new S3 bucket.
aws s3 mb "s3://${bucket_name}"


# Create a new role.
read -r -d '' role_policy_document <<'EOF'
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": [
            "apigateway.amazonaws.com",
            "lambda.amazonaws.com"
          ]
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
EOF
response="$(aws iam create-role \
    --role-name "${role_name}" \
    --assume-role-policy-document "${role_policy_document}")"
echo "${response}"
role_arn="$(jq -r .Role.Arn <<< "${response}")"


# Assign a role to the policy.
read -r -d '' policy_document <<EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "apigateway:*"
        ],
        "Resource": "arn:aws:apigateway:*::/*"
      },
      {
        "Effect": "Allow",
        "Action": [
          "execute-api:Invoke"
        ],
        "Resource": "arn:aws:execute-api:*:*:*"
      },
      {
        "Effect": "Allow",
        "Action": [
            "lambda:*"
        ],
        "Resource": "*"
      },
      {
        "Effect": "Allow",
        "Action": "s3:ListAllMyBuckets",
        "Resource": "arn:aws:s3:::*"
      },
      {
        "Effect": "Allow",
        "Action": "s3:*",
        "Resource": [
          "arn:aws:s3:::${bucket_name}",
          "arn:aws:s3:::${bucket_name}/*"
        ]
      }
    ]
  }
EOF
aws iam put-role-policy \
    --role-name "${role_name}" \
    --policy-name "${policy_name}" \
    --policy-document "${policy_document}"


# Create the transcoder Lambda function.
yarn add aws-sdk request tempy
rm -f youtube-mp3-transcoder.zip
zip youtube-mp3-transcoder.zip transcoder.js
aws lambda create-function \
    --function-name "${transcoder_function_name}" \
    --zip-file fileb://youtube-mp3-transcoder.zip \
    --handler transcoder.handler \
    --runtime nodejs6.10 \
    --timeout 300 \
    --role "${role_arn}"
rm -f youtube-mp3-transcoder.zip
zip --symlinks --recurse-paths youtube-mp3-transcoder.zip \
    transcoder.js package.json node_modules/ exodus
aws s3 cp youtube-mp3-transcoder.zip "s3://${bucket_name}/"
aws lambda update-function-code \
    --function-name "${transcoder_function_name}" \
    --s3-bucket "${bucket_name}" \
    --s3-key youtube-mp3-transcoder.zip


# Create the function for the downloader app's API.
yarn add aws-sdk aws-serverless-express express nunjucks ytdl-core
zip --symlinks --recurse-paths youtube-mp3-downloader.zip \
    app.js lambda.js package.json node_modules/
response="$(aws lambda create-function \
    --function-name "${downloader_function_name}" \
    --zip-file fileb://youtube-mp3-downloader.zip \
    --handler lambda.handler \
    --runtime nodejs6.10 \
    --timeout 29 \
    --role "${role_arn}")"
echo "${response}"
downloader_function_arn="$(jq -r .FunctionArn <<< "${response}")"


# Query the resources for this API.
response="$(aws apigateway get-resources \
    --rest-api-id "${api_id}")"
echo "${response}"
root_resource_id="$(jq -r .items[0].id <<< "${response}")"


# Create a child resource.
response="$(aws apigateway create-resource \
    --rest-api-id "${api_id}" \
    --parent-id "${root_resource_id}" \
    --path-part '{proxy+}')"
echo "${response}"
proxy_resource_id="$(jq -r .id <<< "${response}")"


# Allow GET requests for the proxy resource.
aws apigateway put-method \
    --rest-api-id "${api_id}" \
    --resource-id "${proxy_resource_id}" \
    --http-method GET \
    --authorization-type NONE


# Integrate the proxy resource with the downloader Lambda function.
aws apigateway put-integration \
    --rest-api-id "${api_id}" \
    --resource-id "${proxy_resource_id}" \
    --http-method GET \
    --integration-http-method POST \
    --type AWS_PROXY \
    --uri "arn:aws:apigateway:us-east-2:lambda:path/2015-03-31/functions/${transcoder_function_arn}/invocations" \
    --credentials "${role_arn}"


# Deploy the API with a stage name of "v1".
aws apigateway create-deployment \
    --rest-api-id "${api_id}" \
    --stage-name v1


# Echo out the bookmarklet.
echo "Now just create a bookmarklet with the following contents!"
echo "javascript:window.open(`https://${api_id}.execute-api.us-east-2.amazonaws.com/v1/\${window.location.href}`);"

#! /bin/bash

# You'll need to configure these settings, they must be unique.
export bucket_name="youtube-mp3-downloader"

export role_name="YoutubeMp3DownloaderRole"
export policy_name="YoutubeMp3DownloaderPolicy"

export transcoder_function_name="YoutubeMp3TranscoderFunction"


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

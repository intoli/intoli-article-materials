#! /bin/bash


# Create the initial role.
response="$(aws iam create-role \
    --role-name CircleciArtifactsRole \
    --assume-role-policy-document file://circleci-artifacts-role-policy-document.json)"
# Echo the response in the terminal.
echo "${response}"
# Store the role ARN for future usage.
role_arn="$(jq -r .Role.Arn <<< "${response}")"


# Attach the policy.
aws iam put-role-policy \
    --role-name CircleciArtifactsRole \
    --policy-name CircleciArtifactsPolicy \
    --policy-document file://circleci-artifacts-policy.json


# Create the lambda function.
response="$(aws lambda create-function \
    --function-name CircleciArtifactsFunction \
    --zip-file fileb://circleci-artifacts.zip \
    --handler lambda.handler \
    --runtime nodejs6.10 \
    --role "${role_arn}")"
# Echo the response in the terminal.
echo "${response}"
# Store the function ARN for future usage.
function_arn="$(jq -r .FunctionArn <<< "${response}")"


# Create a new API.
response="$(aws apigateway create-rest-api \
    --name CircleciArtifactsApi \
    --endpoint-configuration types=REGIONAL)"
# Echo the response in the terminal.
echo "${response}"
# Store the API ID for future usage.
api_id="$(jq -r .id <<< "${response}")"


# Fetch the API resources.
response="$(aws apigateway get-resources \
    --rest-api-id "${api_id}")"
# Echo the response in the terminal.
echo "${response}"
# Store the root resource ID for future usage.
root_resource_id="$(jq -r .items[0].id <<< "${response}")"


# Create a new API resource.
response="$(aws apigateway create-resource \
    --rest-api-id "${api_id}" \
    --parent-id "${root_resource_id}" \
    --path-part '{proxy+}')"
# Echo the response in the terminal.
echo "${response}"
# Store the proxy resource ID for future usage.
proxy_resource_id="$(jq -r .id <<< "${response}")"


# Allow GET methods on the resource.
aws apigateway put-method \
    --rest-api-id "${api_id}" \
    --resource-id "${proxy_resource_id}" \
    --http-method GET \
    --authorization-type NONE


# Integrate the endpoint with the Lambda function.
aws apigateway put-integration \
    --rest-api-id "${api_id}" \
    --resource-id "${proxy_resource_id}" \
    --http-method GET \
    --integration-http-method POST \
    --type AWS_PROXY \
    --uri "arn:aws:apigateway:us-east-2:lambda:path/2015-03-31/functions/${function_arn}/invocations" \
    --credentials "${role_arn}"


# Deploy the API.
aws apigateway create-deployment \
    --rest-api-id "${api_id}" \
    --stage-name v1


# Request a certificate.
response="$(aws acm request-certificate \
    --domain-name circleci.example.com \
    --validation-method DNS \
    --idempotency-token 1111)"
# Echo the response in the terminal.
echo "${response}"
# Store the certificate ID for future usage.
certificate_arn="$(jq -r .CertificateArn <<< "${response}")"


echo NOTE: You must actually verify your domain ownership before doing the next steps, exiting...
exit 0


# Create an API Gateway domain name.
aws apigateway create-domain-name \
    --domain-name circleci.example.com \
    --endpoint-configuration types=REGIONAL \
    --regional-certificate-arn "${certificate_arn}"


# Map the domain to the API.
aws apigateway create-base-path-mapping \
    --domain-name circleci.example.com \
    --rest-api-id "${api_id}" \
    --stage v1

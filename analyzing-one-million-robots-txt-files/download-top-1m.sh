#! /bin/sh

# Download and extract the Alexa top one million sites.
wget http://s3.amazonaws.com/alexa-static/top-1m.csv.zip
unzip top-1m.csv.zip

# Preview the top ten websites on the list.
echo "The top ten website on the list are:"
head  top-1m.csv.zip

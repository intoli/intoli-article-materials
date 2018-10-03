# Create a new firefox profile
./node_modules/.bin/slimerjs --debug=true -CreateProfile scraping --headless

# Get the latest profile directory.
PROFILE_DIRECTORY=`ls -td  -- ~/.innophi/slimerjs/*/ | head -n 1`

# Download the Intoli Root CA.
curl https://intoli.com/intoli-ca.crt > intoli-ca.crt

# Install the Intoli Root CA into the profile.
certutil -A -n "Intoli CA" -t "C,," -i intoli-ca.crt -d "sql:$PROFILE_DIRECTORY"

# Clean up.
rm intoli-ca.crt

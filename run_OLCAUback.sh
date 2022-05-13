#!/bin/bash

while true; do
    read -p "Do you wish to run the script for OneLink_CAU Backend? [y/n]: " yn
    case $yn in
        [Yy]* ) npm install;
#               npm start app.js; break;;    # not working..?
                node app.js; break;;         # Ubuntu
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no";;
    esac
done

echo "Starting OneLink_CAU Backend"

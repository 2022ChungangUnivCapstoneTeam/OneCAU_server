#!/bin/bash

while true; do
    read -p "Do you wish to run MongoDB? [y/n]: " yn
    case $yn in
        [Yy]* ) sudo mongod --dbpath ~/data/db; break;; # for running 'simple' mongo.
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no";;
    esac
done

echo "Starting MongoDB"

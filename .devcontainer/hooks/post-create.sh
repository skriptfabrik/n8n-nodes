#!/bin/sh

set -e

# Update package lists
sudo apt-get update

# Install ghostscript
sudo apt-get install -y ghostscript

# Install node-canvas dependencies
sudo apt-get install -y libcairo2-dev libgif-dev libjpeg-dev libpango1.0-dev librsvg2-dev

# Install dependencies
npm i --no-audit --no-fund --no-update-notifier

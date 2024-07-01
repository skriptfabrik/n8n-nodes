#!/bin/sh

set -e

# Update package lists
sudo apt-get update

# Install ghostscript
sudo apt-get install -y ghostscript

# Install node-canvas dependencies
sudo apt-get install -y libcairo2-dev libgif-dev libjpeg-dev libpango1.0-dev librsvg2-dev

# Set pnpm store directory
pnpm config set store-dir ~/.local/share/pnpm/store

# Install dependencies
pnpm install --frozen-lockfile

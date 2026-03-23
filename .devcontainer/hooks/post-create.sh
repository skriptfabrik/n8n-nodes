#!/bin/sh

set -e

# Install mise dependencies
mise install --yes

# Run the install hook
mise run install

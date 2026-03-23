#!/bin/sh

set -e

# Change ownership of the local data volume mount to the current user
sudo chown $(id -u):$(id -g) ~/.local

# Update mise to the latest version
sudo mise self-update --yes

# Activate mise in bash
cat << 'EOF' >> ~/.bashrc

# Activate mise
eval "$(mise activate bash)"
EOF

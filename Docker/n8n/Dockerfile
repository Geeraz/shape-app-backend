# Start from the official n8n image
FROM n8nio/n8n:latest

# Switch to the root user to install packages
USER root

# Sharp has native dependencies that need to be compiled.
# The n8n image is based on Alpine Linux, which uses 'apk' for package management.
# We need python, make, and a C++ compiler (g++) to build Sharp.
RUN apk add --no-cache python3 make g++ && npm install -g sharp

# Switch back to the non-root 'node' user for security
USER node
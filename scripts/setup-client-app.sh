#!/bin/bash

# Print colorful messages
print_message() {
    echo -e "\033[1;34m>>> $1\033[0m"
}

# Error handling
handle_error() {
    echo -e "\033[1;31mError: $1\033[0m"
    exit 1
}

# Get the root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_APP_DIR="$ROOT_DIR/apps/client-app"

print_message "Setting up ttm-front client-app..."

# Check if we're in the right directory structure
if [ ! -d "$CLIENT_APP_DIR" ]; then
    handle_error "client-app directory not found. Are you running this from the right location?"
fi

# Clean up existing installations
print_message "Cleaning up existing installations..."
rm -rf "$ROOT_DIR/node_modules"
rm -rf "$CLIENT_APP_DIR/node_modules"

# Install root dependencies
print_message "Installing root dependencies..."
cd "$ROOT_DIR" || handle_error "Could not change to root directory"
npm install || handle_error "Failed to install root dependencies"

# Install client-app dependencies
print_message "Installing client-app dependencies..."
cd "$CLIENT_APP_DIR" || handle_error "Could not change to client-app directory"
npm install || handle_error "Failed to install client-app dependencies"

print_message "Setup completed successfully! ✨"
print_message "You can now run the client-app with: cd apps/client-app && npm run dev" 
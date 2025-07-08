# Script to run the POV VR website development server
# This script sets up the Node.js path and runs the development server

# Set the path to the Node.js directory
$env:PATH = "C:\Users\rjah\Downloads\nodejs\node-v20.11.1-win-x64;$env:PATH"

# Verify Node.js is available
Write-Host "Using Node.js version:" -ForegroundColor Green
node -v

# Verify npm is available
Write-Host "Using npm version:" -ForegroundColor Green
npm -v

# Run the development server
Write-Host "Starting the development server..." -ForegroundColor Green
npm run dev

# Note: Press Ctrl+C to stop the server when you're done 
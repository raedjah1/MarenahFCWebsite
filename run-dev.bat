@echo off
REM Script to run the POV VR website development server
REM This script sets up the Node.js path and runs the development server

REM Set the path to the Node.js directory
SET PATH=C:\Users\rjah\Downloads\nodejs\node-v20.11.1-win-x64;%PATH%

REM Verify Node.js is available
echo Using Node.js version:
node -v

REM Verify npm is available
echo Using npm version:
npm -v

REM Run the development server
echo Starting the development server...
npm run dev

REM Note: Press Ctrl+C to stop the server when you're done 
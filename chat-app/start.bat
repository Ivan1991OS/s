@echo off
start cmd /k "cd chat-server && node server.js"
timeout /t 3 /nobreak >nul
start cmd /k "cd chat-client && npm start"
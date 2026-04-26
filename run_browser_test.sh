#!/bin/bash

# Browser Test Script for Meal Logger

cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

echo "================================"
echo "Meal Logger - Browser Test"
echo "================================"
echo ""
echo "Starting local server..."
echo ""
echo "Opening at: http://localhost:8000/test.html"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start Python HTTP server
python3 -m http.server 8000 --bind 127.0.0.1

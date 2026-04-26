#!/bin/bash

# Quick Test Script for Meal Logger on Zepp OS
# This script sets up and tests the meal logger on simulator and device

set -e

PROJECT_DIR="/Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp"
cd "$PROJECT_DIR"

echo "================================"
echo "Meal Logger - Quick Test Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Step 1: Check prerequisites
print_step "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Please install Node.js 14+"
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command -v zepp &> /dev/null; then
    print_warning "Zepp CLI not found. Installing..."
    npm install -g @zepp/cli
fi
print_success "Zepp CLI found: $(zepp --version)"

# Step 2: Copy files
print_step "Setting up project files..."

mkdir -p pages utils assets

if [ ! -f "pages/meal_logger.js" ]; then
    print_warning "pages/meal_logger.js not found"
else
    print_success "pages/meal_logger.js found"
fi

if [ ! -f "utils/MealLogger.js" ]; then
    print_warning "utils/MealLogger.js not found"
else
    print_success "utils/MealLogger.js found"
fi

if [ ! -f "assets/FOOD_DATABASE_PART1.json" ]; then
    print_warning "assets/FOOD_DATABASE_PART1.json not found"
else
    print_success "assets/FOOD_DATABASE_PART1.json found"
fi

if [ ! -f "assets/FOOD_DATABASE_PART2.json" ]; then
    print_warning "assets/FOOD_DATABASE_PART2.json not found"
else
    print_success "assets/FOOD_DATABASE_PART2.json found"
fi

if [ ! -f "assets/UK_DIETARY_GUIDELINES.json" ]; then
    print_warning "assets/UK_DIETARY_GUIDELINES.json not found"
else
    print_success "assets/UK_DIETARY_GUIDELINES.json found"
fi

# Step 3: Install dependencies
print_step "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 4: Build
print_step "Building app..."
zepp build
print_success "Build successful"

# Step 5: Ask user what to test
echo ""
echo "What would you like to do?"
echo "1) Start simulator"
echo "2) Deploy to watch"
echo "3) View logs"
echo "4) Both (simulator + watch)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        print_step "Starting simulator..."
        echo "Simulator will open at http://localhost:8080"
        echo "Press Ctrl+C to stop"
        echo ""
        zepp simulator
        ;;
    2)
        print_step "Deploying to watch..."
        echo "Make sure your watch is connected via USB or WiFi"
        echo ""
        zepp preview --device
        print_success "Deployment complete"
        ;;
    3)
        print_step "Viewing logs..."
        zepp log --verbose
        ;;
    4)
        print_step "Starting simulator..."
        echo "Simulator will open at http://localhost:8080"
        echo "Test the app, then press Ctrl+C to continue"
        echo ""
        zepp simulator &
        SIMULATOR_PID=$!
        
        sleep 5
        
        read -p "Press Enter after testing simulator..."
        
        kill $SIMULATOR_PID 2>/dev/null || true
        
        print_step "Deploying to watch..."
        echo "Make sure your watch is connected via USB or WiFi"
        echo ""
        zepp preview --device
        print_success "Deployment complete"
        ;;
    *)
        print_warning "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_success "Test complete!"
echo ""
echo "Next steps:"
echo "1. Test meal logging on your watch"
echo "2. Log a few meals"
echo "3. Check daily summary"
echo "4. Verify calculations"
echo "5. Check battery impact"
echo ""
echo "For more information, see ZEPP_SETUP_GUIDE.md"

#!/bin/bash

echo "🎮 Setting up Combo Combat Chronicles GUI..."
echo ""

# Check if we're in the combat-system directory
if [ ! -d "src" ]; then
  echo "❌ Error: This script must be run from your combat-system root directory"
  echo "   (The directory that contains the 'src' folder)"
  exit 1
fi

echo "✅ Found src directory"
echo ""

# Check for package.json
if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found. Make sure you're in the project root."
  exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🎮 Setup complete! You can now:"
echo ""
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run preview  - Preview production build"
echo ""
echo "The game will open at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the dev server when running."
echo ""
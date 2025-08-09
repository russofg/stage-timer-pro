#!/bin/bash

echo "🚀 Building Stage Timer Pro for multiple platforms..."

# Build for macOS (current platform)
echo "📱 Building for macOS..."
npm run tauri build

# Show results
echo "✅ Build completed!"
echo "📦 Files generated:"
ls -la src-tauri/target/release/bundle/

echo ""
echo "🌐 Para Windows:"
echo "1. Usa GitHub Actions (recomendado)"
echo "2. O usa una VM con Windows"
echo "3. El archivo .github/workflows/build.yml ya está configurado"

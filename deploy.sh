#!/bin/bash

# Exit on error
set -e

echo "🔨 Building project..."
npm run build

echo "🚀 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment complete!"

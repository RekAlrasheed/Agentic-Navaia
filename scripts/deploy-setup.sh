#!/bin/bash

# Vercel Deployment Setup Script for Agentic Navaia

echo "🚀 Setting up Vercel deployment for Agentic Navaia..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Vercel login (skip if already logged in)..."
vercel login

# Initialize Vercel project
echo "⚙️ Initializing Vercel project..."
vercel

echo "🎯 Deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard: https://vercel.com/dashboard"
echo "2. Find your project and go to Settings > Environment Variables"
echo "3. Add the following environment variables:"
echo "   - ELEVENLABS_API_KEY"
echo "   - ELEVENLABS_SUPPORT_AGENT_ID" 
echo "   - ELEVENLABS_SALES_AGENT_ID"
echo "   - NEXT_PUBLIC_BACKEND_URL"
echo "   - NEXT_PUBLIC_ELEVENLABS_SUPPORT_AGENT_ID"
echo "   - NEXT_PUBLIC_ELEVENLABS_SALES_AGENT_ID"
echo ""
echo "4. Set the production branch to 'develop' in Settings > Git"
echo "5. Trigger a new deployment by pushing to the develop branch"
echo ""
echo "🌐 Your app will be available at: https://your-project.vercel.app"

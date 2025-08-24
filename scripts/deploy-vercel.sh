#!/bin/bash

# Vercel Deployment Setup Script for Agentic Navaia
echo "🚀 Setting up Vercel deployment for Agentic Navaia..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Initialize Vercel project
echo "🔧 Initializing Vercel project..."
vercel --yes

echo "✅ Vercel setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find your 'Agentic-Navaia' project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add the following environment variables:"
echo ""
echo "   Required Environment Variables:"
echo "   - elevenlabs-api-key: Your ElevenLabs API key"
echo "   - elevenlabs-support-agent-id: Your support agent ID"
echo "   - elevenlabs-sales-agent-id: Your sales agent ID"
echo "   - next-public-backend-url: Your backend URL (if using external backend)"
echo "   - next-public-elevenlabs-support-agent-id: Public support agent ID"
echo "   - next-public-elevenlabs-sales-agent-id: Public sales agent ID"
echo ""
echo "5. Set up automatic deployments from 'develop' branch:"
echo "   - Go to Settings > Git"
echo "   - Set Production Branch to 'develop'"
echo "   - Enable automatic deployments"
echo ""
echo "🌐 Your app will be available at: https://agentic-navaia.vercel.app"

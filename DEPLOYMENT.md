# Deployment Guide - Agentic Navaia

## Vercel Deployment Setup

### Prerequisites
1. Vercel account connected to GitHub
2. ElevenLabs API key and agent IDs
3. Environment variables configured

### Environment Variables for Production

Add these environment variables in your Vercel dashboard:

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_SUPPORT_AGENT_ID=your_support_agent_id
ELEVENLABS_SALES_AGENT_ID=your_sales_agent_id

# Public Environment Variables (Client-side)
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_ELEVENLABS_SUPPORT_AGENT_ID=your_support_agent_id
NEXT_PUBLIC_ELEVENLABS_SALES_AGENT_ID=your_sales_agent_id
```

### Deployment Steps

#### Option 1: Automatic Deployment via GitHub
1. Connect your GitHub repository to Vercel
2. Set the production branch to `develop`
3. Configure environment variables in Vercel dashboard
4. Push to `develop` branch for automatic deployment

#### Option 2: Manual Deployment via CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `npm run deploy`

### Project Configuration

The project includes:
- `vercel.json` - Vercel-specific configuration
- `next.config.js` - Next.js production optimizations
- API routes configured for serverless functions
- Static file optimization

### Build Configuration
- **Framework**: Next.js 14
- **Node Version**: 18.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### API Routes
All API routes (`/api/*`) are automatically deployed as Vercel serverless functions with:
- Maximum duration: 30 seconds
- CORS headers configured
- Health check endpoints

### Production Considerations

1. **Environment Variables**: 
   - All `NEXT_PUBLIC_*` variables are exposed to the client
   - Secret variables (like API keys) should NOT have the `NEXT_PUBLIC_` prefix

2. **Backend Integration**:
   - Update `NEXT_PUBLIC_BACKEND_URL` to point to your production backend
   - Ensure CORS is properly configured on your backend

3. **Domain Configuration**:
   - Configure custom domain in Vercel dashboard
   - Update any hardcoded URLs in the codebase

### Monitoring and Logs
- View deployment logs in Vercel dashboard
- Monitor function execution and errors
- Use Vercel Analytics for performance insights

### Rollback Strategy
- Each deployment creates a unique URL
- Easy rollback via Vercel dashboard
- Git-based rollback by reverting commits

### Performance Optimization
- Static assets are automatically optimized
- Images are served via Vercel's image optimization
- CSS and JS are minified and compressed
- CDN distribution globally

### Security
- Environment variables are encrypted at rest
- HTTPS enforced by default
- No sensitive data in client-side code

# ElevenLabs Voice Agent Integration Guide

This guide will help you integrate your ElevenLabs voice agents with the NAVAIA Voice Agent Portal.

## Prerequisites

1. **ElevenLabs Account**: You need an active ElevenLabs account with access to the Conversational AI feature.
2. **Voice Agents**: You should have already created two voice agents in ElevenLabs:
   - One for customer support
   - One for sales and marketing

## Configuration Steps

### 1. Get Your ElevenLabs API Key

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/settings)
2. Navigate to "API Keys" section
3. Copy your API key

### 2. Get Your Agent IDs

1. In ElevenLabs Dashboard, go to "Conversational AI" 
2. Click on your support agent and copy the Agent ID from the URL or settings
3. Do the same for your sales agent

### 3. Set Up Environment Variables

Update your `.env.local` file with the following:

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_actual_api_key_here
ELEVENLABS_SUPPORT_AGENT_ID=your_support_agent_id_here
ELEVENLABS_SALES_AGENT_ID=your_sales_agent_id_here
ELEVENLABS_WEBHOOK_SECRET=your_webhook_secret_here

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 4. Configure Webhooks (Optional)

To receive real-time updates from ElevenLabs:

1. In ElevenLabs Dashboard, go to your agent settings
2. Set webhook URL to: `http://your-domain.com/webhooks/elevenlabs/call_event`
3. Set webhook secret (same as `ELEVENLABS_WEBHOOK_SECRET` in your env)

## Features

### Voice Agent Playground

The playground now supports:

- **Real-time voice conversations** with your ElevenLabs agents
- **Persona switching** between support and sales agents
- **Live transcription** of user speech
- **Voice response playback** from agents
- **Session management** with proper connection handling
- **Error handling** and status indicators

### How to Use

1. **Select Agent Type**: Choose between "دعم العملاء" (Customer Support) or "المبيعات" (Sales)
2. **Start Conversation**: Click the phone button to connect to the selected agent
3. **Talk to Agent**: Click the microphone button and speak
4. **End Session**: Click the phone button again to disconnect

### API Endpoints

The integration provides these new API endpoints:

- `POST /api/elevenlabs` - Start/end ElevenLabs conversations
- `POST /api/voice/sessions` - Create voice sessions
- `DELETE /api/voice/sessions` - End voice sessions

### Backend Integration

The backend is configured to:

- Handle ElevenLabs webhooks for call events
- Store conversation logs and analytics
- Manage user sessions and agent routing
- Process real-time audio streams (when implemented)

## Troubleshooting

### Common Issues

1. **"ElevenLabs API key not configured"**
   - Make sure `ELEVENLABS_API_KEY` is set in `.env.local`
   - Restart your development server after adding environment variables

2. **"Agent ID not configured"**
   - Verify `ELEVENLABS_SUPPORT_AGENT_ID` and `ELEVENLABS_SALES_AGENT_ID` are set
   - Double-check the agent IDs from your ElevenLabs dashboard

3. **"Microphone access denied"**
   - Allow microphone permissions in your browser
   - Use HTTPS in production (required for microphone access)

4. **Connection issues**
   - Check if the backend is running on port 8000
   - Verify network connectivity to ElevenLabs API

### Development vs Production

- **Development**: Uses HTTP and localhost
- **Production**: Requires HTTPS for microphone access and proper CORS setup

## Next Steps

1. **Configure your actual agent IDs** in the environment variables
2. **Test the voice agents** in the playground
3. **Set up webhooks** for real-time event handling
4. **Deploy to production** with HTTPS support
5. **Monitor conversation analytics** in the dashboard

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the backend logs for API errors
3. Verify your ElevenLabs account has sufficient credits
4. Ensure your agents are properly configured in ElevenLabs

The integration is now ready to use with your actual ElevenLabs voice agents!
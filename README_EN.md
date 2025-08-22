# Agentic Navaia

A comprehensive voice agent platform built with Next.js and FastAPI, featuring real-time voice conversations powered by ElevenLabs ConvAI.

## 🎯 Features

- **Real-time Voice Conversations**: Direct integration with ElevenLabs ConvAI using WebSocket connections
- **Multi-Agent Support**: Support and Sales agents with different personalities and capabilities
- **Session Management**: Persistent voice session tracking with SQLite database
- **Voice Analytics**: Real-time transcript processing and conversation analytics
- **Modern Stack**: Next.js 14 with App Router, FastAPI backend, TypeScript throughout
- **Development Ready**: Hot reload, comprehensive logging, and development tools

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Voice Integration**: `@elevenlabs/react` SDK for real-time voice processing
- **UI Components**: React with Tailwind CSS
- **State Management**: React hooks with TypeScript
- **API Routes**: Server-side API endpoints for backend communication

### Backend (FastAPI)
- **Framework**: FastAPI with async/await support
- **Database**: SQLite for development, easily extensible to PostgreSQL
- **Session Management**: Voice session lifecycle management
- **Health Checks**: Built-in health monitoring endpoints

### Voice Processing
- **Provider**: ElevenLabs ConvAI
- **Connection**: WebSocket-based real-time communication
- **Features**: Speech-to-text, text-to-speech, turn-taking model
- **Agents**: Configurable support and sales agents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.12+
- ElevenLabs API key and agent IDs

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Navaia/Agentic-Navaia.git
   cd Agentic-Navaia
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment**
   ```bash
   cd backend
   python -m venv .venv312
   source .venv312/bin/activate  # On Windows: .venv312\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create `.env.local` in the root directory:
   ```env
   # ElevenLabs Configuration
   ELEVENLABS_API_KEY=your_api_key_here
   ELEVENLABS_SUPPORT_AGENT_ID=your_support_agent_id
   ELEVENLABS_SALES_AGENT_ID=your_sales_agent_id
   
   # Backend URL
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   
   # Client-exposed agent IDs
   NEXT_PUBLIC_ELEVENLABS_SUPPORT_AGENT_ID=your_support_agent_id
   NEXT_PUBLIC_ELEVENLABS_SALES_AGENT_ID=your_sales_agent_id
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   .venv312/bin/python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend server** (in a new terminal)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000 (or 3001 if 3000 is in use)
   - Backend API: http://localhost:8000
   - Playground: http://localhost:3000/playground

## 🧪 Testing

### Health Checks
```bash
# Backend health
curl http://localhost:8000/healthz

# Frontend health  
curl http://localhost:3000/api/healthz
```

### Voice Session Testing
```bash
# Create a voice session
curl -X POST http://localhost:3000/api/voice/sessions \
  -H 'Content-Type: application/json' \
  -d '{"agent_type":"support","customer_id":"test-customer"}'
```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── voice/sessions/ # Voice session management
│   │   │   ├── logs/          # Logging endpoints
│   │   │   └── healthz/       # Health checks
│   │   ├── playground/        # Voice agent testing UI
│   │   └── (other pages)/     # Additional pages
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   │   └── useVoiceAgent.ts   # Main voice agent hook
│   └── lib/                   # Utility libraries
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── models.py         # Database models
│   │   ├── db.py             # Database configuration
│   │   └── routers/          # API route handlers
│   └── requirements.txt      # Python dependencies
├── logs/                     # Application logs
└── docs/                     # Documentation
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key | Yes |
| `ELEVENLABS_SUPPORT_AGENT_ID` | Support agent ID | Yes |
| `ELEVENLABS_SALES_AGENT_ID` | Sales agent ID | Yes |
| `NEXT_PUBLIC_BACKEND_URL` | Backend server URL | Yes |
| `NEXT_PUBLIC_ELEVENLABS_SUPPORT_AGENT_ID` | Public support agent ID | Yes |
| `NEXT_PUBLIC_ELEVENLABS_SALES_AGENT_ID` | Public sales agent ID | Yes |

### ElevenLabs Setup

1. Create an account at [ElevenLabs](https://elevenlabs.io)
2. Set up ConvAI agents for support and sales
3. Copy your API key and agent IDs to the environment file

## 🚧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Backend Development

```bash
cd backend
.venv312/bin/python -m uvicorn app.main:app --reload --port 8000
```

### Adding New Features

1. **Voice Agent Extensions**: Modify `src/hooks/useVoiceAgent.ts`
2. **API Endpoints**: Add routes in `src/app/api/`
3. **Backend Features**: Extend FastAPI app in `backend/app/`
4. **UI Components**: Add React components in `src/components/`

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: The app automatically tries port 3001 if 3000 is in use
2. **Backend connection**: Ensure FastAPI server is running on port 8000
3. **Environment variables**: Restart Next.js after changing `.env.local`
4. **ElevenLabs errors**: Check API key and agent ID configuration

### Debug Logs

- Application logs: `logs/elevenlabs.log`
- Backend logs: `backend/uvicorn.log`
- Browser console for frontend issues

## 📚 Documentation

- [ElevenLabs Integration Guide](./ELEVENLABS_INTEGRATION.md)
- [Voice Agent Context](./context_voice_agent.md)
- [Arabic Documentation](./README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ElevenLabs](https://elevenlabs.io) for the ConvAI platform
- [Next.js](https://nextjs.org) for the React framework
- [FastAPI](https://fastapi.tiangolo.com) for the Python backend
- [Vercel](https://vercel.com) for deployment platform

---

Built with ❤️ by the Navaia team

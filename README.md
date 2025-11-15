# Neuro Insight - Customer Behaviour Intelligence Engine

A sophisticated AI-powered chat application built with Next.js that provides intelligent customer behavior insights through conversational AI. This application features a modern glassmorphism UI design and integrates with AWS Bedrock for advanced AI capabilities.

## 🚀 Features

### Core Functionality
- **Intelligent Chat Interface**: Advanced conversational AI powered by AWS Bedrock
- **Session Management**: Create, manage, and switch between multiple chat sessions
- **Real-time Responses**: Seamless communication with backend AI services
- **Structured Data Display**: Enhanced rendering of tables, suggestions, and formatted responses
- **Message Actions**: Export, share, and capture chat responses

### UI/UX Features
- **Glassmorphism Design**: Modern glass-effect UI with backdrop blur effects
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Interactive Sidebar**: Chat history with session management
- **Message Snapshots**: Capture and download assistant responses as images
- **Integration Actions**: Quick share to Gmail, Google Chat, and Calendar
- **Gradient Theming**: Beautiful purple-to-pink gradient background

### Technical Features
- **TypeScript Support**: Full type safety throughout the application
- **Next.js 14**: Latest Next.js with App Router architecture
- **API Integration**: RESTful API communication with AWS backend
- **Error Handling**: Graceful fallback to mock responses when backend is unavailable
- **Canvas Rendering**: HTML2Canvas integration for message snapshots
- **Session Persistence**: Client-side session management with unique identifiers

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14.0.0**: React framework with App Router
- **React 18**: Latest React with hooks and modern patterns
- **TypeScript 5**: Static type checking and enhanced developer experience

### Styling & UI
- **CSS3**: Custom CSS with advanced features (backdrop-filter, gradients)
- **Glassmorphism**: Modern UI design pattern with transparency effects
- **Responsive Design**: Mobile-first approach with flexible layouts

### Libraries & Tools
- **html2canvas 1.4.1**: Screenshot and image capture functionality
- **Crypto API**: UUID generation for session management
- **Clipboard API**: Modern clipboard operations for sharing

### Backend Integration
- **AWS Bedrock**: AI/ML service for conversational AI
- **Elastic Beanstalk**: Backend deployment on AWS
- **RESTful APIs**: Standard HTTP communication protocols

## 📁 Project Structure

```
binary-beast-fe/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes
│   │   └── chat/          # Chat API endpoint
│   │       └── route.ts   # Backend communication logic
│   ├── globals.css        # Global styles and theme
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Home page component
├── components/            # React components
│   └── Chat.tsx          # Main chat interface component
├── public/               # Static assets
│   ├── logo.png         # Application logo
│   ├── gmail.png        # Gmail integration icon
│   ├── gchat.png        # Google Chat icon
│   ├── gallery.png      # Gallery/download icon
│   └── calender.png     # Calendar integration icon
├── package.json         # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── next.config.js      # Next.js configuration
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn package manager
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd binary-beast-fe
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
```

3. **Run the development server**:
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🔧 Configuration

### Environment Setup
The application connects to an AWS Bedrock backend. The API endpoint is configured in:
```typescript
// app/api/chat/route.ts
const API_ENDPOINT = 'http://Binarybeast-be-2-env.eba-ygepewfy.ap-southeast-1.elasticbeanstalk.com/api/bedrock/chat/rag'
```

### Next.js Configuration
```javascript
// next.config.js
const nextConfig = {
  images: {
    unoptimized: true  // Optimized for static deployment
  }
}
```

## 🎨 Design System

### Color Palette
- **Primary Gradient**: `linear-gradient(135deg, #171953 0%, #f11fb9 100%)`
- **Accent Pink**: `#f11fb9`
- **Deep Blue**: `#171953`
- **Glass Effects**: `rgba(255, 255, 255, 0.1)` with backdrop blur

### Typography
- **Font Family**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Responsive Sizing**: Fluid typography with rem units

## 🔌 API Integration

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
  - `X-Session-Id: <session-uuid>` (optional)
- **Body**: `{ "message": "user input" }`
- **Response**: Plain text AI response

### Error Handling
- Automatic fallback to mock responses when backend is unavailable
- User-friendly error messages
- Graceful degradation of functionality

## 🚀 Features Deep Dive

### Session Management
- Each chat session has a unique UUID
- Sessions persist in browser memory
- Automatic title generation from first message
- Session switching with preserved message history

### Message Rendering
- **Markdown Tables**: Automatic detection and structured rendering
- **Suggestions**: Special formatting for AI recommendations
- **HTML Formatting**: Safe HTML rendering with line breaks and lists

### Export & Sharing
- **Screenshot Capture**: HTML2Canvas integration for message snapshots
- **Gmail Integration**: Direct compose with pre-filled content
- **Clipboard Operations**: Modern Clipboard API for image copying
- **Download Options**: PNG export of assistant responses

## 🔒 Security Considerations

- **XSS Protection**: Controlled HTML rendering with `dangerouslySetInnerHTML`
- **CORS Handling**: Proper cross-origin request management
- **Input Sanitization**: Client-side input validation
- **Session Isolation**: UUID-based session management

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Required APIs**: Fetch, Clipboard, Canvas, Crypto (UUID)
- **Fallback Support**: Graceful degradation for unsupported features

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch-Friendly**: Appropriate touch targets and interactions
- **Viewport Optimization**: Proper meta viewport configuration

## 🚀 Deployment

### Static Export
```bash
npm run build
# Serve the out/ directory
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Neuro Insight** - Transforming customer behavior analysis through intelligent conversation.
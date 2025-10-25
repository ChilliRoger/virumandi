# Virumandi - GitHub Repository Analyzer

A full-stack web application that analyzes public GitHub repositories and provides detailed insights with humorous commentary.

## Features

- **GitHub OAuth Authentication** - Secure login with your GitHub account
- **Deep Repository Analysis** - Get comprehensive metrics including:
  - Stars, forks, watchers, and open issues
  - Total commits count
  - Contributor details with avatars
  - Programming language breakdown with percentages
  - Creation and last update dates
- **Humorous Roasts** - Receive brutally honest and funny commentary based on repository metrics
- **Modern Bento-box Layout** - Clean, responsive design with CSS modules
- **Mobile-Friendly** - Fully responsive across all devices

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19.2
- CSS Modules (no frameworks)
- Responsive Bento-style grid layout

### Backend
- Node.js with Express
- GitHub OAuth 2.0
- GitHub REST API integration
- CORS enabled for local development

## Prerequisites

- Node.js 16+ installed
- GitHub account
- GitHub OAuth App created

## Setup Instructions

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Virumandi (or your choice)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3001/auth/callback`
4. Click "Register application"
5. Note down your **Client ID** and generate a **Client Secret**

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your GitHub credentials:
# GITHUB_CLIENT_ID=your_client_id_here
# GITHUB_CLIENT_SECRET=your_client_secret_here
# SESSION_SECRET=generate_a_random_string_here

# Start the backend server
node server.js
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. Visit `http://localhost:3000`
2. Click "Login with GitHub"
3. Authorize the application
4. Paste any public GitHub repository URL (e.g., `https://github.com/facebook/react`)
5. Click "Analyze" to get detailed insights

## Project Structure

```
virumandi/
├── backend/
│   ├── server.js          # Express server setup
│   ├── analyzer.js        # Repository analysis logic
│   ├── github.js          # GitHub OAuth handlers
│   ├── package.json
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── app/
│   │   ├── layout.js      # Root layout with metadata
│   │   ├── page.js        # Landing page
│   │   ├── home.module.css
│   │   ├── globals.css    # Global styles
│   │   └── dashboard/
│   │       ├── page.js           # Dashboard component
│   │       ├── layout.js         # Dashboard layout with Suspense
│   │       └── dashboard.module.css
│   ├── next.config.mjs    # Next.js configuration
│   └── package.json
└── README.md
```

## API Endpoints

### Backend (Port 3001)

- `GET /auth/login` - Initiates GitHub OAuth flow
- `GET /auth/callback` - Handles OAuth callback
- `POST /analyze` - Analyzes a repository
  - Body: `{ url: string, token: string }`
  - Returns: Repository details, stats, and roast

## Environment Variables

### Backend (.env)

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_random_session_secret
```

## Features in Detail

### Repository Analysis
- Fetches real-time data from GitHub API
- Calculates commit counts using pagination headers
- Lists top 10 contributors with avatars
- Shows language distribution with percentages
- Displays all major repository metrics

### Roasting Algorithm
The roast is generated based on multiple conditions:
- Star count vs fork ratio
- Issue to star ratio
- Commit count
- Contributor count
- Overall popularity

### Responsive Design
- Desktop: Multi-column Bento grid
- Tablet: Adaptive 2-column layout
- Mobile: Single-column stack

## Security Notes

- Never commit `.env` files
- Rotate GitHub tokens regularly
- Use environment variables for all secrets
- CORS is configured for `localhost:3000` in development

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy (automatic builds on push)

### Backend (Render/Railway)
1. Create new Web Service
2. Connect GitHub repository
3. Add environment variables in dashboard
4. Update OAuth callback URL in GitHub app settings

## Future Enhancements

- [ ] Language usage charts (bar/pie charts)
- [ ] More dynamic and personalized roasts
- [ ] Commit history timeline visualization
- [ ] AI-powered repository summarization
- [ ] User search history
- [ ] Saved analysis feature

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.



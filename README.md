# RidChatAi

A modern AI chat interface powered by GPT models with admin panel for API key management and usage tracking.

## Features

- 🤖 Multiple GPT model support (GPT-4o Mini, GPT-4o, GPT-4.1 variants)
- 💬 Real-time chat interface with message history
- 🔐 Admin panel for API key management
- 📊 Token usage tracking and cost estimation
- 🎨 Dark theme UI similar to ChatGPT
- 📱 Responsive design
- 💾 Local storage for chat sessions and settings

## Deployment on Netlify

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/ridchatai)

### Manual Deployment

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your forked repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Set Environment Variables:**
   - In your Netlify dashboard, go to Site settings > Environment variables
   - Add the following variables:
     ```
     VITE_API_URL=https://ai.sumopod.com/v1/chat/completions
     VITE_API_KEY=your-api-key-here
     ```

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be available at a Netlify URL (e.g., `https://amazing-app-123456.netlify.app`)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ridchatai.git
   cd ridchatai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API key.

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Admin Panel

Access the admin panel at `/admin` with:
- Username: `admin`
- Password: `082254730892`

Features:
- Add/remove API keys
- View token usage statistics
- Monitor costs
- Manage active API keys

## API Configuration

The app uses the SumoPod AI API. You can:
- Use the default API key (set in environment variables)
- Add multiple API keys through the admin panel
- Switch between different API keys

## Models Available

- **GPT-4o Mini**: Fast and efficient
- **GPT-4o**: Advanced reasoning
- **GPT-4.1 Mini**: Latest mini model
- **GPT-4.1 Nano**: Ultra-fast responses
- **GPT-4.1**: Most capable model

## Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Storage**: LocalStorage

## License

MIT License - feel free to use this project for your own purposes.
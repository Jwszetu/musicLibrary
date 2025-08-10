# 🎶 Song Hub - Music Library & Player

A modern React application for discovering, organizing, and playing music with an integrated queue system and beautiful theming.

![React](https://img.shields.io/badge/React-18.0-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-blue?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

## ✨ Features

### 🎵 Music Management
- **Song Library**: Browse and discover an extensive collection of songs
- **Smart Search**: Real-time search through song titles and descriptions with debounced input
- **Rich Metadata**: View song details including artists, tags, descriptions, and submission dates
- **Multi-Platform Links**: Direct links to YouTube, Spotify, and other streaming platforms

### 🎧 Integrated Player & Queue
- **Collapsible Sidebar Player**: Minimizable right-sidebar music player
- **Multi-Platform Playback**: 
  - YouTube videos with full player controls
  - Spotify track previews with autoplay
- **Smart Queue Management**:
  - Add songs to queue or play immediately
  - Drag-and-drop queue reordering
  - Auto-advance to next song (YouTube)
  - Previous/Next navigation with proper state management
- **Queue Persistence**: Observable pattern maintains queue state across components
- **Playback Controls**: Play, pause, skip, and queue management

### 🎨 Modern UI & Theming
- **Dynamic Theme System**: 
  - Light, Dark, and Ocean themes
  - Consistent color palette across all components
  - Smooth theme transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Component Architecture**: Modular, reusable components with consistent styling
- **Accessibility**: Proper disabled states and keyboard navigation

### 📝 Content Management
- **Song Submission**: Easy-to-use form for adding new songs
- **Rich Metadata Support**: Add artists, tags, descriptions, and multiple platform links
- **Real-time Updates**: Instant UI updates after song submission

## 🏗️ Architecture

### Frontend Stack
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for utility-first responsive styling
- **Custom Theme System** with CSS variables and observable pattern
- **Component-based Architecture** with clear separation of concerns

### Backend & Database
- **Supabase** for backend-as-a-service
- **PostgreSQL** database with custom views (`songs_view`)
- **Real-time subscriptions** for live data updates
- **Row Level Security** for data protection

### State Management
- **Observable Pattern**: Custom singleton services for global state
  - `QueueManager`: Music queue and playback state
  - `ThemeManager`: Theme selection and color management
- **Custom React Hooks**: Clean API for accessing global state
- **Local Component State**: React hooks for UI-specific state

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AdvancedSearch.js    # Search with filters and suggestions
│   └── ThemeSwitcher.js     # Theme selection dropdown
├── hooks/               # Custom React hooks
│   ├── useQueue.js         # Queue state and actions
│   ├── useSearch.js        # Search functionality (advanced)
│   └── useTheme.js         # Theme state and actions
├── services/            # Global state managers
│   ├── QueueManager.js     # Observable queue management
│   ├── SearchManager.js    # Advanced search service (unused)
│   └── ThemeManager.js     # Observable theme management
├── themes/              # Theme system
│   ├── themes.js           # Theme definitions and colors
│   ├── global.css          # Theme-aware CSS utilities
│   └── README.md           # Theme system documentation
├── HomePage.js          # Main application component
├── DisplaySongs.js      # Song grid with cards and actions
├── Search.js           # Simple search input component
├── VideoModal.js       # Collapsible player sidebar
├── SubmitSongPage.js   # Song submission modal
├── YoutubePlayer.js    # YouTube iframe integration
├── SpotifyPlayer.js    # Spotify embed integration
├── TagChip.js          # Tag display component
└── supabaseClient.js   # Database configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase project with the required schema

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd biga-music-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   ```sql
   -- Run the SQL from supabase_schema.sql in your Supabase SQL editor
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
```

The build will be optimized and ready for deployment to services like Vercel, Netlify, or any static hosting.

## 🎯 Usage

### Adding Songs
1. Click "Submit New Song" in the navigation
2. Fill in song details (title, description, artists, tags)
3. Add platform links (YouTube, Spotify, etc.)
4. Submit to add to the library

### Playing Music
1. Browse songs in the main grid
2. Click "▶️ Play Now" to start playing immediately
3. Click "➕ Add to Queue" to add to the playback queue
4. Use the sidebar player controls for queue management

### Theme Customization
1. Click the theme switcher in the navigation
2. Choose from Light, Dark, or Ocean themes
3. All components adapt automatically

## 🛠️ Technical Features

### Performance Optimizations
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Memoized Components**: Prevent unnecessary rerenders
- **Observable Pattern**: Efficient global state without React Context overhead
- **Lazy Loading**: Components load on demand

### Code Quality
- **ESLint**: Consistent code formatting and best practices
- **Component Modularity**: Reusable, testable components
- **Type Safety**: PropTypes for component interfaces
- **Error Handling**: Graceful error states and user feedback

### Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design for all screen sizes
- Progressive enhancement for older browsers

## 🚢 Deployment

The app is configured for easy deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main

Alternatively, deploy to any static hosting service using the `build` folder.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **Tailwind CSS** for the utility-first CSS framework
- **React** team for the amazing frontend library
- **YouTube** and **Spotify** for their embeddable players

---

Built with ❤️ for music lovers everywhere 🎵
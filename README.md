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

### 🎧 Integrated Media Player & Queue
- **Collapsible Sidebar Player**: Minimizable right-sidebar media player with queue management
- **Multi-Platform Playback**: 
  - YouTube videos with full player controls
  - Spotify track previews with autoplay
- **Smart Queue Management**:
  - Add songs to queue or play immediately
  - Visual queue with track metadata
  - Auto-advance to next song (YouTube)
  - Previous/Next navigation with proper state management
  - Remove tracks from queue with one-click
- **Queue Persistence**: Observable pattern maintains queue state across components
- **Playback Controls**: Play, pause, skip, and comprehensive queue management

### 🎨 Modern UI & Theming
- **Enhanced Theme System**: 
  - Light (gentle purple-tinted), Dark, and Ocean themes
  - Eye-friendly color palettes with reduced eye strain
  - Consistent color hierarchy across all components
  - Smooth theme transitions and animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Component Architecture**: Modular, reusable components with consistent styling
- **Accessibility**: Proper disabled states, keyboard navigation, and color contrast

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
- **Organized File Structure**: Logical grouping by functionality (components, pages, players, features)
- **Modular Design**: Each component has a single responsibility
- **Clean Import Paths**: Consistent relative imports with clear hierarchy

### Backend & Database
- **Supabase** for backend-as-a-service
- **PostgreSQL** database with custom views (`songs_view`)
- **Centralized CRUD Operations**: Clean, reusable database operations class
- **Real-time subscriptions** for live data updates
- **Row Level Security** for data protection
- **Transaction Management**: Atomic operations for complex data relationships

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
│   ├── forms/           # Form-related components
│   │   └── SubmitSongModal.js  # Song submission modal
│   ├── layout/          # Layout & navigation components
│   │   ├── AdvancedSearch.js   # Advanced search with filters
│   │   ├── FilterSortBar.js    # Filtering and sorting controls
│   │   └── Search.js           # Simple search input
│   └── ui/              # Basic UI components
│       ├── Navbar.js           # Main navigation bar
│       ├── TagChip.js          # Tag display component
│       └── ThemeSwitcher.js    # Theme selection dropdown
├── features/            # Feature-specific components
│   └── songs/
│       └── DisplaySongs.js     # Song grid with cards and actions
├── pages/               # Page components
│   ├── AdminPage.js            # Admin interface
│   └── HomePage.js             # Main application page
├── players/             # Media player components
│   ├── MediaPlayer.js          # Main collapsible player with queue
│   ├── SongQueue.js            # Standalone queue component
│   ├── SpotifyPlayer.js        # Spotify embed integration
│   └── YoutubePlayer.js        # YouTube iframe integration
├── hooks/               # Custom React hooks
│   ├── useQueue.js             # Queue state and actions
│   ├── useSearch.js            # Search functionality
│   └── useTheme.js             # Theme state and actions
├── services/            # Global state managers
│   ├── QueueManager.js         # Observable queue management
│   ├── SearchManager.js        # Advanced search service
│   └── ThemeManager.js         # Observable theme management
├── lib/                 # Utilities and configuration
│   ├── supabaseClient.js       # Database configuration
│   └── supabaseCrud.js         # Centralized CRUD operations class
└── themes/              # Theme system
    ├── themes.js               # Theme definitions and colors
    ├── global.css              # Theme-aware CSS utilities
    └── README.md               # Theme system documentation
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

## 🗃️ Database Operations

### Supabase CRUD Class
The application includes a comprehensive CRUD operations class (`supabaseCrud.js`) that provides:

- **Song Operations**: Create, read, update, delete songs with related data
- **Search Functionality**: Intelligent search across titles and descriptions
- **Artist Management**: Automatic artist creation and linking
- **Tag Management**: Dynamic tag creation and association
- **Platform Links**: Multi-platform link management
- **Real-time Subscriptions**: Live data updates across components
- **Error Handling**: Comprehensive error handling with detailed feedback
- **Transaction Safety**: Atomic operations for data integrity

```javascript
// Example usage
import { supabaseCrud } from '../lib/supabaseCrud';

// Get all songs
const { data: songs, error } = await supabaseCrud.getSongs();

// Create a new song with relationships
const songData = {
  title: "New Song",
  description: "A great song",
  artists: ["Artist 1", "Artist 2"],
  tags: ["rock", "indie"],
  links: [{ url: "youtube.com/...", platformId: "1" }]
};
const { data: newSong } = await supabaseCrud.createSong(songData);

// Search songs
const { data: results } = await supabaseCrud.searchSongs("search term");
```

## 🛠️ Technical Features

### Performance Optimizations
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Memoized Components**: Prevent unnecessary rerenders
- **Observable Pattern**: Efficient global state without React Context overhead
- **Lazy Loading**: Components load on demand

### Code Quality
- **Organized Architecture**: Clean file structure with logical component grouping
- **Component Modularity**: Reusable, testable components with single responsibilities
- **Consistent Naming**: Descriptive file and component names reflecting their purpose
- **Clean Imports**: Well-organized import paths following the new structure
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

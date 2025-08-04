# Chess Master - AI-Powered Chess Learning Platform

A modern, AI-enhanced chess application built with React, TypeScript, and OpenAI integration. Perfect for beginners learning chess with intelligent coaching and analysis.

## 🎯 Features

### 🧠 AI-Powered Learning
- **Real-time Move Analysis**: Get instant feedback on your moves with detailed explanations
- **Position Evaluation**: AI analyzes the current board position and provides strategic insights
- **Move Suggestions**: Receive intelligent move recommendations with learning points
- **Game Analysis**: Get comprehensive post-game analysis and improvement tips

### 🎮 Game Modes
- **Player vs Player**: Classic chess between two human players
- **Player vs AI**: Practice against computer with adjustable difficulty levels
  - Easy (1000 rating) - Great for beginners
  - Medium (1400 rating) - Intermediate challenge
  - Hard (1800 rating) - Advanced play
- **Learning Mode**: Interactive tutorials and practice scenarios

### 📚 Learning Center
- **Chapter Progression**: 5 structured chapters with progressive difficulty
- **Universal Passwords**: Skip to any chapter using passwords (like old games!)
- **Opening Lessons**: Learn classic openings like Italian Game and Ruy Lopez
- **Tactical Scenarios**: Practice common tactical patterns and checkmate sequences
- **Strategic Principles**: Master pawn structure, piece placement, and planning
- **Interactive Practice**: Visual board positions with hints and solutions
- **Progress Tracking**: Monitor completion of lessons, scenarios, and principles

### 📊 Progress Tracking
- **Rating System**: ELO-based rating calculation
- **Statistics**: Track wins, losses, draws, and win rate
- **Game History**: Review past games with AI analysis
- **Learning Progress**: Monitor completed lessons and practice sessions

### 🎛️ Advanced Controls
- **AI Assist Toggle**: Enable/disable AI move suggestions
- **Position Analysis**: Get detailed analysis of any position
- **Pause/Resume**: Control game flow during AI games
- **Move History**: View complete game notation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chess
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup (Optional but Recommended)**
   Create a `.env` file in the root directory:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Alternative AI Setup**
   - If you didn't set up the environment file, click the Settings icon (⚙️) in the top-right corner
   - Enter your OpenAI API key there instead

### Using the Application

#### First Time Setup
1. Open the application in your browser
2. Click the Settings icon to configure your OpenAI API key
3. Start with the Learning Center to understand basic concepts
4. Try playing against AI on Easy difficulty

#### Learning Chess
1. **Start with Learning Center**: Go through opening lessons and tactical scenarios
2. **Practice with AI**: Play against AI on Easy difficulty with AI Assist enabled
3. **Analyze Your Games**: Use the Analyze button to understand your moves
4. **Track Progress**: Monitor your rating and statistics on the home page

#### Advanced Features
- **AI Assist**: Enable to get move suggestions during play
- **Position Analysis**: Click "Analyze" to get detailed position evaluation
- **Game Pause**: Pause AI games to think about your moves
- **Move History**: Review your games move by move

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation

### Chess Engine
- **Chess.js** for game logic and move validation
- **React-Chessboard** for visual chess interface
- **Custom AI Engine** with minimax algorithm and alpha-beta pruning

### AI Integration
- **OpenAI GPT-3.5-turbo** for move explanations and analysis
- **Local Storage** for saving progress and settings
- **No Backend Required** - Everything runs in the browser

### Key Components
- `src/utils/aiService.ts` - OpenAI API integration
- `src/utils/storageService.ts` - Local storage management
- `src/store/gameStore.ts` - Application state management
- `src/utils/chessAI.ts` - Chess engine and move calculation

## 🎓 Learning Path

### Chapter Progression
The learning system is organized into 5 chapters:

1. **Chess Fundamentals** (Password: `CHESS101`)
   - Basic piece movement and center control
   - Simple checkmate patterns
   - Fundamental principles

2. **Opening Principles** (Password: `OPENING202`)
   - Italian Game and Ruy Lopez
   - Opening traps and development
   - Rating requirement: 800+

3. **Tactical Mastery** (Password: `TACTICS303`)
   - Pins, forks, and skewers
   - Tactical combinations
   - Rating requirement: 1000+

4. **Strategic Planning** (Password: `STRATEGY404`)
   - Pawn structure and piece placement
   - Positional play concepts
   - Rating requirement: 1200+

5. **Endgame Excellence** (Password: `ENDGAME505`)
   - King and pawn endgames
   - Rook and queen endgames
   - Rating requirement: 1400+

### Beginner (Rating < 1000)
1. Start with Chapter 1: Chess Fundamentals
2. Complete all lessons, scenarios, and principles
3. Play against AI on Easy difficulty
4. Enable AI Assist for move suggestions

### Intermediate (Rating 1000-1500)
1. Study strategic principles
2. Practice advanced tactical scenarios
3. Play against AI on Medium difficulty
4. Use position analysis to understand complex positions

### Advanced (Rating 1500+)
1. Master advanced openings
2. Practice endgame scenarios
3. Play against AI on Hard difficulty
4. Analyze games for strategic improvements

## 🔧 Customization

### Adding New Openings
Edit `src/data/learningContent.ts`:
```typescript
export const openingLessons: OpeningLesson[] = [
  {
    name: "Your Opening",
    moves: ["e4", "e5", "Nf3"],
    explanation: "Description of the opening",
    principles: ["Principle 1", "Principle 2"]
  }
];
```

### Adding New Scenarios
```typescript
export const scenarios: ChessScenario[] = [
  {
    title: "Your Scenario",
    description: "Description",
    position: "FEN string",
    objective: "What to achieve",
    solution: ["move1", "move2"],
    hints: ["Hint 1", "Hint 2"]
  }
];
```

### Modifying AI Behavior
Edit `src/utils/aiService.ts` to customize AI prompts and responses.

## 📱 Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🔒 Privacy & Security
- All data is stored locally in your browser
- API keys are stored securely in local storage
- No data is sent to external servers except OpenAI API calls
- You can clear all data using browser developer tools

## 🐛 Troubleshooting

### AI Features Not Working
1. Check if you've entered a valid OpenAI API key in Settings
2. Ensure you have sufficient API credits
3. Check browser console for error messages

### Game Not Loading
1. Clear browser cache and local storage
2. Check if all dependencies are installed
3. Restart the development server

### Performance Issues
1. Disable AI Assist for faster gameplay
2. Close other browser tabs
3. Use a modern browser with good performance

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is open source and available under the MIT License.

## 🙏 Acknowledgments
- Chess.js for the chess engine
- React-Chessboard for the visual interface
- OpenAI for AI capabilities
- Lucide React for icons

---

**Happy Learning! ♟️** 
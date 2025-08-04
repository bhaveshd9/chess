import { OpeningLesson, ChessScenario, StrategicPrinciple, Chapter } from '../types/chess';

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Chess Fundamentals",
    description: "Learn the basics of chess movement and strategy",
    icon: "♟️",
    color: "bg-green-500",
    requiredRating: 0,
    lessons: ["basic-movement", "center-control", "piece-value"],
    scenarios: ["basic-checkmate", "simple-fork"],
    principles: ["basic-principles"],
    password: "" // No password needed for first chapter
  },
  {
    id: 2,
    title: "Opening Principles",
    description: "Master the fundamental opening concepts",
    icon: "🏰",
    color: "bg-blue-500",
    requiredRating: 800,
    lessons: ["italian-game", "ruy-lopez", "opening-principles"],
    scenarios: ["opening-trap", "development-advantage"],
    principles: ["opening-strategy"],
    password: "OPENING202"
  },
  {
    id: 3,
    title: "Tactical Mastery",
    description: "Learn essential tactical patterns",
    icon: "⚡",
    color: "bg-purple-500",
    requiredRating: 1000,
    lessons: ["pins", "forks", "skewers"],
    scenarios: ["tactical-combination", "double-attack"],
    principles: ["tactical-thinking"],
    password: "TACTICS303"
  },
  {
    id: 4,
    title: "Strategic Planning",
    description: "Develop long-term strategic thinking",
    icon: "🎯",
    color: "bg-orange-500",
    requiredRating: 1200,
    lessons: ["pawn-structure", "piece-placement", "king-safety"],
    scenarios: ["strategic-advantage", "positional-play"],
    principles: ["strategic-planning"],
    password: "STRATEGY404"
  },
  {
    id: 5,
    title: "Endgame Excellence",
    description: "Master essential endgame techniques",
    icon: "👑",
    color: "bg-red-500",
    requiredRating: 1400,
    lessons: ["king-pawn-endgame", "rook-endgame", "queen-endgame"],
    scenarios: ["endgame-technique", "conversion"],
    principles: ["endgame-principles"],
    password: "ENDGAME505"
  }
];

export const openingLessons: OpeningLesson[] = [
  {
    id: "basic-movement",
    name: "Basic Piece Movement",
    moves: [],
    explanation: "Learn how each piece moves on the chessboard. Understanding piece movement is the foundation of chess strategy.",
    principles: [
      "Pawns move forward one square (or two on first move)",
      "Knights move in L-shape: 2 squares in one direction, then 1 square perpendicular",
      "Bishops move diagonally any number of squares",
      "Rooks move horizontally and vertically any number of squares",
      "Queens combine the movement of bishops and rooks",
      "Kings move one square in any direction"
    ],
    chapter: 1
  },
  {
    id: "center-control",
    name: "Center Control",
    moves: ["e4", "e5", "d4", "d5"],
    explanation: "Controlling the center of the board is crucial in chess. It gives your pieces more mobility and restricts your opponent's options.",
    principles: [
      "Control the center squares (e4, e5, d4, d5)",
      "Develop pieces toward the center",
      "Use pawns to establish center control",
      "Prevent opponent from controlling the center"
    ],
    chapter: 1
  },
  {
    id: "piece-value",
    name: "Piece Values",
    moves: [],
    explanation: "Understanding the relative value of pieces helps you make better tactical decisions and evaluate positions.",
    principles: [
      "Pawn = 1 point",
      "Knight = 3 points",
      "Bishop = 3 points",
      "Rook = 5 points",
      "Queen = 9 points",
      "King = priceless (but roughly 3-4 points in endgame)"
    ],
    chapter: 1
  },
  {
    id: "italian-game",
    name: "Italian Game",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    explanation: "The Italian Game is one of the oldest recorded chess openings. It creates an immediate battle for the center and develops pieces rapidly.",
    principles: [
      "Control the center with pawns",
      "Develop knights before bishops",
      "Aim to castle early",
      "Don't move the same piece twice in the opening"
    ],
    chapter: 2
  },
  {
    id: "ruy-lopez",
    name: "Ruy Lopez",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    explanation: "The Ruy Lopez is considered one of the most logical and testing replies to 1.e4 e5. It pins the knight and creates pressure on Black's position.",
    principles: [
      "Pin opponent's pieces to restrict their movement",
      "Create tension in the center",
      "Prepare for long-term strategic play",
      "Control key squares"
    ],
    chapter: 2
  },
  {
    id: "opening-principles",
    name: "Opening Principles",
    moves: [],
    explanation: "Follow these fundamental principles to start your games correctly and avoid common opening mistakes.",
    principles: [
      "Control the center",
      "Develop your pieces quickly",
      "Castle early for king safety",
      "Don't move the same piece twice unnecessarily",
      "Don't bring out the queen too early",
      "Connect your rooks"
    ],
    chapter: 2
  },
  {
    id: "pins",
    name: "Pins",
    moves: [],
    explanation: "A pin is a tactical motif where a piece is attacked and cannot move without exposing a more valuable piece behind it.",
    principles: [
      "Look for pieces that can be pinned",
      "Use bishops and rooks for pins",
      "Pinned pieces lose their mobility",
      "Pins can lead to material gain"
    ],
    chapter: 3
  },
  {
    id: "forks",
    name: "Forks",
    moves: [],
    explanation: "A fork is a tactical motif where one piece attacks two or more pieces simultaneously, forcing the opponent to lose material.",
    principles: [
      "Knights are excellent forking pieces",
      "Look for pieces on the same rank, file, or diagonal",
      "Pawns can also create powerful forks",
      "Forks often lead to material advantage"
    ],
    chapter: 3
  },
  {
    id: "skewers",
    name: "Skewers",
    moves: [],
    explanation: "A skewer is similar to a pin, but the more valuable piece is in front and must move, exposing the less valuable piece behind it.",
    principles: [
      "Use long-range pieces (bishops, rooks, queens)",
      "Look for pieces on the same line",
      "Skewers often target the king",
      "Can lead to material gain or checkmate"
    ],
    chapter: 3
  },
  {
    id: "pawn-structure",
    name: "Pawn Structure",
    moves: [],
    explanation: "Pawn structure is the foundation of positional play. Understanding pawn structures helps you plan long-term strategy.",
    principles: [
      "Connected pawns are stronger than isolated pawns",
      "Doubled pawns restrict mobility",
      "Passed pawns should be advanced",
      "Pawn chains create weaknesses and strengths"
    ],
    chapter: 4
  },
  {
    id: "piece-placement",
    name: "Piece Placement",
    moves: [],
    explanation: "Proper piece placement is crucial for both attack and defense. Good piece placement creates coordination and restricts your opponent.",
    principles: [
      "Knights belong on outposts",
      "Bishops on open diagonals",
      "Rooks on open files",
      "Queen behind pawn chains"
    ],
    chapter: 4
  },
  {
    id: "king-safety",
    name: "King Safety",
    moves: [],
    explanation: "Keeping your king safe is essential throughout the game. An exposed king is vulnerable to attack and can lead to checkmate.",
    principles: [
      "Castle early in most games",
      "Keep pawns in front of castled king",
      "Don't weaken your king's position unnecessarily",
      "Attack the opponent's king when possible"
    ],
    chapter: 4
  },
  {
    id: "king-pawn-endgame",
    name: "King and Pawn Endgames",
    moves: [],
    explanation: "King and pawn endgames are fundamental and occur frequently. Understanding these endgames is essential for converting advantages.",
    principles: [
      "The king is a strong piece in endgames",
      "Pawn races are common",
      "Opposition is crucial",
      "Square counting helps evaluate positions"
    ],
    chapter: 5
  },
  {
    id: "rook-endgame",
    name: "Rook Endgames",
    moves: [],
    explanation: "Rook endgames are the most common type of endgame. They require precise technique and understanding of key principles.",
    principles: [
      "Rooks belong behind passed pawns",
      "Cut off the enemy king",
      "Active rooks are more valuable",
      "Philidor's defense is a key technique"
    ],
    chapter: 5
  },
  {
    id: "queen-endgame",
    name: "Queen Endgames",
    moves: [],
    explanation: "Queen endgames are complex and tactical. They often involve perpetual checks and require careful calculation.",
    principles: [
      "Queens are powerful but vulnerable",
      "Perpetual checks are common",
      "King safety is crucial",
      "Material advantage is often decisive"
    ],
    chapter: 5
  }
];

export const scenarios: ChessScenario[] = [
  {
    id: "basic-checkmate",
    title: "Basic Checkmate",
    description: "Learn the fundamental checkmate pattern with queen and king",
    position: "4k3/8/8/8/8/8/8/4QK2 w - - 0 1",
    objective: "Checkmate the black king using your queen",
    solution: ["Qe8#"],
    hints: [
      "The queen can control many squares",
      "Look for squares that attack the king",
      "Remember the king cannot move into check"
    ],
    chapter: 1,
    difficulty: "beginner"
  },
  {
    id: "simple-fork",
    title: "Simple Fork",
    description: "Practice using a knight fork to win material",
    position: "4k3/8/8/8/3N4/8/6q1/4r3 w - - 0 1",
    objective: "Use the knight to fork the king and another piece",
    solution: ["Nf5+"],
    hints: [
      "Knights are excellent for double attacks",
      "Look for squares that attack multiple pieces",
      "The king must move when checked"
    ],
    chapter: 1,
    difficulty: "beginner"
  },
  {
    id: "opening-trap",
    title: "Opening Trap",
    description: "Learn to recognize and avoid common opening traps",
    position: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 0 1",
    objective: "Find the winning move for Black",
    solution: ["Qh4+"],
    hints: [
      "Look for immediate tactical opportunities",
      "The white king is exposed",
      "Check often leads to material gain"
    ],
    chapter: 2,
    difficulty: "beginner"
  },
  {
    id: "development-advantage",
    title: "Development Advantage",
    description: "Learn to convert a development advantage into a winning position",
    position: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
    objective: "Exploit your development advantage",
    solution: ["Bxf7+", "Kxf7", "Qd5+"],
    hints: [
      "White has more pieces developed",
      "Look for tactical opportunities",
      "Sacrifices can lead to checkmate"
    ],
    chapter: 2,
    difficulty: "intermediate"
  },
  {
    id: "tactical-combination",
    title: "Tactical Combination",
    description: "Practice combining multiple tactical motifs",
    position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    objective: "Find the winning combination",
    solution: ["Nxe5", "Nxe5", "Qd5"],
    hints: [
      "Look for pieces that can be attacked",
      "Consider the consequences of each move",
      "Tactics often involve multiple moves"
    ],
    chapter: 3,
    difficulty: "intermediate"
  },
  {
    id: "double-attack",
    title: "Double Attack",
    description: "Learn to create and execute double attacks",
    position: "4k3/8/8/8/3N4/8/6q1/4r3 w - - 0 1",
    objective: "Create a double attack with your knight",
    solution: ["Nf5+"],
    hints: [
      "Knights are excellent for double attacks",
      "Look for squares that attack multiple pieces",
      "The king must move when checked"
    ],
    chapter: 3,
    difficulty: "intermediate"
  },
  {
    id: "strategic-advantage",
    title: "Strategic Advantage",
    description: "Learn to convert a strategic advantage into a win",
    position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    objective: "Exploit your strategic advantage",
    solution: ["O-O", "Bc5", "Re1"],
    hints: [
      "Castling improves king safety",
      "Control open files with rooks",
      "Develop all pieces before attacking"
    ],
    chapter: 4,
    difficulty: "advanced"
  },
  {
    id: "positional-play",
    title: "Positional Play",
    description: "Practice positional chess concepts",
    position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    objective: "Improve your position",
    solution: ["O-O", "Bc5", "Re1"],
    hints: [
      "Look for weak squares",
      "Control important diagonals",
      "Improve piece placement"
    ],
    chapter: 4,
    difficulty: "advanced"
  },
  {
    id: "endgame-technique",
    title: "Endgame Technique",
    description: "Practice essential endgame techniques",
    position: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    objective: "Win the pawn endgame",
    solution: ["Kd2", "Kd7", "Ke3"],
    hints: [
      "The king is a strong piece in endgames",
      "Use opposition to gain squares",
      "Calculate carefully"
    ],
    chapter: 5,
    difficulty: "advanced"
  },
  {
    id: "conversion",
    title: "Converting Advantage",
    description: "Learn to convert a material advantage into a win",
    position: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    objective: "Convert your advantage",
    solution: ["Kd2", "Kd7", "Ke3"],
    hints: [
      "Material advantage should be converted",
      "Don't rush, play accurately",
      "Technique is crucial"
    ],
    chapter: 5,
    difficulty: "advanced"
  }
];

export const strategicPrinciples: StrategicPrinciple[] = [
  {
    id: "basic-principles",
    title: "Basic Chess Principles",
    concepts: [
      "Control the center",
      "Develop pieces quickly",
      "Castle early",
      "Don't move the same piece twice unnecessarily",
      "Don't bring out the queen too early",
      "Connect your rooks"
    ],
    chapter: 1,
    examples: [
      "e4 e5 - Both players control center squares",
      "Nf3 Nc6 - Developing knights toward the center",
      "O-O - Castling for king safety"
    ]
  },
  {
    id: "opening-strategy",
    title: "Opening Strategy",
    concepts: [
      "Control key squares",
      "Develop with tempo",
      "Create pawn structure",
      "Prepare for middlegame",
      "Avoid weaknesses",
      "Coordinate pieces"
    ],
    chapter: 2,
    examples: [
      "Bc4 - Controls f7 square",
      "d4 - Establishes center control",
      "Nc3 - Develops with tempo"
    ]
  },
  {
    id: "tactical-thinking",
    title: "Tactical Thinking",
    concepts: [
      "Look for forcing moves",
      "Calculate variations",
      "Recognize patterns",
      "Evaluate positions",
      "Find combinations",
      "Exploit weaknesses"
    ],
    chapter: 3,
    examples: [
      "Checks, captures, and threats",
      "Pins, forks, and skewers",
      "Discovered attacks"
    ]
  },
  {
    id: "strategic-planning",
    title: "Strategic Planning",
    concepts: [
      "Evaluate pawn structure",
      "Control key squares",
      "Improve piece placement",
      "Create weaknesses",
      "Plan long-term",
      "Coordinate forces"
    ],
    chapter: 4,
    examples: [
      "Weak squares and outposts",
      "Open files and diagonals",
      "Pawn chains and breaks"
    ]
  },
  {
    id: "endgame-principles",
    title: "Endgame Principles",
    concepts: [
      "King activity is crucial",
      "Pawn structure matters",
      "Piece coordination",
      "Technique over tactics",
      "Calculate accurately",
      "Know key positions"
    ],
    chapter: 5,
    examples: [
      "Opposition in king and pawn endgames",
      "Rook behind passed pawns",
      "Philidor's defense"
    ]
  }
];
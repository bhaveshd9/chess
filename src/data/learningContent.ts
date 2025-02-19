import { OpeningLesson, ChessScenario } from '../types/chess';

export const openingLessons: OpeningLesson[] = [
  {
    name: "Italian Game",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    explanation: "The Italian Game is one of the oldest recorded chess openings. It creates an immediate battle for the center and develops pieces rapidly.",
    principles: [
      "Control the center with pawns",
      "Develop knights before bishops",
      "Aim to castle early",
      "Don't move the same piece twice in the opening"
    ]
  },
  {
    name: "Ruy Lopez",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    explanation: "The Ruy Lopez is considered one of the most logical and testing replies to 1.e4 e5. It pins the knight and creates pressure on Black's position.",
    principles: [
      "Pin opponent's pieces to restrict their movement",
      "Create tension in the center",
      "Prepare for long-term strategic play",
      "Control key squares"
    ]
  }
];

export const scenarios: ChessScenario[] = [
  {
    title: "Back Rank Checkmate",
    description: "Learn how to execute and defend against the back rank checkmate",
    position: "4k3/4pppp/8/8/8/8/8/4R3 w - - 0 1",
    objective: "Checkmate the black king using the rook",
    solution: ["Re8#"],
    hints: [
      "The black king is restricted by its own pawns",
      "The rook controls the back rank",
      "Look for a direct checkmate"
    ]
  },
  {
    title: "Double Attack with Knight",
    description: "Practice using knight forks to attack multiple pieces",
    position: "4k3/8/8/8/3N4/8/6q1/4r3 w - - 0 1",
    objective: "Use the knight to fork the king and another piece",
    solution: ["Nf5+"],
    hints: [
      "Knights are excellent for double attacks",
      "Look for squares that attack multiple pieces",
      "The king must move when checked"
    ]
  }
];

export const strategicPrinciples = [
  {
    title: "Pawn Structure",
    concepts: [
      "Connected pawns are stronger",
      "Isolated pawns are weak",
      "Doubled pawns restrict mobility",
      "Passed pawns should be advanced"
    ]
  },
  {
    title: "Piece Placement",
    concepts: [
      "Knights on outposts",
      "Bishops on open diagonals",
      "Rooks on open files",
      "Queen behind pawn chains"
    ]
  }
];
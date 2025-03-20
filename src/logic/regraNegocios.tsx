import { useState } from "react";
type BoardType = { playerID: number; index: number }[];
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function useTicTacToe() {
  const [gameData, setGameData] = useState<BoardType>(
    Array(9).fill({ playerID: 0, index: 0 })
  );
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState<number | null>(null);
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);

  const resetGame = () => {
    setGameData(Array(9).fill({ playerID: 0, index: 0 }));
    setWinner(null);
    setTurn(1);
  };

  const checkWinner = (updatedGameData: typeof gameData) => {
    for (let values of winningCombinations) {
      if (
        updatedGameData[values[0]].playerID === turn &&
        updatedGameData[values[1]].playerID === turn &&
        updatedGameData[values[2]].playerID === turn
      ) {
        setWinner(turn);
        setWinningCombo(values);
        return turn;
      }
    }

    if (updatedGameData.every((item) => item.playerID !== 0)) {
      setWinner(0);
      return 0;
    }

    return null;
  };

  const checkWinner2 = (board: BoardType): number | "draw" | null => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        board[a].playerID !== 0 &&
        board[a].playerID === board[b].playerID &&
        board[a].playerID === board[c].playerID
      ) {
        return board[a].playerID;
      }
    }

    return board.some((cell) => cell.playerID === 0) ? null : "draw";
  };

  const minimax = (
    board: BoardType,
    depth: number,
    isMaximizing: boolean
  ): number => {
    const winner2 = checkWinner2(board);
    if (winner2 === 1) return 100 - depth;
    if (winner2 === 2) return depth - 100;
    if (winner2 === "draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i].playerID === 0) {
          board[i] = { ...board[i], playerID: 1 }; // Simula a jogada
          let score = minimax(board, depth + 1, false);
          board[i] = { ...board[i], playerID: 0 }; // Desfaz a jogada
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i].playerID === 0) {
          board[i] = { ...board[i], playerID: 2 }; // Simula a jogada
          let score = minimax(board, depth + 1, true);
          board[i] = { ...board[i], playerID: 0 }; // Desfaz a jogada
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  };

  const bestMove = (board: BoardType, playerID: number): number | null => {
    let bestScore = playerID === 1 ? -Infinity : Infinity;
    let move: number | null = null;

    for (let i = 0; i < board.length; i++) {
      if (board[i].playerID === 0) {
        board[i] = { ...board[i], playerID }; // Simula a jogada
        let score = minimax(board, 0, playerID === 2);
        board[i] = { ...board[i], playerID: 0 }; // Desfaz a jogada

        if (
          (playerID === 1 && score > bestScore) ||
          (playerID === 2 && score < bestScore)
        ) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  return {
    gameData,
    setGameData,
    turn,
    setTurn,
    winner,
    checkWinner,
    winningCombo,
    bestMove,
    resetGame,
  };
}

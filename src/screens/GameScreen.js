import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import theme from '../theme';
import healthQuestions from '../data/questions';
import {
  checkWinner,
  checkDraw,
  getAIMove,
  createEmptyBoard,
} from '../utils/gameLogic';

export default function GameScreen({ route, navigation }) {
  const { gameMode, player1Name, player2Name } = route.params;

  // Estado do jogo
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'wrong', text }
  const [answeredDisabled, setAnsweredDisabled] = useState(false);
  const [gameOverMsg, setGameOverMsg] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const lastQuestionIdx = useRef(-1);

  // Carrega uma nova pergunta
  const loadQuestion = useCallback(() => {
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * healthQuestions.length);
    } while (newIdx === lastQuestionIdx.current && healthQuestions.length > 1);
    lastQuestionIdx.current = newIdx;
    setCurrentQuestion(healthQuestions[newIdx]);
    setFeedback(null);
    setAnswered(false);
    setAnsweredDisabled(false);
  }, []);

  // Carrega pergunta inicial
  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  // Nome do jogador atual
  const currentName = currentPlayer === 'X' ? player1Name : player2Name;

  // Responde a pergunta
  const handleAnswer = (index) => {
    if (answeredDisabled || gameOver) return;

    const isCorrect = index === currentQuestion.correct;
    setAnsweredDisabled(true);

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        text: '✓ Correto! Escolha uma casa no tabuleiro.',
      });
      setAnswered(true);
    } else {
      const nextPlayerName = currentPlayer === 'X' ? player2Name : player1Name;
      setFeedback({
        type: 'wrong',
        text: `✗ Incorreto! Vez de ${nextPlayerName}.`,
      });
      setAnswered(false);

      // Troca turno após delay
      setTimeout(() => {
        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);

        if (gameMode === 'ai' && nextPlayer === 'O') {
          // IA joga
          setTimeout(() => doAITurn(board), 800);
        } else {
          loadQuestion();
        }
      }, 1500);
    }
  };

  // Faz jogada no tabuleiro
  const handleMove = (index) => {
    if (board[index] !== '' || !answered || gameOver || aiThinking) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setAnswered(false);

    // Verifica resultado
    const result = checkWinner(newBoard);
    if (result) {
      setGameOver(true);
      if (result.winner === 'X') {
        setPlayerScore((s) => s + 1);
        setGameOverMsg(`${player1Name} venceu! 🎉`);
      } else {
        setAiScore((s) => s + 1);
        setGameOverMsg(`${player2Name} venceu! ${gameMode === 'ai' ? '🤖' : '🎉'}`);
      }
      return;
    }

    if (checkDraw(newBoard)) {
      setGameOver(true);
      setGameOverMsg('Empate! 🤝');
      return;
    }

    // Próximo turno
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    if (gameMode === 'ai' && nextPlayer === 'O') {
      setTimeout(() => doAITurn(newBoard), 800);
    } else {
      loadQuestion();
    }
  };

  // Turno da IA
  const doAITurn = (currentBoard) => {
    if (gameOver) return;
    setAiThinking(true);

    // IA "responde" - 50% de chance de acertar
    const aiCorrect = Math.random() < 0.5;

    if (aiCorrect) {
      const move = getAIMove(currentBoard);
      if (move === null) {
        setAiThinking(false);
        return;
      }

      const newBoard = [...currentBoard];
      newBoard[move] = 'O';
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        setGameOver(true);
        setAiScore((s) => s + 1);
        setGameOverMsg(`${player2Name} venceu! 🤖`);
        setAiThinking(false);
        return;
      }

      if (checkDraw(newBoard)) {
        setGameOver(true);
        setGameOverMsg('Empate! 🤝');
        setAiThinking(false);
        return;
      }

      setCurrentPlayer('X');
      setAiThinking(false);
      loadQuestion();
    } else {
      // IA errou - passa a vez
      setCurrentPlayer('X');
      setAiThinking(false);
      loadQuestion();
    }
  };

  // Reinicia o jogo (mantém placar)
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameOver(false);
    setGameOverMsg('');
    setAnswered(false);
    setFeedback(null);
    setAnsweredDisabled(false);
    setAiThinking(false);
    lastQuestionIdx.current = -1;
    loadQuestion();
  };

  // Texto de status
  const getStatusText = () => {
    if (gameOver) return gameOverMsg;
    if (aiThinking) return `${player2Name} está pensando...`;
    if (answered) return `${currentName}, escolha uma casa!`;
    return `Vez de ${currentName}! Responda a pergunta.`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header - Voltar + Placar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.scoreRow}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreLabel}>{player1Name} (X)</Text>
            <Text style={styles.scoreValue}>{playerScore}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreLabel}>{player2Name} (O)</Text>
            <Text style={styles.scoreValue}>{aiScore}</Text>
          </View>
        </View>
      </View>

      {/* Pergunta */}
      {!gameOver && currentQuestion && (
        <View style={styles.card}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {currentQuestion.answers.map((answer, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.answerBtn,
                answeredDisabled && idx === currentQuestion.correct && styles.answerCorrect,
                answeredDisabled && feedback?.type === 'wrong' && idx !== currentQuestion.correct && styles.answerDefault,
              ]}
              onPress={() => handleAnswer(idx)}
              disabled={answeredDisabled || aiThinking}
            >
              <Text style={styles.answerText}>{answer}</Text>
            </TouchableOpacity>
          ))}

          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                feedback.type === 'correct'
                  ? styles.feedbackCorrect
                  : styles.feedbackWrong,
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  feedback.type === 'correct'
                    ? styles.feedbackTextCorrect
                    : styles.feedbackTextWrong,
                ]}
              >
                {feedback.text}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Tabuleiro */}
      <View style={styles.card}>
        <Text style={styles.boardTitle}>Tabuleiro</Text>

        <View style={styles.board}>
          {board.map((cell, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.cell,
                cell === 'X' && styles.cellX,
                cell === 'O' && styles.cellO,
              ]}
              onPress={() => handleMove(idx)}
              disabled={
                cell !== '' || gameOver || !answered || aiThinking
              }
            >
              <Text
                style={[
                  styles.cellText,
                  cell === 'X' && styles.cellTextX,
                  cell === 'O' && styles.cellTextO,
                ]}
              >
                {cell}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status */}
        <Text style={styles.statusText}>{getStatusText()}</Text>

        {/* Botões de fim de jogo */}
        {gameOver && (
          <View style={styles.gameOverSection}>
            <Text style={styles.gameOverMsg}>{gameOverMsg}</Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={resetGame}>
              <Text style={styles.primaryBtnText}>Jogar Novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryBtnText}>Voltar ao Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const CELL_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },

  // Header
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md,
  },
  backIcon: {
    fontSize: 22,
    color: theme.colors.emerald600,
    fontWeight: '700',
    marginRight: 4,
  },
  backText: {
    color: theme.colors.emerald600,
    fontWeight: '700',
    fontSize: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreBadge: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  scoreLabel: {
    fontSize: 11,
    color: theme.colors.gray500,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.emerald600,
  },

  // Card
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 500,
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },

  // Pergunta
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.emerald700,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  answerBtn: {
    width: '100%',
    padding: 14,
    backgroundColor: theme.colors.emerald50,
    borderWidth: 2,
    borderColor: theme.colors.emerald200,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  answerDefault: {},
  answerCorrect: {
    backgroundColor: theme.colors.green100,
    borderColor: theme.colors.green700,
  },
  answerText: {
    fontWeight: '600',
    fontSize: 15,
    color: theme.colors.text,
  },
  feedbackBox: {
    marginTop: theme.spacing.sm,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: theme.colors.green100,
  },
  feedbackWrong: {
    backgroundColor: theme.colors.red100,
  },
  feedbackText: {
    fontWeight: '700',
    fontSize: 14,
  },
  feedbackTextCorrect: {
    color: theme.colors.green700,
  },
  feedbackTextWrong: {
    color: theme.colors.red700,
  },

  // Tabuleiro
  boardTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: theme.colors.emerald700,
    marginBottom: theme.spacing.md,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  cellX: {
    backgroundColor: '#dbeafe', // azul claro
  },
  cellO: {
    backgroundColor: '#fce7f3', // rosa claro
  },
  cellText: {
    fontSize: 32,
    fontWeight: '800',
  },
  cellTextX: {
    color: '#2563eb', // azul
  },
  cellTextO: {
    color: '#db2777', // rosa
  },

  // Status
  statusText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.emerald700,
  },

  // Fim de jogo
  gameOverSection: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  gameOverMsg: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.emerald700,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: theme.borderRadius.lg,
  },
  secondaryBtnText: {
    color: theme.colors.emerald600,
    fontWeight: '700',
    fontSize: 16,
  },
});

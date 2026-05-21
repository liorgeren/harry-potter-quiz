import { useReducer, useCallback } from 'react';
import { ROUNDS } from '../data/questions';

export const SCREENS = {
  TITLE: 'TITLE',
  AVATAR_SELECT: 'AVATAR_SELECT',
  ROUND_INTRO: 'ROUND_INTRO',
  QUESTION: 'QUESTION',
  ROUND_RESULT: 'ROUND_RESULT',
  GAME_OVER: 'GAME_OVER',
};

const STARTING_DIAMONDS = 50;
const WINNER_DIAMONDS = 100;
const LOSER_DIAMONDS = 20;
const HINT_COST = 10;
export const SAVE_COST = 50;
const SAVE_KEY = 'hp_trivia_save';

// ── localStorage helpers ─────────────────────────────────
export function getSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSave(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      playerAvatar:   state.playerAvatar,
      currentRound:   state.currentRound,
      playerDiamonds: state.playerDiamonds,
      aiDiamonds:     state.aiDiamonds,
      roundsWon:      state.roundsWon,
      roundsLost:     state.roundsLost,
      roundSummaries: state.roundSummaries,
      savedAt:        new Date().toISOString(),
    }));
  } catch { /* storage full / unavailable */ }
}

export function deleteSavedGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

// ── State ────────────────────────────────────────────────
function initialState() {
  return {
    screen: SCREENS.TITLE,
    playerAvatar: null,
    currentRound: 0,
    currentQuestion: 0,
    playerDiamonds: STARTING_DIAMONDS,
    aiDiamonds: STARTING_DIAMONDS,
    roundsWon: 0,
    roundsLost: 0,
    questionResults: [],
    roundSummaries: [],
    lastSavedRound: null,   // round index at last save (for feedback)
  };
}

function countScores(results) {
  return results.reduce(
    (acc, r) => {
      if (r.playerCorrect) acc.player++;
      if (r.aiCorrect)     acc.ai++;
      return acc;
    },
    { player: 0, ai: 0 }
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState(), screen: SCREENS.AVATAR_SELECT };

    case 'RESUME_GAME': {
      const s = action.save;
      return {
        ...initialState(),
        screen:         SCREENS.ROUND_INTRO,
        playerAvatar:   s.playerAvatar,
        currentRound:   s.currentRound,
        playerDiamonds: s.playerDiamonds,
        aiDiamonds:     s.aiDiamonds,
        roundsWon:      s.roundsWon,
        roundsLost:     s.roundsLost,
        roundSummaries: s.roundSummaries,
      };
    }

    case 'SELECT_AVATAR':
      return { ...state, playerAvatar: action.avatar, screen: SCREENS.ROUND_INTRO };

    case 'BEGIN_ROUND':
      return { ...state, screen: SCREENS.QUESTION, currentQuestion: 0, questionResults: [] };

    case 'RECORD_QUESTION_RESULT': {
      const newResults = [...state.questionResults, action.result];
      const bonusDiamonds = action.result.playerCorrect ? 2 : 0;
      const isLastQuestion = state.currentQuestion >= ROUNDS[state.currentRound].questions.length - 1;
      if (isLastQuestion) {
        return { ...state, questionResults: newResults, playerDiamonds: state.playerDiamonds + bonusDiamonds, screen: SCREENS.ROUND_RESULT };
      }
      return {
        ...state,
        questionResults: newResults,
        playerDiamonds: state.playerDiamonds + bonusDiamonds,
        currentQuestion: state.currentQuestion + 1,
        screen: SCREENS.QUESTION,
      };
    }

    case 'USE_HINT':
      if (state.playerDiamonds < HINT_COST) return state;
      return { ...state, playerDiamonds: state.playerDiamonds - HINT_COST };

    case 'FINISH_ROUND': {
      const { player, ai } = countScores(state.questionResults);
      const playerWon   = player > ai;
      const playerEarned = playerWon ? WINNER_DIAMONDS : LOSER_DIAMONDS;
      const aiEarned     = playerWon ? LOSER_DIAMONDS  : WINNER_DIAMONDS;
      const isLastRound  = state.currentRound >= ROUNDS.length - 1;

      const summary = {
        roundIndex: state.currentRound,
        playerScore: player,
        aiScore: ai,
        playerWon,
        diamondsEarned: playerEarned,
        questionResults: state.questionResults,
      };

      return {
        ...state,
        playerDiamonds: state.playerDiamonds + playerEarned,
        aiDiamonds:     state.aiDiamonds     + aiEarned,
        roundsWon:      state.roundsWon  + (playerWon ? 1 : 0),
        roundsLost:     state.roundsLost + (playerWon ? 0 : 1),
        roundSummaries: [...state.roundSummaries, summary],
        currentRound:   isLastRound ? state.currentRound : state.currentRound + 1,
        screen:         isLastRound ? SCREENS.GAME_OVER  : SCREENS.ROUND_INTRO,
      };
    }

    case 'SAVE_PROGRESS': {
      if (state.playerDiamonds < SAVE_COST) return state;
      const next = { ...state, playerDiamonds: state.playerDiamonds - SAVE_COST, lastSavedRound: state.currentRound };
      persistSave(next);
      return next;
    }

    case 'RESTART':
      return initialState();

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const startGame           = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const resumeGame          = useCallback((save) => dispatch({ type: 'RESUME_GAME', save }), []);
  const selectAvatar        = useCallback((avatar) => dispatch({ type: 'SELECT_AVATAR', avatar }), []);
  const beginRound          = useCallback(() => dispatch({ type: 'BEGIN_ROUND' }), []);
  const recordQuestionResult = useCallback((result) => dispatch({ type: 'RECORD_QUESTION_RESULT', result }), []);
  const useHint             = useCallback(() => dispatch({ type: 'USE_HINT' }), []);
  const finishRound         = useCallback(() => dispatch({ type: 'FINISH_ROUND' }), []);
  const saveProgress        = useCallback(() => dispatch({ type: 'SAVE_PROGRESS' }), []);
  const restart             = useCallback(() => dispatch({ type: 'RESTART' }), []);

  const currentRoundData    = ROUNDS[state.currentRound];
  const currentQuestionData = currentRoundData ? currentRoundData.questions[state.currentQuestion] : null;
  const canUseHint          = state.playerDiamonds >= HINT_COST;
  const canSave             = state.playerDiamonds >= SAVE_COST;

  return {
    ...state,
    currentRoundData,
    currentQuestionData,
    canUseHint,
    canSave,
    HINT_COST,
    SAVE_COST,
    startGame,
    resumeGame,
    selectAvatar,
    beginRound,
    recordQuestionResult,
    useHint,
    finishRound,
    saveProgress,
    restart,
  };
}

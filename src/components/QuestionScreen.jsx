import { useState, useEffect, useRef, useCallback } from 'react';
import { isCorrectAnswer } from '../utils/answerChecker';
import { AI_AVATARS } from '../data/avatars';
import { QUESTION_IMAGES } from '../data/questionImages';
import AvatarDisplay from './AvatarDisplay';
import DiamondCounter from './DiamondCounter';

const QUESTION_TIME = 30;
// Probability AI answers correctly (0-1)
const AI_ACCURACY = 0.7;

export default function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  currentRound,
  playerName,
  playerAvatar,
  playerDiamonds,
  canUseHint,
  hintCost,
  onResult,
  onUseHint,
}) {
  const aiAvatar = AI_AVATARS[currentRound];
  const bgImage = QUESTION_IMAGES[question.id] || null;
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);

  // Pre-load background image
  useEffect(() => {
    setBgLoaded(false);
    setBgError(false);
    if (!bgImage) return;
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgError(true);
    img.src = bgImage;
  }, [bgImage]);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [playerInput, setPlayerInput] = useState('');
  const [aiTyping, setAiTyping] = useState('');
  const [phase, setPhase] = useState('active'); // active | revealed
  const [result, setResult] = useState(null);   // { playerCorrect, aiCorrect, hintUsed }
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const timerRef = useRef(null);
  const aiTimerRef = useRef(null);
  const aiTypingRef = useRef(null);
  const resolvedRef = useRef(false);
  const inputRef = useRef(null);

  // Determine AI behaviour for this question upfront
  const aiCorrectRef = useRef(Math.random() < AI_ACCURACY);
  // AI delay: 12-25 seconds
  const aiDelayRef = useRef(12000 + Math.floor(Math.random() * 13000));

  const resolveQuestion = useCallback(
    (playerCorrect, aiCorrect, usedHint) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      setPhase('revealed');
      const res = { playerCorrect, aiCorrect, hintUsed: usedHint };
      setResult(res);
      clearInterval(timerRef.current);
      clearTimeout(aiTimerRef.current);
      clearInterval(aiTypingRef.current);
      // Short delay so player can see the result before advancing
      setTimeout(() => onResult(res), 1800);
    },
    [onResult]
  );

  // Countdown timer
  useEffect(() => {
    resolvedRef.current = false;
    setPhase('active');
    setResult(null);
    setPlayerInput('');
    setAiTyping('');
    setHintUsed(false);
    setFeedback(null);
    aiCorrectRef.current = Math.random() < AI_ACCURACY;
    aiDelayRef.current = 12000 + Math.floor(Math.random() * 13000);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Time's up — neither correct
          resolveQuestion(false, false, false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(aiTimerRef.current);
      clearInterval(aiTypingRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Reset timer display when question changes
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
  }, [question.id]);

  // AI typing simulation
  useEffect(() => {
    const answerToType = aiCorrectRef.current
      ? question.answer
      : question.wrongAnswers?.[Math.floor(Math.random() * (question.wrongAnswers?.length || 1))] || 'I dunno';

    aiTimerRef.current = setTimeout(() => {
      if (resolvedRef.current) return;
      let charIndex = 0;
      aiTypingRef.current = setInterval(() => {
        if (resolvedRef.current) {
          clearInterval(aiTypingRef.current);
          return;
        }
        charIndex++;
        setAiTyping(answerToType.slice(0, charIndex));
        if (charIndex >= answerToType.length) {
          clearInterval(aiTypingRef.current);
          // AI submits
          if (!resolvedRef.current) {
            resolveQuestion(false, aiCorrectRef.current, false);
          }
        }
      }, 80);
    }, aiDelayRef.current);

    return () => {
      clearTimeout(aiTimerRef.current);
      clearInterval(aiTypingRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function handlePlayerSubmit(e) {
    e && e.preventDefault();
    if (resolvedRef.current || phase !== 'active') return;
    const correct = isCorrectAnswer(playerInput, question);
    if (correct) {
      setFeedback('correct');
      resolveQuestion(true, false, false);
    } else {
      setFeedback('wrong');
      // Let AI keep trying — player can retype
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function handleHint() {
    if (!canUseHint || hintUsed || resolvedRef.current) return;
    onUseHint();
    setHintUsed(true);
    setPlayerInput(question.answer);
    setFeedback('correct');
    resolveQuestion(true, false, true);
  }

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerDanger = timeLeft <= 5;

  const playerWon = result?.playerCorrect;
  const aiWon = result?.aiCorrect;
  const nobody = result && !result.playerCorrect && !result.aiCorrect;

  return (
    <div className="screen question-screen">
      {/* Background image */}
      {bgLoaded && !bgError && (
        <div
          className="question-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Header bar */}
      <div className="question-header">
        <div className="question-progress">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${i < questionIndex ? 'done' : i === questionIndex ? 'current' : ''}`}
            />
          ))}
        </div>
        <div className="question-num">Q{questionIndex + 1}/{totalQuestions}</div>
        <DiamondCounter count={playerDiamonds} />
      </div>

      {/* Timer bar */}
      <div className="timer-bar-wrap">
        <div
          className={`timer-bar-fill ${timerDanger ? 'timer-danger' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
        <span className={`timer-text ${timerDanger ? 'timer-text-danger' : ''}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Question card */}
      <div className="question-card">
        <p className="question-text">{question.question}</p>
      </div>

      {/* Player & AI answer areas */}
      <div className="answer-arena">
        {/* Player side */}
        <div className={`answer-box player-answer-box ${feedback === 'correct' ? 'answer-correct' : feedback === 'wrong' ? 'answer-wrong' : ''}`}>
          <div className="answer-box-header">
            <AvatarDisplay avatar={playerAvatar} size="sm" />
            <span className="answer-box-label">{playerName || 'You'}</span>
          </div>
          <form onSubmit={handlePlayerSubmit} className="answer-form">
            <input
              ref={inputRef}
              type="text"
              className="answer-input"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={phase !== 'active'}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={phase !== 'active' || !playerInput.trim()}
            >
              Submit
            </button>
          </form>
        </div>

        {/* AI side */}
        <div className={`answer-box ai-answer-box ${aiWon ? 'answer-correct' : ''}`}>
          <div className="answer-box-header">
            <AvatarDisplay avatar={aiAvatar} size="sm" isAI />
            <span className="answer-box-label">{aiAvatar.name}</span>
          </div>
          <div className="ai-typing-display">
            {aiTyping ? (
              <span className="ai-typing-text">
                {aiTyping}
                {phase === 'active' && <span className="cursor-blink">|</span>}
              </span>
            ) : (
              <span className="ai-thinking">
                {phase === 'active' ? (
                  <><span className="dot-pulse">•</span><span className="dot-pulse">•</span><span className="dot-pulse">•</span></>
                ) : '—'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hint button */}
      {phase === 'active' && (
        <button
          className={`hint-button ${!canUseHint || hintUsed ? 'hint-button--disabled' : ''}`}
          onClick={handleHint}
          disabled={!canUseHint || hintUsed}
        >
          💡 Use Hint <span className="hint-cost">({hintCost} 💎)</span>
          {!canUseHint && <span className="hint-insufficient"> — not enough diamonds</span>}
        </button>
      )}

      {/* Result overlay */}
      {result && (
        <div className={`result-overlay ${playerWon ? 'result-win' : aiWon ? 'result-lose' : 'result-draw'}`}>
          {playerWon && (
            <>
              <span className="result-icon">🎉</span>
              <span className="result-text">{hintUsed ? 'Hint used — Point earned!' : 'Correct! You answered first!'}</span>
            </>
          )}
          {aiWon && (
            <>
              <span className="result-icon">🤖</span>
              <span className="result-text">{aiAvatar.name} got there first!</span>
            </>
          )}
          {nobody && (
            <>
              <span className="result-icon">⏱️</span>
              <span className="result-text">No one got it! The answer was: <strong>{question.answer}</strong></span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

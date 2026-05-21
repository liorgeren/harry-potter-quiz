import { useState, useEffect } from 'react';
import { getSavedGame, deleteSavedGame, SAVE_COST } from '../hooks/useGameState';
import { ROUNDS } from '../data/questions';

export default function TitleScreen({ onStart, onResume }) {
  const [showHow, setShowHow] = useState(false);
  const [savedGame, setSavedGame] = useState(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setSavedGame(getSavedGame());
  }, []);

  function handleStart() {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    onStart(name.trim());
  }

  function handleResume() {
    if (savedGame) onResume(savedGame);
  }

  function handleDeleteSave() {
    deleteSavedGame();
    setSavedGame(null);
  }

  return (
    <div className="screen title-screen">
      <div className="title-stars" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${8 + Math.random() * 10}px`,
            }}
          >✦</span>
        ))}
      </div>

      <div className="title-content">
        <div className="title-crest" aria-hidden="true">⚡</div>
        <h1 className="title-heading">
          <span className="title-harry">Harry Potter</span>
          <span className="title-trivia">Quiz</span>
        </h1>
        <p className="title-tagline">You vs AI · 15 Rounds · 5 Questions Each</p>
        <div className="title-features">
          <span className="feature-pill">💎 Earn Diamonds</span>
          <span className="feature-pill">💡 Buy Hints</span>
          <span className="feature-pill">⚡ Race the AI</span>
        </div>
        {savedGame && (
          <div className="save-resume-card">
            <div className="save-resume-info">
              <span className="save-resume-icon">💾</span>
              <div>
                <span className="save-resume-label">Saved Game Found</span>
                <span className="save-resume-detail">
                  Round {savedGame.currentRound + 1} of {ROUNDS.length} · {savedGame.playerDiamonds} 💎
                </span>
              </div>
            </div>
            <div className="save-resume-actions">
              <button className="btn btn-primary" onClick={handleResume}>
                Resume →
              </button>
              <button className="btn-delete-save" onClick={handleDeleteSave} title="Delete saved game">
                🗑
              </button>
            </div>
          </div>
        )}

        <div className="name-entry">
          <input
            className={`name-input ${nameError ? 'name-input--error' : ''}`}
            type="text"
            placeholder="Enter your name..."
            value={name}
            maxLength={20}
            onChange={(e) => { setName(e.target.value); setNameError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            autoComplete="off"
          />
          {nameError && <span className="name-error">Please enter your name first!</span>}
        </div>

        <button className="btn btn-primary btn-large" onClick={handleStart}>
          {savedGame ? 'New Game' : 'Begin Your Quest'}
        </button>
        <button className="btn-how-to-play" onClick={() => setShowHow(true)}>
          How to Play
        </button>
        <p className="title-hint-text">Answer first to win · Type quickly · Use diamonds wisely</p>
        <p className="title-credit">by Chloe Gerenstein</p>
      </div>

      {showHow && (
        <div className="htp-overlay" onClick={() => setShowHow(false)}>
          <div className="htp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="htp-close" onClick={() => setShowHow(false)} aria-label="Close">✕</button>
            <h2 className="htp-title">⚡ How to Play</h2>

            <div className="htp-section">
              <h3 className="htp-section-title">🎯 Goal</h3>
              <p>Win as many of the 15 rounds as possible. Each round has 5 Harry Potter trivia questions.</p>
            </div>

            <div className="htp-section">
              <h3 className="htp-section-title">⚡ Racing the AI</h3>
              <p>Each question is a race — you and the AI both try to answer. Type your answer and hit <strong>Submit</strong> before the AI finishes typing. Whoever gets it right first wins the point.</p>
            </div>

            <div className="htp-section">
              <h3 className="htp-section-title">⏱️ Timer</h3>
              <p>You have <strong>30 seconds</strong> per question. If neither player answers correctly in time, no point is awarded.</p>
            </div>

            <div className="htp-section">
              <h3 className="htp-section-title">💎 Diamonds</h3>
              <ul className="htp-list">
                <li>Win a round → <strong>+100 💎</strong></li>
                <li>Lose a round → <strong>+20 💎</strong></li>
                <li>You start with <strong>50 💎</strong></li>
              </ul>
            </div>

            <div className="htp-section">
              <h3 className="htp-section-title">💡 Hints</h3>
              <p>Spend <strong>10 💎</strong> on a hint to instantly reveal the answer and score the point. The AI won't answer that question.</p>
            </div>

            <div className="htp-section">
              <h3 className="htp-section-title">💾 Save Progress</h3>
              <p>After each round, spend <strong>{SAVE_COST} 💎</strong> to save your progress. Next time you open the game, tap <strong>Resume</strong> to continue from the same round.</p>
            </div>

            <div className="htp-section">
              <h3 className="htp-section-title">🤖 AI Opponents</h3>
              <p>A new Harry Potter character faces you each round — starting with Draco Malfoy and building up to Harry Potter himself in Round 15.</p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={() => setShowHow(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

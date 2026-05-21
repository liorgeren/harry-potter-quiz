import { ROUNDS } from '../data/questions';
import { AI_AVATARS } from '../data/avatars';
import AvatarDisplay from './AvatarDisplay';
import DiamondCounter from './DiamondCounter';

export default function RoundResult({
  currentRound,
  questionResults,
  playerAvatar,
  playerDiamonds,
  aiDiamonds,
  onNext,
  onSave,
  canSave,
  saveCost,
  lastSavedRound,
  isLastRound,
}) {
  const roundData = ROUNDS[currentRound];
  const aiAvatar = AI_AVATARS[currentRound];

  const playerScore = questionResults.filter((r) => r.playerCorrect).length;
  const aiScore = questionResults.filter((r) => r.aiCorrect).length;
  const playerWon = playerScore > aiScore;
  const tied = playerScore === aiScore;
  const diamondsEarned = playerWon ? 100 : 20;

  return (
    <div className="screen round-result-screen">
      <div className="round-badge">Round {currentRound + 1} — {roundData.theme}</div>

      {/* Winner banner */}
      <div className={`result-banner ${playerWon ? 'result-banner--win' : tied ? 'result-banner--tie' : 'result-banner--loss'}`}>
        {playerWon ? (
          <>
            <span className="result-banner-icon">🏆</span>
            <span className="result-banner-text">You win this round!</span>
          </>
        ) : tied ? (
          <>
            <span className="result-banner-icon">🤝</span>
            <span className="result-banner-text">It's a tie!</span>
          </>
        ) : (
          <>
            <span className="result-banner-icon">💀</span>
            <span className="result-banner-text">{aiAvatar.name} wins this round!</span>
          </>
        )}
      </div>

      {/* Score */}
      <div className="round-scores">
        <div className="score-box">
          <AvatarDisplay avatar={playerAvatar} size="md" />
          <span className="score-name">You</span>
          <span className="score-value">{playerScore}</span>
        </div>
        <div className="score-divider">—</div>
        <div className="score-box">
          <AvatarDisplay avatar={aiAvatar} size="md" isAI />
          <span className="score-name">{aiAvatar.name}</span>
          <span className="score-value">{aiScore}</span>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="question-breakdown">
        <h3 className="breakdown-title">Question Breakdown</h3>
        {questionResults.map((r, i) => (
          <div key={i} className="breakdown-row">
            <span className="breakdown-num">Q{i + 1}</span>
            <span className="breakdown-q-text">{roundData.questions[i]?.question}</span>
            <div className="breakdown-icons">
              <span className={`breakdown-icon ${r.playerCorrect ? 'icon-correct' : 'icon-wrong'}`} title="You">
                {r.playerCorrect ? '✅' : '❌'}
              </span>
              <span className={`breakdown-icon ${r.aiCorrect ? 'icon-correct' : 'icon-wrong'}`} title="AI">
                {r.aiCorrect ? '🤖✅' : '🤖❌'}
              </span>
              {r.hintUsed && <span className="breakdown-hint">💡</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Diamonds earned */}
      <div className="diamonds-earned">
        <span className="diamonds-earned-label">You earned</span>
        <span className="diamonds-earned-amount">+{diamondsEarned} 💎</span>
      </div>

      {/* Current totals */}
      <div className="current-totals">
        <DiamondCounter count={playerDiamonds} label="Your total" />
        <DiamondCounter count={aiDiamonds} label="AI total" />
      </div>

      {/* Save progress */}
      {!isLastRound && (
        <div className="save-progress-row">
          <button
            className={`btn-save-progress ${!canSave ? 'btn-save-progress--disabled' : ''}`}
            onClick={canSave ? onSave : undefined}
            disabled={!canSave}
            title={canSave ? `Save your progress for ${saveCost} 💎` : `Not enough diamonds (need ${saveCost} 💎)`}
          >
            💾 Save Progress ({saveCost} 💎)
          </button>
          {lastSavedRound === currentRound && (
            <span className="save-progress-confirm">✅ Saved!</span>
          )}
          {!canSave && (
            <span className="save-progress-note">Need {saveCost} 💎 to save</span>
          )}
        </div>
      )}

      <button className="btn btn-primary btn-large" onClick={onNext}>
        {isLastRound ? 'See Final Results' : `Next Round →`}
      </button>
    </div>
  );
}

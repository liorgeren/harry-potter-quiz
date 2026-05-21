import AvatarDisplay from './AvatarDisplay';
import { AI_AVATARS } from '../data/avatars';

export default function GameOver({
  playerName,
  playerAvatar,
  roundSummaries,
  playerDiamonds,
  aiDiamonds,
  onRestart,
}) {
  const playerRoundsWon = roundSummaries.filter((r) => r.playerWon).length;
  const aiRoundsWon = roundSummaries.length - playerRoundsWon;
  const playerWinsGame = playerRoundsWon > aiRoundsWon;
  const tiedGame = playerRoundsWon === aiRoundsWon;

  return (
    <div className="screen game-over-screen">
      <div className="gameover-stars" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
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

      <div className="gameover-title-icon" aria-hidden="true">
        {playerWinsGame ? '🏆' : tiedGame ? '🤝' : '💀'}
      </div>

      <h2 className="gameover-title">
        {playerWinsGame ? 'Congratulations, Champion!' : tiedGame ? 'A Legendary Tie!' : 'The AI Wins This Time!'}
      </h2>

      <div className="gameover-scores">
        <div className="gameover-score-box">
          <AvatarDisplay avatar={playerAvatar} size="lg" />
          <span className="gameover-score-name">{playerName || 'You'}</span>
          <span className="gameover-score-rounds">{playerRoundsWon} rounds won</span>
          <span className="gameover-score-diamonds">💎 {playerDiamonds}</span>
        </div>
        <div className="gameover-vs">VS</div>
        <div className="gameover-score-box">
          <AvatarDisplay avatar={AI_AVATARS[14]} size="lg" isAI />
          <span className="gameover-score-name">AI</span>
          <span className="gameover-score-rounds">{aiRoundsWon} rounds won</span>
          <span className="gameover-score-diamonds">💎 {aiDiamonds}</span>
        </div>
      </div>

      {/* Per-round summary */}
      <div className="gameover-round-summary">
        <h3 className="summary-heading">Round by Round</h3>
        <div className="summary-grid">
          {roundSummaries.map((summary, i) => (
            <div
              key={i}
              className={`summary-cell ${summary.playerWon ? 'summary-win' : 'summary-loss'}`}
              title={`Round ${i + 1}: You ${summary.playerScore} — AI ${summary.aiScore}`}
            >
              <span className="summary-round-num">R{i + 1}</span>
              <span className="summary-round-icon">{summary.playerWon ? '🏆' : '💀'}</span>
              <span className="summary-round-score">{summary.playerScore}–{summary.aiScore}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-large" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}

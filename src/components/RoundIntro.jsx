import { ROUNDS } from '../data/questions';
import { AI_AVATARS } from '../data/avatars';
import AvatarDisplay from './AvatarDisplay';
import DiamondCounter from './DiamondCounter';

export default function RoundIntro({
  currentRound,
  playerName,
  playerAvatar,
  playerDiamonds,
  aiDiamonds,
  onBegin,
}) {
  const roundData = ROUNDS[currentRound];
  const aiAvatar = AI_AVATARS[currentRound];
  const totalRounds = ROUNDS.length;

  return (
    <div className="screen round-intro-screen">
      <div className="round-badge">
        Round {currentRound + 1} <span className="round-of">of {totalRounds}</span>
      </div>

      <h2 className="round-theme">{roundData.theme}</h2>
      <p className="round-questions-info">5 questions · Answer first to win!</p>

      <div className="vs-container">
        <div className="vs-player">
          <AvatarDisplay avatar={playerAvatar} size="lg" />
          <span className="vs-player-name">{playerName || 'You'}</span>
          <DiamondCounter count={playerDiamonds} />
        </div>

        <div className="vs-badge">VS</div>

        <div className="vs-player">
          <AvatarDisplay avatar={aiAvatar} size="lg" isAI />
          <span className="vs-player-name">{aiAvatar.name}</span>
          <DiamondCounter count={aiDiamonds} label="AI" />
        </div>
      </div>

      <div className="round-tip">
        <span className="tip-icon">💎</span>
        <span>Win this round to earn <strong>100 diamonds</strong>. Lose and you still get <strong>20</strong>.</span>
      </div>

      <button className="btn btn-primary btn-large" onClick={onBegin}>
        Begin Round {currentRound + 1}
      </button>
    </div>
  );
}

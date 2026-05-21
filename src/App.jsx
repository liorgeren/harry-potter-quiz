import './App.css';
import { useGameState, SCREENS } from './hooks/useGameState';
import TitleScreen from './components/TitleScreen';
import AvatarSelect from './components/AvatarSelect';
import RoundIntro from './components/RoundIntro';
import QuestionScreen from './components/QuestionScreen';
import RoundResult from './components/RoundResult';
import GameOver from './components/GameOver';
import { ROUNDS } from './data/questions';

export default function App() {
  const game = useGameState();

  function renderScreen() {
    switch (game.screen) {
      case SCREENS.TITLE:
        return <TitleScreen onStart={game.startGame} onResume={game.resumeGame} />;

      case SCREENS.AVATAR_SELECT:
        return <AvatarSelect onSelect={game.selectAvatar} />;

      case SCREENS.ROUND_INTRO:
        return (
          <RoundIntro
            currentRound={game.currentRound}
            playerName={game.playerName}
            playerAvatar={game.playerAvatar}
            playerDiamonds={game.playerDiamonds}
            aiDiamonds={game.aiDiamonds}
            onBegin={game.beginRound}
          />
        );

      case SCREENS.QUESTION:
        return (
          <QuestionScreen
            key={`${game.currentRound}-${game.currentQuestion}`}
            question={game.currentQuestionData}
            questionIndex={game.currentQuestion}
            totalQuestions={ROUNDS[game.currentRound].questions.length}
            currentRound={game.currentRound}
            playerName={game.playerName}
            playerAvatar={game.playerAvatar}
            playerDiamonds={game.playerDiamonds}
            canUseHint={game.canUseHint}
            hintCost={game.HINT_COST}
            onResult={game.recordQuestionResult}
            onUseHint={game.useHint}
          />
        );

      case SCREENS.ROUND_RESULT:
        return (
          <RoundResult
            currentRound={game.currentRound}
            questionResults={game.questionResults}
            playerName={game.playerName}
            playerAvatar={game.playerAvatar}
            playerDiamonds={game.playerDiamonds}
            aiDiamonds={game.aiDiamonds}
            onNext={game.finishRound}
            onSave={game.saveProgress}
            canSave={game.canSave}
            saveCost={game.SAVE_COST}
            lastSavedRound={game.lastSavedRound}
            isLastRound={game.currentRound >= ROUNDS.length - 1}
          />
        );

      case SCREENS.GAME_OVER:
        return (
          <GameOver
            playerName={game.playerName}
            playerAvatar={game.playerAvatar}
            roundSummaries={game.roundSummaries}
            playerDiamonds={game.playerDiamonds}
            aiDiamonds={game.aiDiamonds}
            onRestart={game.restart}
          />
        );

      default:
        return null;
    }
  }

  const showBadge = game.screen !== SCREENS.TITLE;

  return (
    <div className="app">
      {showBadge && (
        <div className="diamond-badge" aria-label={`You have ${game.playerDiamonds} diamonds`}>
          💎 <span className="diamond-badge-count">{game.playerDiamonds}</span>
        </div>
      )}
      {renderScreen()}
    </div>
  );
}

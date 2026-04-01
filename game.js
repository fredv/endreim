/**
 * Hauptspiel-Logik für EndReim – Das Rap-Reim-Spiel
 */

const Game = (() => {
  let state = {
    currentChallenge: null,
    round: 0,
    totalRounds: 10,
    score: 0,
    history: [],
    difficulty: null, // null = gemischt
    streak: 0,
    bestStreak: 0,
    hintsUsed: 0,
  };

  function init(options = {}) {
    state.totalRounds = options.rounds || 10;
    state.difficulty = options.difficulty || null;
    state.round = 0;
    state.score = 0;
    state.history = [];
    state.streak = 0;
    state.bestStreak = 0;
    state.hintsUsed = 0;
    nextRound();
  }

  function nextRound() {
    state.round++;
    if (state.round > state.totalRounds) {
      return null; // Spiel vorbei
    }

    // Schwierigkeit progressiv steigern wenn gemischt
    let diff = state.difficulty;
    if (diff === null) {
      if (state.round <= 3) diff = 1;
      else if (state.round <= 7) diff = 2;
      else diff = 3;
    }

    const [challenge] = getRandomChallenges(diff, 1);
    state.currentChallenge = challenge;
    return challenge;
  }

  function submitAnswer(playerLine) {
    if (!state.currentChallenge) return null;

    const challenge = state.currentChallenge;
    const result = RhymeEngine.scoreAnswer(challenge.line, playerLine);

    // Streak-Bonus
    if (result.totalScore >= 30) {
      state.streak++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    } else {
      state.streak = 0;
    }

    // Streak-Multiplikator
    let streakMultiplier = 1;
    if (state.streak >= 5) streakMultiplier = 1.5;
    else if (state.streak >= 3) streakMultiplier = 1.25;

    const roundScore = Math.round(result.totalScore * streakMultiplier);
    state.score += roundScore;

    const roundResult = {
      round: state.round,
      challenge,
      playerLine,
      result,
      roundScore,
      streakMultiplier,
      streak: state.streak,
    };

    state.history.push(roundResult);

    return roundResult;
  }

  function useHint() {
    state.hintsUsed++;
  }

  function getState() {
    return { ...state };
  }

  function isGameOver() {
    return state.round > state.totalRounds;
  }

  function getFinalStats() {
    const avgScore = state.history.length > 0
      ? Math.round(state.history.reduce((sum, h) => sum + h.result.totalScore, 0) / state.history.length)
      : 0;

    const bestRound = state.history.reduce(
      (best, h) => h.roundScore > (best?.roundScore || 0) ? h : best,
      null
    );

    const rhymeTypes = {};
    state.history.forEach(h => {
      const type = h.result.rhyme.details.type;
      rhymeTypes[type] = (rhymeTypes[type] || 0) + 1;
    });

    let rank = '';
    if (state.score >= 800) rank = 'Reimgott';
    else if (state.score >= 600) rank = 'Punchline-König';
    else if (state.score >= 400) rank = 'Silbenakrobat';
    else if (state.score >= 250) rank = 'Wortschmied';
    else if (state.score >= 100) rank = 'Reimlehrling';
    else rank = 'Anfänger';

    return {
      totalScore: state.score,
      avgScore,
      bestRound,
      bestStreak: state.bestStreak,
      hintsUsed: state.hintsUsed,
      rhymeTypes,
      rank,
      rounds: state.totalRounds,
    };
  }

  function getScoreLabel(score) {
    if (score >= 80) return { label: 'FIRE', class: 'score-fire' };
    if (score >= 60) return { label: 'STARK', class: 'score-strong' };
    if (score >= 40) return { label: 'SOLIDE', class: 'score-solid' };
    if (score >= 20) return { label: 'OKAY', class: 'score-okay' };
    return { label: 'SCHWACH', class: 'score-weak' };
  }

  return {
    init,
    nextRound,
    submitAnswer,
    useHint,
    getState,
    isGameOver,
    getFinalStats,
    getScoreLabel,
  };
})();

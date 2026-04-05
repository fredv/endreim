/**
 * UI-Controller für EndReim
 */

(function () {
  // === DOM Elements ===
  const screens = {
    start: document.getElementById('screen-start'),
    game: document.getElementById('screen-game'),
    end: document.getElementById('screen-end'),
  };

  const els = {
    // Start
    difficultySelect: document.getElementById('difficulty-select'),
    roundsSelect: document.getElementById('rounds-select'),
    btnStart: document.getElementById('btn-start'),

    // Game
    roundDisplay: document.getElementById('round-display'),
    scoreDisplay: document.getElementById('score-display'),
    streakDisplay: document.getElementById('streak-display'),
    challengeBadge: document.getElementById('challenge-badge'),
    challengeDifficulty: document.getElementById('challenge-difficulty'),
    challengeLine: document.getElementById('challenge-line'),
    playerInput: document.getElementById('player-input'),
    charCount: document.getElementById('char-count'),
    btnHint: document.getElementById('btn-hint'),
    btnSubmit: document.getElementById('btn-submit'),
    btnSkip: document.getElementById('btn-skip'),
    hintArea: document.getElementById('hint-area'),

    // Result - Rhyme Highlights
    rhymeComparison: document.getElementById('rhyme-comparison'),
    rhymeLine1: document.getElementById('rhyme-line-1'),
    rhymeLine2: document.getElementById('rhyme-line-2'),

    // Result
    resultOverlay: document.getElementById('result-overlay'),
    resultScoreCircle: document.getElementById('result-score-circle'),
    resultScoreNumber: document.getElementById('result-score-number'),
    resultLabel: document.getElementById('result-label'),
    resultFeedback: document.getElementById('result-feedback'),
    resultSyllables: document.getElementById('result-syllables'),
    resultType: document.getElementById('result-type'),
    resultInternal: document.getElementById('result-internal'),
    resultInternalRow: document.getElementById('result-internal-row'),
    resultWordplay: document.getElementById('result-wordplay'),
    resultWordplayRow: document.getElementById('result-wordplay-row'),
    resultNatural: document.getElementById('result-natural'),
    resultNaturalRow: document.getElementById('result-natural-row'),
    resultStreakMult: document.getElementById('result-streak-mult'),
    resultStreakRow: document.getElementById('result-streak-row'),
    resultRoundScore: document.getElementById('result-round-score'),
    resultExamples: document.getElementById('result-examples'),
    btnNext: document.getElementById('btn-next'),

    // End
    endRank: document.getElementById('end-rank'),
    endScore: document.getElementById('end-score'),
    endAvg: document.getElementById('end-avg'),
    endBestStreak: document.getElementById('end-best-streak'),
    endHints: document.getElementById('end-hints'),
    endBreakdown: document.getElementById('end-breakdown'),
    endHistory: document.getElementById('end-history'),
    btnRestart: document.getElementById('btn-restart'),
  };

  let selectedDifficulty = null;
  let selectedRounds = 10;

  // === Screen Management ===

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // === Button Group Logic ===

  function setupButtonGroup(container, callback) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      container.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      callback(btn.dataset.value);
    });
  }

  // === Start Screen ===

  setupButtonGroup(els.difficultySelect, (val) => {
    selectedDifficulty = val ? parseInt(val) : null;
  });

  setupButtonGroup(els.roundsSelect, (val) => {
    selectedRounds = parseInt(val);
  });

  els.btnStart.addEventListener('click', startGame);

  function startGame() {
    Game.init({
      difficulty: selectedDifficulty,
      rounds: selectedRounds,
    });

    showScreen('game');
    displayChallenge();
  }

  // === Game Screen ===

  function displayChallenge() {
    const state = Game.getState();
    const challenge = state.currentChallenge;

    if (!challenge) {
      showEndScreen();
      return;
    }

    // Update header
    els.roundDisplay.textContent = `${state.round}/${state.totalRounds}`;
    els.scoreDisplay.textContent = state.score;
    els.streakDisplay.textContent = state.streak;

    // Update challenge
    const badge = challenge.type === 'punchline' ? 'PUNCHLINE GESUCHT' : 'SETUP GESUCHT';
    els.challengeBadge.textContent = badge;

    const diffLabels = { 1: '⭐ Leicht', 2: '⭐⭐ Mittel', 3: '⭐⭐⭐ Schwer' };
    els.challengeDifficulty.textContent = diffLabels[challenge.difficulty] || '';

    els.challengeLine.textContent = challenge.line;

    // Reset input
    els.playerInput.value = '';
    els.charCount.textContent = '0/200';
    els.hintArea.classList.add('hidden');
    els.resultOverlay.classList.add('hidden');
    els.playerInput.focus();

    // Animate
    els.challengeLine.classList.remove('animate-in');
    void els.challengeLine.offsetWidth; // force reflow
    els.challengeLine.classList.add('animate-in');
  }

  // Character count
  els.playerInput.addEventListener('input', () => {
    const len = els.playerInput.value.length;
    els.charCount.textContent = `${len}/200`;
  });

  // Submit on Enter (Shift+Enter for newline)
  els.playerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  });

  els.btnSubmit.addEventListener('click', submitAnswer);

  els.btnSkip.addEventListener('click', () => {
    // Show result with 0 score
    showResult({
      round: Game.getState().round,
      challenge: Game.getState().currentChallenge,
      playerLine: '',
      result: { totalScore: 0, rhyme: { score: 0, details: { type: 'none', syllableMatches: 0 } }, wordplayBonus: 0, naturalnessMalus: 0, feedback: 'Übersprungen!' },
      roundScore: 0,
      streakMultiplier: 1,
      streak: 0,
    });
    Game.nextRound();
  });

  els.btnHint.addEventListener('click', () => {
    const challenge = Game.getState().currentChallenge;
    if (challenge && challenge.hint) {
      els.hintArea.textContent = '💡 ' + challenge.hint;
      els.hintArea.classList.remove('hidden');
      Game.useHint();
    }
  });

  function submitAnswer() {
    const input = els.playerInput.value.trim();
    if (!input) {
      els.playerInput.focus();
      return;
    }

    const roundResult = Game.submitAnswer(input);
    if (!roundResult) return;

    showResult(roundResult);
  }

  // === Result Display ===

  function showResult(roundResult) {
    const { result, roundScore, streakMultiplier, challenge } = roundResult;
    const scoreInfo = Game.getScoreLabel(result.totalScore);

    // Score circle
    els.resultScoreNumber.textContent = result.totalScore;
    els.resultScoreCircle.parentElement.className = `result-card ${scoreInfo.class}`;

    // Label & Feedback
    els.resultLabel.textContent = scoreInfo.label;
    els.resultFeedback.textContent = result.feedback;

    // Rhyme Highlights
    const hasEndRhyme = result.rhyme.details.syllableMatches > 0;
    const hasInternal = (result.rhyme.details.internalCross || []).length > 0 ||
                        (result.rhyme.details.internalWithin || []).length > 0;
    if (roundResult.playerLine && (hasEndRhyme || hasInternal)) {
      const highlight = RhymeEngine.highlightRhyme(challenge.line, roundResult.playerLine);
      els.rhymeLine1.innerHTML = highlight.html1;
      els.rhymeLine2.innerHTML = highlight.html2;
      els.rhymeComparison.classList.remove('hidden');
    } else {
      els.rhymeComparison.classList.add('hidden');
    }

    // Details
    els.resultSyllables.textContent = result.rhyme.details.syllableMatches;
    els.resultType.textContent = formatRhymeType(result.rhyme.details.type);

    // Internal rhyme bonus
    const internalBonus = result.rhyme.details.internalBonus || 0;
    if (internalBonus > 0) {
      const crossCount = (result.rhyme.details.internalCross || []).length;
      const withinCount = (result.rhyme.details.internalWithin || []).length;
      let label = `+${internalBonus}`;
      const parts = [];
      if (crossCount > 0) parts.push(`${crossCount} Binnen`);
      if (withinCount > 0) parts.push(`${withinCount} intern`);
      if (parts.length) label += ` (${parts.join(', ')})`;
      els.resultInternal.textContent = label;
      els.resultInternalRow.classList.remove('hidden');
    } else {
      els.resultInternalRow.classList.add('hidden');
    }

    // Wordplay
    if (result.wordplayBonus > 0) {
      els.resultWordplay.textContent = `+${result.wordplayBonus}`;
      els.resultWordplayRow.classList.remove('hidden');
    } else {
      els.resultWordplayRow.classList.add('hidden');
    }

    // Naturalness
    if (result.naturalnessMalus > 0) {
      els.resultNatural.textContent = `-${result.naturalnessMalus}`;
      els.resultNaturalRow.classList.remove('hidden');
    } else {
      els.resultNaturalRow.classList.add('hidden');
    }

    // Streak
    if (streakMultiplier > 1) {
      els.resultStreakMult.textContent = `x${streakMultiplier}`;
      els.resultStreakRow.classList.remove('hidden');
    } else {
      els.resultStreakRow.classList.add('hidden');
    }

    els.resultRoundScore.textContent = roundScore;

    // Examples
    els.resultExamples.innerHTML = '';
    if (challenge && challenge.examples) {
      challenge.examples.forEach(ex => {
        const div = document.createElement('div');
        div.className = 'example-line';
        div.innerHTML = `"${escapeHtml(ex.text)}" <span class="example-quality">${formatQuality(ex.quality)}</span>`;
        els.resultExamples.appendChild(div);
      });
    }

    // Update header scores
    const state = Game.getState();
    els.scoreDisplay.textContent = state.score;
    els.streakDisplay.textContent = state.streak;

    // Show overlay
    els.resultOverlay.classList.remove('hidden');

    // Animate score
    els.resultScoreCircle.classList.remove('score-animate');
    void els.resultScoreCircle.offsetWidth;
    els.resultScoreCircle.classList.add('score-animate');
  }

  els.btnNext.addEventListener('click', () => {
    const challenge = Game.nextRound();
    if (challenge) {
      displayChallenge();
    } else {
      showEndScreen();
    }
  });

  // === End Screen ===

  function showEndScreen() {
    const stats = Game.getFinalStats();

    els.endRank.textContent = stats.rank;
    els.endScore.textContent = stats.totalScore;
    els.endAvg.textContent = stats.avgScore;
    els.endBestStreak.textContent = stats.bestStreak;
    els.endHints.textContent = stats.hintsUsed;

    // Rhyme type breakdown
    els.endBreakdown.innerHTML = '<h4 style="color: var(--text-dim); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Reimtyp-Verteilung</h4>';
    const typeLabels = {
      'multisyllabic_clean': 'Mehrsilbig (sauber)',
      'multisyllabic_dirty': 'Mehrsilbig (unsauber)',
      'double_clean': 'Doppelreim (sauber)',
      'double_dirty': 'Doppelreim (unsauber)',
      'single_clean': 'Einfach (sauber)',
      'single_dirty': 'Einfach (unsauber)',
      'weak': 'Schwach',
      'none': 'Kein Reim',
    };

    for (const [type, count] of Object.entries(stats.rhymeTypes)) {
      const div = document.createElement('div');
      div.className = 'breakdown-row';
      div.innerHTML = `<span>${typeLabels[type] || type}</span><span>${count}x</span>`;
      els.endBreakdown.appendChild(div);
    }

    // Round history
    els.endHistory.innerHTML = '';
    const state = Game.getState();
    state.history.forEach(h => {
      const div = document.createElement('div');
      div.className = 'history-round';
      div.innerHTML = `
        <div class="history-round-header">
          <span>Runde ${h.round}</span>
          <span class="history-round-score">${h.roundScore} Pkt</span>
        </div>
        <div class="history-challenge">"${escapeHtml(h.challenge.line)}"</div>
        <div class="history-answer">${h.playerLine ? '→ "' + escapeHtml(h.playerLine) + '"' : '<em>Übersprungen</em>'}</div>
      `;
      els.endHistory.appendChild(div);
    });

    showScreen('end');
  }

  els.btnRestart.addEventListener('click', () => {
    showScreen('start');
  });

  // === Helpers ===

  function formatRhymeType(type) {
    const map = {
      'multisyllabic_clean': 'Mehrsilbig (sauber)',
      'multisyllabic_dirty': 'Mehrsilbig (unsauber)',
      'double_clean': 'Doppelreim (sauber)',
      'double_dirty': 'Doppelreim (unsauber)',
      'single_clean': 'Einfach (sauber)',
      'single_dirty': 'Einfach (unsauber)',
      'weak': 'Schwach',
      'none': 'Kein Reim',
    };
    return map[type] || type;
  }

  function formatQuality(q) {
    const map = {
      'clean': 'sauber',
      'dirty': 'unsauber',
      'double': 'Doppelreim',
      'multi': 'Mehrsilbig',
      'wordplay': 'Wortspiel',
    };
    return map[q] || q;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();

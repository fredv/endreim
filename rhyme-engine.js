/**
 * Deutsche Reim-Analyse-Engine
 * Konvertiert deutschen Text in phonetische Repräsentation und bewertet Reimqualität.
 */

const RhymeEngine = (() => {

  // Deutsche Phonetik-Regeln: Buchstaben/Kombinationen → IPA-ähnliche Symbole
  const CONSONANT_RULES = [
    [/sch/g, 'ʃ'],
    [/tsch/g, 'tʃ'],
    [/ch(?=[eiäöü])/g, 'ç'],
    [/ch/g, 'x'],
    [/ck/g, 'k'],
    [/ph/g, 'f'],
    [/qu/g, 'kv'],
    [/th/g, 't'],
    [/tz/g, 'ts'],
    [/ng/g, 'ŋ'],
    [/nk/g, 'ŋk'],
    [/ss/g, 's'],
    [/ß/g, 's'],
    [/dt$/g, 't'],
    [/ds$/g, 'ts'],
    [/x/g, 'ks'],
    [/z/g, 'ts'],
    [/v/g, 'f'],
    [/w/g, 'v'],
    [/j/g, 'j'],
    [/y(?=[aeiouäöü])/g, 'j'],
  ];

  const VOWEL_RULES = [
    [/ei/g, 'aɪ'],
    [/ai/g, 'aɪ'],
    [/ay/g, 'aɪ'],
    [/ey/g, 'aɪ'],
    [/eu/g, 'ɔʏ'],
    [/äu/g, 'ɔʏ'],
    [/au/g, 'aʊ'],
    [/ie/g, 'iː'],
    [/oo/g, 'oː'],
    [/ee/g, 'eː'],
    [/aa/g, 'aː'],
    [/ä/g, 'ɛ'],
    [/ö/g, 'ø'],
    [/ü/g, 'y'],
  ];

  // Vokale für Silbenerkennung
  const VOWEL_PHONEMES = new Set(['a', 'aː', 'e', 'eː', 'ɛ', 'i', 'iː', 'o', 'oː', 'u', 'uː', 'ø', 'y', 'aɪ', 'ɔʏ', 'aʊ']);
  const VOWEL_CHARS = /[aeiouäöüáéíóúàèìòù]/i;

  /**
   * Wandelt ein deutsches Wort in eine phonetische Repräsentation um.
   */
  function toPhonetic(word) {
    let w = word.toLowerCase().trim();

    // Diphthonge und Vokal-Kombinationen zuerst
    for (const [pattern, replacement] of VOWEL_RULES) {
      w = w.replace(pattern, replacement);
    }

    // Konsonanten-Regeln
    for (const [pattern, replacement] of CONSONANT_RULES) {
      w = w.replace(pattern, replacement);
    }

    // Auslautverhärtung: stimmhafte Konsonanten am Wortende werden stimmlos
    w = w.replace(/b$/g, 'p');
    w = w.replace(/d$/g, 't');
    w = w.replace(/g$/g, 'k');

    // Doppelte Konsonanten vereinfachen
    w = w.replace(/(.)\1+/g, '$1');

    return w;
  }

  /**
   * Zerlegt ein phonetisches Wort in Silben (vereinfacht).
   * Gibt ein Array von Silben-Objekten zurück: { onset, nucleus, coda }
   */
  function splitSyllables(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const syllables = [];

    for (const word of words) {
      const phonetic = toPhonetic(word);
      const wordSyllables = extractSyllablesFromPhonetic(phonetic, word);
      syllables.push(...wordSyllables);
    }

    return syllables;
  }

  function extractSyllablesFromPhonetic(phonetic, originalWord) {
    // Vereinfachte Silbentrennung basierend auf Vokalen im Originalwort
    const vowelPositions = [];
    const original = originalWord.toLowerCase();

    // Finde Vokalgruppen im Originalwort
    let i = 0;
    while (i < original.length) {
      // Prüfe auf Diphthonge
      const digraph = original.substring(i, i + 2);
      if (['ei', 'ai', 'ay', 'ey', 'eu', 'äu', 'au', 'ie'].includes(digraph)) {
        vowelPositions.push(i);
        i += 2;
      } else if (VOWEL_CHARS.test(original[i])) {
        vowelPositions.push(i);
        i++;
        // Überspringe nachfolgende gleiche Vokale (aa, ee, oo)
        while (i < original.length && original[i] === original[i - 1]) i++;
      } else {
        i++;
      }
    }

    if (vowelPositions.length === 0) {
      return [{ full: phonetic, nucleus: '', weight: 0 }];
    }

    // Erzeuge Silben basierend auf Vokalkernen
    const syllables = [];
    for (let v = 0; v < vowelPositions.length; v++) {
      const start = v === 0 ? 0 : Math.floor((vowelPositions[v - 1] + vowelPositions[v]) / 2) + 1;
      const end = v === vowelPositions.length - 1 ? original.length : Math.floor((vowelPositions[v] + vowelPositions[v + 1]) / 2) + 1;
      const syllableText = original.substring(start, end);
      const phoneticSyllable = toPhonetic(syllableText);

      // Extrahiere Nukleus (Vokal-Kern)
      let nucleus = '';
      const digraph = original.substring(vowelPositions[v], vowelPositions[v] + 2);
      if (['ei', 'ai', 'ay', 'ey'].includes(digraph)) nucleus = 'aɪ';
      else if (['eu', 'äu'].includes(digraph)) nucleus = 'ɔʏ';
      else if (digraph === 'au') nucleus = 'aʊ';
      else if (digraph === 'ie') nucleus = 'iː';
      else {
        const vowel = original[vowelPositions[v]];
        const map = { 'a': 'a', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u', 'ä': 'ɛ', 'ö': 'ø', 'ü': 'y' };
        nucleus = map[vowel] || vowel;
      }

      syllables.push({
        full: phoneticSyllable,
        nucleus: nucleus,
        text: syllableText,
        weight: v === vowelPositions.length - 1 ? 2 : 1 // Letzte Silbe wiegt mehr
      });
    }

    return syllables;
  }

  /**
   * Vergleicht zwei Silben und gibt einen Ähnlichkeitswert zurück (0-1).
   */
  function compareSyllables(s1, s2) {
    if (!s1 || !s2) return 0;

    // Nukleus-Vergleich (Vokale) – wichtigster Teil
    const nucleusMatch = compareNucleus(s1.nucleus, s2.nucleus);
    if (nucleusMatch === 0) return 0; // Ohne Vokal-Übereinstimmung kein Reim

    // Coda-Vergleich (Endkonsonanten)
    const endS1 = getEndConsonants(s1.full, s1.nucleus);
    const endS2 = getEndConsonants(s2.full, s2.nucleus);
    const codaMatch = compareStrings(endS1, endS2);

    // Onset-Vergleich (Anfangskonsonanten) – weniger wichtig
    const startS1 = getStartConsonants(s1.full, s1.nucleus);
    const startS2 = getStartConsonants(s2.full, s2.nucleus);
    const onsetMatch = compareStrings(startS1, startS2);

    // Gewichtung: Nukleus 40%, Coda 40%, Onset 20%
    return nucleusMatch * 0.4 + codaMatch * 0.4 + onsetMatch * 0.2;
  }

  function compareNucleus(n1, n2) {
    if (n1 === n2) return 1.0;

    // Ähnliche Vokale
    const similarGroups = [
      ['a', 'aː'],
      ['e', 'eː', 'ɛ'],
      ['i', 'iː'],
      ['o', 'oː'],
      ['u', 'uː'],
      ['ø', 'e', 'ɛ'],  // ö klingt ähnlich wie e
      ['y', 'i', 'iː'],  // ü klingt ähnlich wie i
      ['aɪ', 'aː'],
    ];

    for (const group of similarGroups) {
      if (group.includes(n1) && group.includes(n2)) return 0.7;
    }

    return 0;
  }

  function getEndConsonants(phonetic, nucleus) {
    const idx = phonetic.lastIndexOf(nucleus);
    if (idx === -1) return phonetic.slice(-2);
    return phonetic.substring(idx + nucleus.length);
  }

  function getStartConsonants(phonetic, nucleus) {
    const idx = phonetic.indexOf(nucleus);
    if (idx === -1) return '';
    return phonetic.substring(0, idx);
  }

  function compareStrings(s1, s2) {
    if (s1 === s2) return 1.0;
    if (s1.length === 0 && s2.length === 0) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.3;

    // Levenshtein-basierte Ähnlichkeit
    const maxLen = Math.max(s1.length, s2.length);
    const dist = levenshtein(s1, s2);
    return Math.max(0, 1 - dist / maxLen);
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[m][n];
  }

  /**
   * Bewertet den Reim zwischen zwei Zeilen.
   * Gibt ein Ergebnis-Objekt zurück mit Score und Details.
   */
  function evaluateRhyme(line1, line2) {
    const clean1 = cleanLine(line1);
    const clean2 = cleanLine(line2);

    const syl1 = splitSyllables(clean1);
    const syl2 = splitSyllables(clean2);

    if (syl1.length === 0 || syl2.length === 0) {
      return { score: 0, details: { syllableMatches: 0, type: 'none' } };
    }

    // Vergleiche Silben von hinten nach vorne (Reimschema)
    const maxCompare = Math.min(syl1.length, syl2.length);
    let totalMatch = 0;
    let matchCount = 0;
    const syllableScores = [];

    for (let i = 0; i < maxCompare; i++) {
      const s1 = syl1[syl1.length - 1 - i];
      const s2 = syl2[syl2.length - 1 - i];
      const score = compareSyllables(s1, s2);

      syllableScores.push({
        syl1: s1.text,
        syl2: s2.text,
        score: score
      });

      if (score >= 0.3) {
        // Gewichtung: erste reimende Silbe (von hinten) zählt am meisten
        const weight = 1 / (i + 1);
        totalMatch += score * weight;
        matchCount++;
      } else if (i > 0) {
        // Wenn eine Silbe nicht reimt, breche ab (Reim muss zusammenhängend sein)
        break;
      } else {
        // Letzte Silbe reimt nicht → kein Reim
        return {
          score: 0,
          details: {
            syllableMatches: 0,
            type: 'none',
            syllableScores
          }
        };
      }
    }

    // Reimtyp bestimmen
    let type = 'none';
    const lastSylScore = syllableScores[0]?.score || 0;

    if (matchCount >= 3 && lastSylScore >= 0.7) type = 'multisyllabic_clean';
    else if (matchCount >= 3) type = 'multisyllabic_dirty';
    else if (matchCount === 2 && lastSylScore >= 0.7) type = 'double_clean';
    else if (matchCount === 2) type = 'double_dirty';
    else if (lastSylScore >= 0.85) type = 'single_clean';
    else if (lastSylScore >= 0.5) type = 'single_dirty';
    else type = 'weak';

    // Basis-Score berechnen
    const baseScore = totalMatch;

    // Bonus für mehr reimende Silben
    const syllableBonus = Math.max(0, (matchCount - 1) * 15);

    // Qualitätsbonus für saubere Reime
    const cleanBonus = lastSylScore >= 0.85 ? 10 : lastSylScore >= 0.7 ? 5 : 0;

    // Gesamtpunktzahl
    const rawScore = (baseScore * 40) + syllableBonus + cleanBonus;
    const finalScore = Math.round(Math.min(100, rawScore));

    return {
      score: finalScore,
      details: {
        syllableMatches: matchCount,
        type,
        syllableScores,
        baseScore: Math.round(baseScore * 100) / 100,
        syllableBonus,
        cleanBonus,
      }
    };
  }

  /**
   * Bereinigt eine Zeile für die Analyse.
   */
  function cleanLine(line) {
    return line
      .replace(/[.,!?;:"""''„"«»\-–—()[\]{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Bewertet die Wortspiel-Qualität (Doppeldeutigkeit, Wortspiel).
   * Gibt einen Bonus-Score zurück.
   */
  function evaluateWordplay(line1, line2) {
    const words1 = cleanLine(line1).toLowerCase().split(/\s+/);
    const words2 = cleanLine(line2).toLowerCase().split(/\s+/);
    let bonus = 0;

    // Prüfe auf Wortteile, die in beiden Zeilen vorkommen (Wortspiel-Indikator)
    for (const w1 of words1) {
      if (w1.length < 4) continue;
      for (const w2 of words2) {
        if (w2.length < 4) continue;
        if (w1 === w2) continue; // Gleiche Wörter sind kein Wortspiel

        // Teilübereinstimmung: ein Wort enthält das andere
        if (w1.includes(w2) || w2.includes(w1)) {
          bonus += 5;
        }

        // Phonetisch ähnlich aber andere Schreibweise
        const p1 = toPhonetic(w1);
        const p2 = toPhonetic(w2);
        if (p1 === p2 && w1 !== w2) {
          bonus += 10; // Homophon!
        } else if (p1.length > 3 && p2.length > 3) {
          const sim = 1 - levenshtein(p1, p2) / Math.max(p1.length, p2.length);
          if (sim > 0.8 && w1 !== w2) {
            bonus += 7; // Fast homophon
          }
        }
      }
    }

    return Math.min(25, bonus); // Max 25 Bonuspunkte
  }

  /**
   * Prüft ob der Reim "hingezweckt" wirkt (unnatürlich konstruiert).
   * Gibt einen Malus (Abzug) zurück.
   */
  function evaluateNaturalness(line) {
    let malus = 0;
    const words = cleanLine(line).toLowerCase().split(/\s+/);

    // Sehr kurze Zeilen wirken oft erzwungen
    if (words.length <= 2) malus += 10;

    // Prüfe auf "Füllwörter" am Ende, die nur dem Reim dienen
    const fillerEndings = ['halt', 'eben', 'doch', 'mal', 'hier', 'dort', 'wohl', 'noch', 'schon', 'ja', 'na'];
    if (fillerEndings.includes(words[words.length - 1]) && words.length <= 3) {
      malus += 5;
    }

    return malus;
  }

  /**
   * Hauptfunktion: Bewertet eine Spielerantwort vollständig.
   */
  function scoreAnswer(challengeLine, playerLine) {
    if (!playerLine || playerLine.trim().length === 0) {
      return {
        totalScore: 0,
        rhyme: { score: 0, details: { type: 'none', syllableMatches: 0 } },
        wordplayBonus: 0,
        naturalnessMalus: 0,
        feedback: 'Gib eine Zeile ein!'
      };
    }

    const rhyme = evaluateRhyme(challengeLine, playerLine);
    const wordplayBonus = evaluateWordplay(challengeLine, playerLine);
    const naturalnessMalus = evaluateNaturalness(playerLine);

    const totalScore = Math.max(0, Math.min(100, rhyme.score + wordplayBonus - naturalnessMalus));

    const feedback = generateFeedback(rhyme, wordplayBonus, naturalnessMalus, totalScore);

    return {
      totalScore,
      rhyme,
      wordplayBonus,
      naturalnessMalus,
      feedback
    };
  }

  function generateFeedback(rhyme, wordplayBonus, naturalnessMalus, totalScore) {
    const type = rhyme.details.type;
    const syllables = rhyme.details.syllableMatches;

    if (totalScore === 0) return 'Das reimt sich leider gar nicht. Versuch es nochmal!';
    if (totalScore < 20) return 'Ein schwacher Reim... Da geht noch mehr!';

    let fb = '';

    if (type.startsWith('multisyllabic')) {
      fb = `🔥 ${syllables}-Silben-Reim! `;
      if (type.includes('clean')) fb += 'Und dazu noch sauber!';
      else fb += 'Nicht ganz sauber, aber respektabel!';
    } else if (type.startsWith('double')) {
      fb = `💪 Doppelreim! `;
      if (type.includes('clean')) fb += 'Sauber getroffen!';
      else fb += 'Leicht unsauber, aber solide.';
    } else if (type.startsWith('single')) {
      fb = `👍 Einfacher Reim. `;
      if (type.includes('clean')) fb += 'Sauber!';
      else fb += 'Geht so.';
    } else {
      fb = 'Schwacher Reim.';
    }

    if (wordplayBonus > 0) fb += ` ✨ Wortspiel-Bonus: +${wordplayBonus}!`;
    if (naturalnessMalus > 0) fb += ` ⚠️ Wirkt etwas erzwungen: -${naturalnessMalus}`;

    return fb;
  }

  // Public API
  return {
    toPhonetic,
    splitSyllables,
    evaluateRhyme,
    evaluateWordplay,
    evaluateNaturalness,
    scoreAnswer,
    cleanLine
  };
})();

if (typeof module !== 'undefined') module.exports = RhymeEngine;

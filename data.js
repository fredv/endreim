/**
 * Challenge-Daten für das Reim-Spiel.
 * Jede Challenge hat:
 * - type: 'punchline' (Spieler ergänzt Punchline) oder 'setup' (Spieler ergänzt Setup)
 * - line: Die vorgegebene Zeile
 * - examples: Beispiel-Lösungen mit Bewertung (zur Orientierung)
 * - hint: Optionaler Hinweis
 * - difficulty: 1-3 (Leicht/Mittel/Schwer)
 */

const CHALLENGES = [
  // === LEICHT (Difficulty 1) – Einfache Reimwörter ===
  {
    type: 'punchline',
    line: 'Ich steh auf der Bühne und rock das Haus',
    examples: [
      { text: 'Und jeder im Saal flippt komplett aus', quality: 'clean' },
      { text: 'Die Crowd geht ab, der Beat pumpt raus', quality: 'clean' },
    ],
    hint: 'Reim auf "Haus" (-aus)',
    difficulty: 1,
    category: 'flow'
  },
  {
    type: 'punchline',
    line: 'Mein Flow ist so hart wie Beton',
    examples: [
      { text: 'Ich rappe besser als dein Lieblingsson', quality: 'dirty' },
      { text: 'Dein Rap klingt wie ein müder Ton', quality: 'clean' },
    ],
    hint: 'Reim auf "-on"',
    difficulty: 1,
    category: 'battle'
  },
  {
    type: 'punchline',
    line: 'Ich schreib die Zeilen tief in der Nacht',
    examples: [
      { text: 'Bis die Sonne aufgeht, Stift an der Macht', quality: 'double' },
      { text: 'Hab mir über jeden Reim Gedanken gemacht', quality: 'clean' },
    ],
    hint: 'Reim auf "-acht"',
    difficulty: 1,
    category: 'storytelling'
  },
  {
    type: 'setup',
    line: 'Doch am Ende bin ich immer noch hier',
    examples: [
      { text: 'Ihr habt gesagt, ich schaff es nie – nicht mit mir', quality: 'clean' },
      { text: 'Egal was kommt, ich verlier nicht die Gier', quality: 'double' },
    ],
    hint: 'Reim auf "-ier"',
    difficulty: 1,
    category: 'motivation'
  },
  {
    type: 'punchline',
    line: 'Mein Kopf ist voll, mein Herz ist schwer',
    examples: [
      { text: 'Doch meine Reime treffen umso mehr', quality: 'clean' },
      { text: 'Ich rappe weiter, geb den Stift nicht her', quality: 'clean' },
    ],
    hint: 'Reim auf "-er"',
    difficulty: 1,
    category: 'emotional'
  },

  // === MITTEL (Difficulty 2) – Doppelreime ===
  {
    type: 'punchline',
    line: 'Ich komm aus dem Schatten ins grelle Licht',
    examples: [
      { text: 'Zeig der Welt mein wahres Gesicht', quality: 'double' },
      { text: 'Was ich verspreche, das hält und bricht nicht', quality: 'multi' },
    ],
    hint: 'Reim auf "-elles Licht" oder "-icht"',
    difficulty: 2,
    category: 'storytelling'
  },
  {
    type: 'punchline',
    line: 'Jeder Tag ist ein Kampf auf den Straßen',
    examples: [
      { text: 'Doch ich bleib ruhig, lass die anderen rasen', quality: 'clean' },
      { text: 'Wer mich unterschätzt, den werd ich überraschen', quality: 'dirty' },
    ],
    hint: 'Reim auf "-aßen"',
    difficulty: 2,
    category: 'street'
  },
  {
    type: 'setup',
    line: 'Denn mein Wortschatz ist ne scharfe Klinge',
    examples: [
      { text: 'Ich schleif an meinen Reimen, wie an anderen Dinge', quality: 'dirty' },
      { text: 'Pass auf, dass ich dich nicht mit Silben bezwinge', quality: 'double' },
    ],
    hint: 'Reim auf "-inge"',
    difficulty: 2,
    category: 'battle'
  },
  {
    type: 'punchline',
    line: 'Die Leute reden viel, doch machen wenig',
    examples: [
      { text: 'Ich bleib auf meinem Weg, auch wenn er steinig', quality: 'double' },
      { text: 'Wer nicht liefert, ist am Ende der Einzige', quality: 'dirty' },
    ],
    hint: 'Reim auf "-enig"',
    difficulty: 2,
    category: 'real talk'
  },
  {
    type: 'punchline',
    line: 'Ich bau mir mein Imperium Stein für Stein',
    examples: [
      { text: 'Jede Zeile ist ein Baustein, jeder Reim ist fein', quality: 'double' },
      { text: 'Und am Ende steh ich ganz allein – nein, ich steh an der Spitze, schein wie Sonnenschein', quality: 'multi' },
    ],
    hint: 'Reim auf "-ein"',
    difficulty: 2,
    category: 'motivation'
  },
  {
    type: 'setup',
    line: 'Dann steh ich auf und mach weiter',
    examples: [
      { text: 'Jedes Mal wenn ich fall, wird die Leiter breiter', quality: 'double' },
      { text: 'Das Leben schlägt mich nieder, doch ich bin ein Streiter', quality: 'clean' },
    ],
    hint: 'Reim auf "-eiter"',
    difficulty: 2,
    category: 'motivation'
  },

  // === SCHWER (Difficulty 3) – Mehrsilbige Reime und Wortspiele ===
  {
    type: 'punchline',
    line: 'Ich zerleg dich mit Metaphern und Vergleichen',
    examples: [
      { text: 'Deine Punchlines sind so weich, die könnten schmelzen und entweichen', quality: 'multi' },
      { text: 'Meine Silben sind wie Pfeile, die ihr Ziel erreichen', quality: 'multi' },
    ],
    hint: 'Reim auf "-ergleichen" (Mehrsilbenreim!)',
    difficulty: 3,
    category: 'battle'
  },
  {
    type: 'punchline',
    line: 'Meine Texte sind Therapie für die Seele',
    examples: [
      { text: 'Jede Zeile heilt ein Stück, auch wenn ich manchmal fehle', quality: 'double' },
      { text: 'Ich rap nicht für die Kohle, sondern weil ich erzähle', quality: 'multi' },
    ],
    hint: 'Reim auf "-eele" / "-ähle"',
    difficulty: 3,
    category: 'emotional'
  },
  {
    type: 'setup',
    line: 'Ich lass die Reime regnen wie ein Wasserfall',
    examples: [
      { text: 'Mein Wortschatz ist die Quelle, meine Stimme ist der Schall', quality: 'double' },
      { text: 'Jede Silbe trifft wie Tropfen – überall', quality: 'clean' },
    ],
    hint: 'Reim auf "-all"',
    difficulty: 3,
    category: 'flow'
  },
  {
    type: 'punchline',
    line: 'Du rappst als wärst du unter Wasser am Atmen',
    examples: [
      { text: 'Ich bin der Hai in diesem Becken, du kannst höchstens schatten', quality: 'dirty' },
      { text: 'Während du ertrinkst, lern ich schwimmen in Takten', quality: 'multi' },
    ],
    hint: 'Reim auf "-atmen" / "-akten"',
    difficulty: 3,
    category: 'battle'
  },
  {
    type: 'punchline',
    line: 'Ich hab die Sprache zerlegt und neu zusammengebaut',
    examples: [
      { text: 'Jedes Wort ein Zahnrad, jeder Satz hat Kraft und braut', quality: 'dirty' },
      { text: 'Bis die Crowd mir vertraut und jeder auf mich schaut', quality: 'multi' },
    ],
    hint: 'Reim auf "-aut" / "-baut"',
    difficulty: 3,
    category: 'lyrical'
  },
  {
    type: 'setup',
    line: 'Meine Worte schneiden tiefer als ein Skalpell',
    examples: [
      { text: 'Sie gehen unter die Haut, treffen jede Nervenzell', quality: 'multi' },
      { text: 'Jede Zeile operiert dich, Bruder, schnell und reell', quality: 'double' },
    ],
    hint: 'Reim auf "-ell"',
    difficulty: 3,
    category: 'battle'
  },
  {
    type: 'punchline',
    line: 'In meinem Viertel gibt es mehr Beton als Bäume',
    examples: [
      { text: 'Doch zwischen grauen Wänden wachsen meine Träume', quality: 'multi' },
      { text: 'Ich rappe über Wahrheit, nicht über Schäume', quality: 'clean' },
    ],
    hint: 'Reim auf "-äume"',
    difficulty: 3,
    category: 'street'
  },
  {
    type: 'punchline',
    line: 'Ich steh am Mikrofon und die Zeit bleibt stehen',
    examples: [
      { text: 'Alle Augen auf mich, sie wollen Magie sehen', quality: 'multi' },
      { text: 'Mein Flow ist so hypnotisch, keiner will mehr gehen', quality: 'double' },
    ],
    hint: 'Reim auf "-ehen"',
    difficulty: 3,
    category: 'flow'
  },

  // === BONUS: Wortspiel-Challenges ===
  {
    type: 'punchline',
    line: 'Ich bin nicht von dieser Welt, nenn mich Alien',
    examples: [
      { text: 'Meine Bars sind so krank, ich brauch nen Medikament – ali, wem sag ich das', quality: 'wordplay' },
      { text: 'Ich mach Musik für alle Zeiten, nicht nur für Ali und den Rest', quality: 'wordplay' },
    ],
    hint: 'Versuch ein Wortspiel!',
    difficulty: 3,
    category: 'wordplay'
  },
  {
    type: 'punchline',
    line: 'Andere Rapper brauchen Ghostwriter',
    examples: [
      { text: 'Ich schreib allein, bei mir ist jede Line ein Hitter', quality: 'clean' },
      { text: 'Die sind so durchsichtig – echte Geisterreiter', quality: 'wordplay' },
    ],
    hint: 'Ghost = Geist – Wortspiel möglich!',
    difficulty: 3,
    category: 'wordplay'
  },
];

/**
 * Gibt zufällige Challenges einer bestimmten Schwierigkeit zurück.
 */
function getRandomChallenges(difficulty = null, count = 1) {
  let pool = CHALLENGES;
  if (difficulty !== null) {
    pool = CHALLENGES.filter(c => c.difficulty === difficulty);
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Gibt alle Challenges einer Kategorie zurück.
 */
function getChallengesByCategory(category) {
  return CHALLENGES.filter(c => c.category === category);
}

/**
 * Gibt alle verfügbaren Kategorien zurück.
 */
function getCategories() {
  return [...new Set(CHALLENGES.map(c => c.category))];
}

if (typeof module !== 'undefined') {
  module.exports = { CHALLENGES, getRandomChallenges, getChallengesByCategory, getCategories };
}

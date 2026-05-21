// Local image paths for question backgrounds.
// null = no background (plain dark theme shown instead).
// Base path is relative to the public/ folder.

const img = (file) => `/harry-potter-quiz/images/questions/${file}`;

export const QUESTION_IMAGES = {
  // ── Round 1: Draco Malfoy ───────────────────────────────
  r1q1: null,
  r1q2: null,
  r1q3: img('r1q3.jpg'),      // Dobby
  r1q4: null,
  r1q5: img('r1q5.jpg'),      // Nimbus 2001

  // ── Round 2: George Weasley ─────────────────────────────
  r2q1: img('r2q1.jpg'),      // Marauder's Map
  r2q2: img('r2q2.jpg'),      // Weasleys' Wizard Wheezes shop
  r2q3: null,
  r2q4: img('r2q4.jpg'),      // Battle of the Seven Potters
  r2q5: null,

  // ── Round 3: Fred Weasley ───────────────────────────────
  r3q1: null,
  r3q2: null,
  r3q3: null,
  r3q4: null,
  r3q5: img('r3q5.jpg'),      // Swamp / Portable Swamp

  // ── Round 4: Mr. Weasley ────────────────────────────────
  r4q1: null,
  r4q2: null,
  r4q3: img('r4q3.webp'),     // Nagini
  r4q4: null,
  r4q5: null,

  // ── Round 5: Professor McGonagall ───────────────────────
  r5q1: img('r5q1.jpg'),      // Transfiguration classroom
  r5q2: img('r5q2.jpg'),      // Gryffindor common room
  r5q3: img('r5q3.jpg'),      // Tabby cat
  r5q4: null,
  r5q5: img('r5q5.webp'),     // Professor McGonagall

  // ── Round 6: Mrs. Weasley ───────────────────────────────
  r6q1: null,
  r6q2: null,
  r6q3: img('r6q3.webp'),     // Bellatrix Lestrange
  r6q4: img('r6q4.webp'),     // Boggart
  r6q5: img('r6q5.webp'),     // Molly Weasley

  // ── Round 7: Remus Lupin ────────────────────────────────
  r7q1: img('r7q1.jpg'),      // Full moon (werewolf)
  r7q2: img('r7q2.webp'),     // Tonks
  r7q3: img('r7q3.jpg'),      // Moon (Moony)
  r7q4: img('r7q4.webp'),     // Wolfsbane Potion
  r7q5: null,

  // ── Round 8: Lily Potter ────────────────────────────────
  r8q1: img('r8q1.jpg'),      // Gryffindor common room
  r8q2: img('r8q2.webp'),     // Lily Evans
  r8q3: img('r8q3.webp'),     // Severus Snape
  r8q4: img('r8q4.jpg'),      // Lily Potter
  r8q5: null,

  // ── Round 9: James Potter ───────────────────────────────
  r9q1: null,
  r9q2: img('r9q2.webp'),     // Peter Pettigrew
  r9q3: img('r9q3.jpg'),      // Stag
  r9q4: img('r9q4.webp'),     // James Potter
  r9q5: null,

  // ── Round 10: Hagrid ────────────────────────────────────
  r10q1: img('r10q1.webp'),   // Fluffy
  r10q2: img('r10q2.jpg'),    // Care of Magical Creatures
  r10q3: img('r10q3.jpg'),    // Norwegian Ridgeback / Norbert
  r10q4: img('r10q4.webp'),   // Grawp
  r10q5: null,

  // ── Round 11: Voldemort ─────────────────────────────────
  r11q1: img('r11q1.webp'),   // Nagini
  r11q2: img('r11q2.webp'),   // Tom Riddle
  r11q3: null,
  r11q4: img('r11q4.jpg'),    // Fawkes / phoenix (wand core)
  r11q5: img('r11q5.webp'),   // Wool's Orphanage

  // ── Round 12: Albus Dumbledore ──────────────────────────
  r12q1: img('r12q1.webp'),   // Elder Wand
  r12q2: img('r12q2.jpg'),    // Fawkes
  r12q3: img('r12q3.webp'),   // Astronomy Tower
  r12q4: null,
  r12q5: img('r12q5.webp'),   // Dumbledore

  // ── Round 13: Ron Weasley ───────────────────────────────
  r13q1: null,
  r13q2: null,
  r13q3: img('r13q3.webp'),   // Gilderoy Lockhart
  r13q4: null,
  r13q5: img('r13q5.webp'),   // Ron Weasley

  // ── Round 14: Hermione Granger ──────────────────────────
  r14q1: null,
  r14q2: null,
  r14q3: img('r14q3.webp'),   // Time-Turner
  r14q4: img('r14q4.jpg'),    // Dobby (house elf / S.P.E.W.)
  r14q5: img('r14q5.png'),    // Glasses

  // ── Round 15: Harry Potter ──────────────────────────────
  r15q1: img('r15q1.jpg'),    // Golden Snitch
  r15q2: img('r15q2.jpg'),    // Stag Patronus
  r15q3: null,
  r15q4: null,
  r15q5: img('r15q5.webp'),   // Deathly Hallows symbol
};

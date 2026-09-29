/* ================================================================
 *  config.js — ⭐ EDIT THIS FILE TO PERSONALIZE YOUR WEBSITE ⭐
 * ================================================================
 *
 *  This is the ONLY file you need to change for content.
 *  Replace placeholder values below with your own:
 *    • Photo paths & captions
 *    • Chat messages
 *    • The anniversary letter
 *    • Music file path
 *
 *  For text that appears on the page (chapter titles, paragraphs),
 *  edit index.html directly — each section has clear comments.
 *
 * ================================================================ */

window.CONFIG = {

  /* ----------------------------------------------------------
   *  YOUR NAMES
   * ---------------------------------------------------------- */
  names: {
    you:     'RITIK',       // ← Replace with your name
    partner: 'SNEHA'     // ← Replace with your partner's name
  },

  /* ----------------------------------------------------------
   *  ANNIVERSARY DATE
   * ---------------------------------------------------------- */
  anniversary: {
    date:        '2019-09-30',           // ← YYYY-MM-DD format
    years:       7,
    displayDate: 'September 30, 2019'        // ← e.g. "September 18, 2019"
  },

  /* ----------------------------------------------------------
   *  PHOTOGRAPHS
   *
   *  • Place your images in  assets/images/
   *  • Use JPG or WebP, max ~800 px wide for performance
   *  • You can add or remove entries freely — the animation
   *    system adapts automatically.
   * ---------------------------------------------------------- */
  photos: {

    // Chapter 01 — The Beginning  (3 – 5 photos)
    beginning: [
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046230/photo01.jpg', caption: 'Our beginning',    alt: 'Photo from early days' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046230/photo02.jpg', caption: 'First date ❤️',   alt: 'Our first date' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo03.jpg', caption: 'The start of us',  alt: 'Early memory together' }
    ],

    // Chapter 02 — Our Memories  (5 – 8 photos)
    memories: [
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo04.jpg', caption: 'Adventures',           alt: 'Adventure photo' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo05.jpg', caption: 'That sunset',          alt: 'Sunset together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo06.jpg', caption: 'Random Tuesday ❤️',   alt: 'Casual day photo' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo07.jpg', caption: 'Birthday surprise',    alt: 'Birthday photo' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo08.jpg', caption: 'Road trip',            alt: 'Road trip photo' }
    ],

    // Chapter 03 — Us  (forms the heart shape, 6 – 15 photos)
    us: [
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046230/photo01.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046230/photo02.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo03.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo04.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo05.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo06.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo07.jpg', alt: 'Us together' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo08.jpg', alt: 'Us together' }
    ],

    // Chapter 04 — The Chaos  (2 – 4 funny photos)
    chaos: [
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo03.jpg', caption: 'The evidence 😂',     alt: 'Funny photo' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo08.jpg', caption: 'No context needed',    alt: 'Funny moment' }
    ],

    // Chapter 06 — 7 Years Later  (forms the giant "7", 10 – 20 photos)
    sevenYears: [
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046230/photo01.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046230/photo02.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo03.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo04.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo05.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo06.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo07.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790046231/photo08.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790045899/photo09.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790045899/photo10.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790045899/photo11.jpg', alt: 'Memory' },
      { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/v1790045899/photo12.jpg', alt: 'Memory' }
    ],

    // Chapter 07 — Still You  (1 main photo)
    stillYou: { src: 'https://res.cloudinary.com/hcesfmnq/image/upload/f_auto,q_auto/photo-main', alt: 'My favourite person' }

  },

  /* ----------------------------------------------------------
   *  CHAT MESSAGES — Chapter 04 (The Chaos)
   *
   *  sender: 'you' or 'partner'
   *  Add / remove freely.
   * ---------------------------------------------------------- */
  chatMessages: [
    { sender: 'ঢেঁড়স 🦥', text: ' তুমি একটা ঢেঁড়স 🦥 😂' },
    { sender: 'you',     text: 'আর তুমি একটা পটল 😭' },
    { sender: 'ঢেঁড়স 🦥', text: 'পাগল ❤️' },
    { sender: 'you',     text: 'হ্যাঁ তোমারই পাগল' }
    // ← Add more messages here
  ],

  /* ----------------------------------------------------------
   *  THE LETTER — shown in the final modal
   *
   *  Write your personal letter between the backticks.
   *  Use \n for line breaks.
   * ---------------------------------------------------------- */
  letter: [
  'Dear you,',

  '',

  'Seven years is a long time…',

  'and somehow, every year with you feels like it goes by too fast.',

  '',

  'Somewhere between all the laughter, little fights, endless conversations,',
  'and the countless ordinary moments, you became a part of me.',
  'Not just my favourite person, but my favourite feeling to come home to.',

  '',

  'When I look back, I don’t remember just the big moments.',
  'I remember the silly ones, the random ones,',
  'the days that meant nothing then but mean everything now.',
  'And maybe that is what I love most about us—',
  'you somehow made even the ordinary days worth remembering.',

  '',

  'We have grown together, changed together,',
  'and somehow, after all these years,',
  'I still find new reasons to fall for you.',

  '',

  'I don’t know what the next seven years will look like.',
  'But I hope they have more late-night talks,',
  'more stupid laughter, more memories,',
  'more places to go, more photographs to take,',
  'and a thousand more little moments that belong only to us.',

  '',

  'I don’t need a perfect story.',
  'I just want ours—',
  'a little messy, a little crazy,',
  'but always ours.',

  '',

  'Still choosing you.',

  'Still annoying you.',

  'Still falling for you.',

  '',

  'And, latteeee…',

  'still loving you.',

  '',

  'Always. ♡'
],
  /* ----------------------------------------------------------
   *  MUSIC — Background music
   *
   *  Place your MP3/OGG in  assets/music/
   * ---------------------------------------------------------- */
  music: {
    src:     'assets/music/jabtak.mpeg',   // ← path to your song
    enabled: true                            // set false to hide button
  },

  /* ----------------------------------------------------------
   *  PERFORMANCE — Tweak only if the site feels slow
   * ---------------------------------------------------------- */
  performance: {
    mobile:  { particles: 150, maxPhotos: 4,  pixelRatio: 1.5, shadows: false },
    tablet:  { particles: 350, maxPhotos: 6,  pixelRatio: 1.5, shadows: false },
    desktop: { particles: 700, maxPhotos: 10, pixelRatio: 2.0, shadows: true  }
  }
};

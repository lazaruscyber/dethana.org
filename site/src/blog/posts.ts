export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  kicker: string
  description: string
  body: BlogBlock[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-dethana',
    title: 'Why Dethana exists',
    kicker: 'The movement',
    date: '2026-09-01',
    excerpt: 'A library is not a brand. Dethana exists so the Tipiṭaka can be opened, shared, and kept free — in the spirit of going forth for the good of the many.',
    description: 'Why Dethana.org was made: a free Chaṭṭha Saṅgāyana Tipiṭaka library as Dhamma missionary work, not a bookstore or a social network.',
    body: [
      {
        type: 'p',
        text: 'The Buddha did not found a publishing house. He sent people out: go forth for the good of the many, for the happiness of the many; teach the Dhamma that is good in the beginning, good in the middle, and good in the end. Dethana takes that sentence as a reason to exist, not as decoration on a homepage.',
      },
      {
        type: 'quote',
        text: 'Go forth, O bhikkhus, for the good of the many… Teach, O bhikkhus, the Dhamma that is good in the beginning, good in the middle, and good in the end…',
      },
      {
        type: 'p',
        text: 'The name comes from Pāli desanā: teaching, the exposition of the Dhamma. The site is an institution in the modest sense — a place that holds a library together — and a movement in the older sense: people who want the Canon where it can be found, without a paywall or an account standing between a reader and a sutta.',
      },
      {
        type: 'h2',
        text: 'What we put online',
      },
      {
        type: 'p',
        text: 'We read the Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka, following the VRI digital edition: Vinaya, Sutta, Abhidhamma, with the Aṭṭhakathā close at hand. English here is a study translation, not a claim to replace the Pāli. The work is to keep the words reachable.',
      },
      {
        type: 'p',
        text: 'If you want to start in the text itself, open the [Dhammapada](/en/book/Dhp), walk the [five Nikāyas](/en/collection/nikaya), or read how the English is made in the [translation policy](/translation-policy).',
      },
    ],
  },
  {
    slug: 'reading-pali-with-a-study-translation',
    title: 'How to read Pāli with a study translation',
    kicker: 'Practice',
    date: '2026-08-24',
    excerpt: 'Keep the Pāli in view. Use English as a lamp, not a substitute. When the two disagree, trust the original.',
    description: 'A short guide to reading the Tipiṭaka on Dethana.org: Pāli first, English as a study aid, and how to use stacked or side-by-side layout.',
    body: [
      {
        type: 'p',
        text: 'A study translation is a lamp. It is not the room. Dethana shows Pāli and English together so you can see what the Canon actually says, then what a working English rendering makes of it. That pairing is the point of the reader — not a smoother paraphrase that hides the source.',
      },
      {
        type: 'h2',
        text: 'A simple way in',
      },
      {
        type: 'p',
        text: 'Leave both columns on. If the English runs ahead of your eye, switch the layout from stacked to side by side in text settings (the A in the header). Increase the type if the script feels small. None of this changes the text; it only changes how much of it you can hold at once.',
      },
      {
        type: 'p',
        text: 'When a sentence feels thin or too certain, look at the Pāli. Technical words — dukkha, saṅkhāra, Nibbāna — often carry more than one English habit. The translation policy explains how the English is produced and what it is not. In short: if Pāli and English pull apart, stay with the Pāli.',
      },
      {
        type: 'quote',
        text: 'These are research translations, not a replacement for the original Pāli or an authoritative rendering.',
        cite: 'Dethana translation policy',
      },
      {
        type: 'h2',
        text: 'Where to practise',
      },
      {
        type: 'p',
        text: 'Short verse is kinder than a long sermon on the first day. The [Dhammapada](/en/book/Dhp) is built for that. From there, a Nikāya collection is a map, not a homework list: open [the five collections](/en/collection/nikaya) and read one sutta the way you would sit with a letter, not a feed.',
      },
    ],
  },
  {
    slug: 'start-with-the-dhammapada',
    title: 'Start with the Dhammapada',
    kicker: 'The library',
    date: '2026-08-12',
    excerpt: 'Two lines can carry a whole path. The Dhammapada is the gentlest door into the Canon on this site — and it still belongs to the Khuddaka Nikāya, not to a greeting card.',
    description: 'Why the Dhammapada is a good first book on Dethana.org, and how it sits inside the Khuddaka Nikāya of the Sutta Piṭaka.',
    body: [
      {
        type: 'p',
        text: 'People meet the Dhammapada as quotations. That is not a crime, but it is not the book. On Dethana the Dhammapada is a Tipiṭaka text: verses in sequence, in the Khuddaka Nikāya, with Pāli beside a study English. You can read a chapter the way it was arranged, not the way a poster arranged it.',
      },
      {
        type: 'p',
        text: 'Verse is a mercy for a first sitting. The lines are short enough to reread. The Pāli is close enough to test. You do not need a theory of the whole Canon before you open [Yamaka Vagga](/en/book/Dhp).',
      },
      {
        type: 'h2',
        text: 'After the verses',
      },
      {
        type: 'p',
        text: 'When a verse names a practice you want to see in prose, the Nikāyas are waiting: [Dīgha, Majjhima, Saṃyutta, Aṅguttara, Khuddaka](/en/collection/nikaya). Discipline and higher teaching have their own doors — [Vinaya](/en/collection/vinaya) and [Abhidhamma](/en/collection/abhidhamma). Commentarial explanation lives with the [expositions](/en/collection/expositions).',
      },
      {
        type: 'p',
        text: 'None of that is a ladder you must climb. The Dhammapada is already the teaching. The rest of the library is there when a verse is not enough.',
      },
    ],
  },
  {
    slug: 'the-sixth-council-text',
    title: 'The Sixth Council text we read',
    kicker: 'The edition',
    date: '2026-07-30',
    excerpt: 'Dethana follows the Chaṭṭha Saṅgāyana Tipiṭaka as transmitted in the VRI digital edition — a public recension, not a private rewrite.',
    description: 'What the Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka is, and why Dethana.org follows the VRI digital edition with commentaries nearby.',
    body: [
      {
        type: 'p',
        text: 'Chaṭṭha Saṅgāyana names the Sixth Council, convened in Myanmar in the 1950s to recite and settle a Pāli recension of the Tipiṭaka. Dethana does not invent a new Canon. It reads that recension as it appears in the Vipassana Research Institute digital edition, the same family of text many students already know from CSCD.',
      },
      {
        type: 'p',
        text: 'An edition is a choice about spelling, paragraphing, and which books sit in which basket. It is not a claim that other recensions are unreal. It is a claim that this library will be consistent: one map, so a link to a paragraph means the same thing tomorrow.',
      },
      {
        type: 'h2',
        text: 'Commentaries beside the root',
      },
      {
        type: 'p',
        text: 'The Aṭṭhakathā and Ṭīkā are not the Buddha’s speech. They are how communities explained that speech. We keep them in the same house as the Mūla so a difficult line can be read with its traditional gloss, not as a replacement for it. English on those pages is still a study aid. The Pāli remains the text.',
      },
      {
        type: 'p',
        text: 'If you are new, ignore the editorial history for an hour and [open a book](/en/). Come back to this note when you want to know which recension you are holding.',
      },
    ],
  },
]

export function postsByDate() {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))
}

export function postBySlug(slug: string) {
  return BLOG_POSTS.find(post => post.slug === slug)
}

export function blogPath(slug?: string) {
  return slug ? `/blog/${slug}` : '/blog'
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type UiLang = 'en' | 'my'

const STORAGE_KEY = 'dethana_ui_lang'

const EN = {
  skipToContent: 'Skip to content',
  contents: 'Contents',
  library: 'Library',
  textSettings: 'Text settings',
  siteLanguage: 'Site language',
  english: 'English',
  burmese: 'Burmese',
  close: 'Close',
  scriptureTranslation: 'Scripture translation',
  searchTipitaka: 'Search the Tipiṭaka',
  searchTitles: 'Search titles and text…',
  noHeadings: 'No matching headings. Press Enter for full-text search.',
  searchAllText: 'Search all text for “{q}”',
  popularSearches: 'Popular searches',
  getStarted: 'Get Started',
  supportThisSite: 'Support This Site',
  supportBlurb: "Help with Dana for Dethana's hosting and expenses.",
  supportWithDana: 'Support with Dana',
  researchTranslations: 'Research translations',
  disclaimerBody: 'These are AI-assisted study translations, not a replacement for the original Pāli or an authoritative rendering.',
  continue: 'Continue',
  home: 'Home',
  about: 'About',
  translationPolicy: 'Translation Policy',
  dana: 'Dana',
  privacy: 'Privacy',
  booksCount: '{n} books',
  loading: 'Loading…',
  collectionNotFound: 'Collection not found',
  backToDethana: 'Back to Dethana',
  colNikayaTitle: 'The Five Collections',
  colNikayaDesc: 'Read the five Nikāyas of the Sutta Piṭaka — Dīgha, Majjhima, Saṃyutta, Aṅguttara, and Khuddaka — with Pāli and study translations.',
  colAbhiTitle: 'The Higher Teaching',
  colAbhiDesc: 'Explore the Abhidhamma Piṭaka, the Canon’s systematic analysis of mind, matter, and the path.',
  colVinayaTitle: 'The Discipline',
  colVinayaDesc: 'Browse the Vinaya Piṭaka: the monastic rules, procedures, and origin stories of the Sangha.',
  colExpTitle: 'The Expositions',
  colExpDesc: 'Open the Aṭṭhakathā, the classical expositions that explain the Tipiṭaka book by book.',
  search: 'Search',
  searchResults: 'Results for “{q}”',
  searchHint: 'Enter a query in the header search.',
  searchSummary: '{total} matching paragraphs in {books} books',
  matches: '{n} matches',
  pageNotFound: 'Page not found',
  changeTranslation: 'Want to change the translation?',
  goToTranslations: 'Go to translations',
  dismiss: 'Dismiss',
  bookmark: 'Bookmark',
  removeBookmark: 'Remove bookmark',
  paliScript: 'Pāli script',
  layout: 'Layout',
  stacked: 'Stacked',
  sideBySide: 'Side by side',
  fontSize: 'Font size ({n}px)',
  showPali: 'Pāli',
  showTranslation: 'Translation',
  reset: 'Reset',
  save: 'Save',
  bookMissing: 'This book is not in the static export yet.',
  scriptBurmese: 'Burmese (Myanmar)',
  scriptRoman: 'Roman',
  scriptSinhala: 'Sinhala',
  scriptDevanagari: 'Devanagari',
  scriptThai: 'Thai',
  aboutH1: 'Dethana.org',
  aboutP1: 'Dethana.org is an institution and a movement. It exists so the Buddha’s teaching can be carried farther — read, studied, and offered for the good of the many, in the spirit of Dhamma missionary work (dhammadūta).',
  aboutP2: 'The name comes from Pāli desanā: the teaching, the exposition of the Dhamma. Dethana is not a bookstore and not a social network. It is a place to meet the Tipiṭaka itself — the Vinaya, the Suttas, the Abhidhamma, and the commentaries that have preserved that teaching.',
  aboutMissionH: 'A missionary movement',
  aboutP3: 'From the beginning the Buddha sent his disciples out: go forth for the good of the many, for the happiness of the many; teach the Dhamma that is good in the beginning, good in the middle, and good in the end. Dethana.org takes that charge as its reason for being.',
  aboutP4: 'Mission here means making the Canon available — in Pāli and in a study translation — so anyone, anywhere, can open a sutta, a verse, a rule, or an exposition without a paywall, an account, or a priest standing in the way of the text. Spreading the Dhamma is not the same as selling a brand. The work is to put the words where people can find them, and to keep them free.',
  aboutInstH: 'The institution',
  aboutP5: 'Dethana.org Institution holds that work together: this library, the care of the texts, and the invitation to read. It is a home for a shared effort — translators, readers, supporters, and those who simply wish the Dhamma to remain in the world. The website is the public face of that effort; the movement is the people who use it and keep it alive.',
  aboutP6a: 'We read the Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka, following the VRI digital edition, with commentaries (Aṭṭhakathā) and sub-commentaries (Ṭīkā) close at hand. How English is produced, and what it is not, is set out in the ',
  aboutP6b: '.',
  aboutJoinH: 'How to take part',
  aboutP7a: 'Read. Share a sutta. Support the site with ',
  aboutP7b: ' if you wish the hosting to continue. Write to ',
  aboutP7c: ' if you want to help the movement grow.',
  policyH1: 'Translation Policy',
  policyP1: 'Dethana makes the Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka — with its commentaries (Aṭṭhakathā) and sub-commentaries (Ṭīkā) — easier to read. The Pāli follows the VRI digital edition.',
  policyP2: 'The English here is an AI-assisted study translation. It draws on existing translations (Bhikkhu Bodhi, Anandajoti, Sinhala, Thai, Myanmar nissaya, Vietnamese, and others), the commentary, and a glossary — then a human reviews the result. These are research translations, not a replacement for the original Pāli or an authoritative rendering.',
  policyHowH: 'How it is made',
  policyP3: 'Source translations are aligned to VRI paragraphs. For each sentence the model sees those sources, the linked commentary, and nearby context. A second pass checks the English against the Pāli. Corrections go back into the glossary and prompts.',
  policyNotH: 'What this is not',
  policyP4: 'This English is for study and access. It does not claim to be a scholarly edition, a sectarian recension, or a substitute for learning Pāli. When the Pāli and the English disagree, trust the Pāli.',
  aboutDethanaLink: 'About Dethana.org',
  danaTitle: 'Support This Site',
  danaLead: 'Dethana is offered freely. If you wish to help keep it online, dana toward hosting and related expenses is gratefully received.',
  danaExpenses: 'Current expenses',
  danaItem: 'Item',
  danaAmount: 'Amount',
  danaDomain: 'Domain (yearly)',
  danaHosting: 'Web hosting (monthly)',
  danaProtection: 'Web protection (monthly)',
  danaMonthly: '$1.17 monthly',
  danaTotal: 'Total monthly',
  danaHow: 'How to help',
  danaHowP: 'Write to {email} to offer dana for these costs. Thank you.',
  privacyTitle: 'Privacy policy',
  privacyLead: 'Dethana is offered so you can read the Tipiṭaka. You do not need an account. We do not sell personal data.',
  privacyAnalyticsH: 'Analytics',
  privacyAnalytics: 'Google Analytics loads only after you accept the cookie banner. You can clear site data in your browser to reset that choice.',
  privacyLocalH: 'Local storage',
  privacyLocal: 'Reading preferences (script, font size, bookmarks, disclaimer) stay in your browser. They are not sent to a server.',
  privacyContactH: 'Contact',
  privacyContact: 'Questions:',
}

const MY: typeof EN = {
  skipToContent: 'အကြောင်းအရာသို့ ကျော်ရန်',
  contents: 'မာတိကာ',
  library: 'စာကြည့်တိုက်',
  textSettings: 'စာလုံး ဆက်တင်',
  siteLanguage: 'ဆိုက်ဘာသာစကား',
  english: 'English',
  burmese: 'မြန်မာ',
  close: 'ပိတ်ရန်',
  scriptureTranslation: 'ကျမ်းစာ ဘာသာပြန်',
  searchTipitaka: 'Tipiṭaka ကို ရှာရန်',
  searchTitles: 'ခေါင်းစဉ်နှင့် စာသားကို ရှာရန်…',
  noHeadings: 'ကိုက်ညီသော ခေါင်းစဉ် မရှိပါ။ စာသားအပြည့် ရှာရန် Enter နှိပ်ပါ။',
  searchAllText: '“{q}” အတွက် စာသားအားလုံးကို ရှာရန်',
  popularSearches: 'လူကြိုက်များသော ရှာဖွေမှုများ',
  getStarted: 'စတင်ရန်',
  supportThisSite: 'ဤဆိုက်ကို ကူညီရန်',
  supportBlurb: 'Dethana ၏ hosting နှင့် ကုန်ကျစရိတ်အတွက် ဒါနဖြင့် ကူညီပါ။',
  supportWithDana: 'ဒါနဖြင့် ကူညီရန်',
  researchTranslations: 'လေ့လာရေး ဘာသာပြန်များ',
  disclaimerBody: 'ဤသည်မှာ AI အကူအညီဖြင့် လေ့လာရေး ဘာသာပြန်များ ဖြစ်ပြီး မူရင်း ပါဠိ သို့မဟုတ် တရားဝင် ပြန်ဆိုချက် အစားထိုး မဟုတ်ပါ။',
  continue: 'ရှေ့ဆက်ရန်',
  home: 'ပင်မ',
  about: 'အကြောင်း',
  translationPolicy: 'ဘာသာပြန် မူဝါဒ',
  dana: 'ဒါန',
  privacy: 'ကိုယ်ရေးလုံခြုံမှု',
  booksCount: 'ကျမ်း {n} အုပ်',
  loading: 'ဖွင့်နေသည်…',
  collectionNotFound: 'စုစည်းမှု မတွေ့ပါ',
  backToDethana: 'Dethana သို့ ပြန်ရန်',
  colNikayaTitle: 'နိကာယ် ငါးစု',
  colNikayaDesc: 'Sutta Piṭaka ၏ နိကာယ် ငါးခု — Dīgha, Majjhima, Saṃyutta, Aṅguttara, Khuddaka — ကို ပါဠိနှင့် လေ့လာရေး ဘာသာပြန်ဖြင့် ဖတ်ပါ။',
  colAbhiTitle: 'အဘိဓမ္မာ',
  colAbhiDesc: 'Abhidhamma Piṭaka ကို လေ့လာပါ — စိတ်၊ ရုပ်၊ မဂ်၏ စနစ်တကျ ခွဲခြမ်းစိတ်ဖြာချက်။',
  colVinayaTitle: 'ဝိနည်း',
  colVinayaDesc: 'Vinaya Piṭaka ကို ကြည့်ပါ — သံဃာ၏ စည်းကမ်း၊ လုပ်ထုံးနှင့် မူလဖြစ်ရပ်များ။',
  colExpTitle: 'အဋ္ဌကထာ',
  colExpDesc: 'Tipiṭaka ကို ကျမ်းအလိုက် ရှင်းပြသော Aṭṭhakathā ကို ဖွင့်ပါ။',
  search: 'ရှာဖွေရန်',
  searchResults: '“{q}” အတွက် ရလဒ်များ',
  searchHint: 'အပေါ်ဘားရှိ ရှာဖွေမှုတွင် စာရိုက်ပါ။',
  searchSummary: 'ကျမ်း {books} အုပ်တွင် စာပိုဒ် {total} ခု ကိုက်ညီသည်',
  matches: '{n} ခု ကိုက်ညီသည်',
  pageNotFound: 'စာမျက်နှာ မတွေ့ပါ',
  changeTranslation: 'ကျမ်းစာ ဘာသာပြန်ကို ပြောင်းလိုပါသလား။',
  goToTranslations: 'ဘာသာပြန်များသို့',
  dismiss: 'ပိတ်ရန်',
  bookmark: 'မှတ်သားရန်',
  removeBookmark: 'မှတ်သားမှု ဖြုတ်ရန်',
  paliScript: 'ပါဠိ အက္ခရာ',
  layout: 'ပုံစံ',
  stacked: 'အပေါ်အောက်',
  sideBySide: 'ဘေးချင်းယှဉ်',
  fontSize: 'စာလုံးအရွယ် ({n}px)',
  showPali: 'Pāli',
  showTranslation: 'ဘာသာပြန်',
  reset: 'ပြန်သတ်မှတ်',
  save: 'သိမ်းရန်',
  bookMissing: 'ဤကျမ်းကို စာရင်းတွင် မထည့်ရသေးပါ။',
  scriptBurmese: 'မြန်မာ',
  scriptRoman: 'Roman',
  scriptSinhala: 'သီဟိုဠ်',
  scriptDevanagari: 'Devanagari',
  scriptThai: 'ထိုင်း',
  aboutH1: 'Dethana.org',
  aboutP1: 'Dethana.org သည် အဖွဲ့အစည်းတစ်ခု ဖြစ်သလို လှုပ်ရှားမှုတစ်ခုလည်း ဖြစ်သည်။ ဗုဒ္ဓ၏ တရားတော်ကို ပိုမို ကျယ်ပြန့်စွာ ဖတ်ရှု၊ လေ့လာ၊ များစွာသော သူတို့၏ ကောင်းကျိုးအတွက် ကမ်းလှမ်းနိုင်ရန် — ဓမ္မသာသနာပြု (dhammadūta) စိတ်ဓာတ်ဖြင့် — တည်ရှိသည်။',
  aboutP2: 'အမည်သည် ပါဠိ desanā မှ ဆင်းသက်သည် — တရားဟောခြင်း၊ ဓမ္မကို ဖွင့်ဟခြင်း။ Dethana သည် စာအုပ်ဆိုင် မဟုတ်၊ လူမှုကွန်ရက် မဟုတ်။ Tipiṭaka ကိုယ်တိုင်နှင့် တွေ့ဆုံရာ နေရာ ဖြစ်သည် — Vinaya, Suttas, Abhidhamma နှင့် ထိုသာသနာကို ထိန်းသိမ်းလာသော အဋ္ဌကထာများ။',
  aboutMissionH: 'သာသနာပြု လှုပ်ရှားမှု',
  aboutP3: 'အစကပင် ဗုဒ္ဓသည် တပည့်များကို စေလွှတ်ခဲ့သည် — များစွာသော သူတို့၏ ကောင်းကျိုး၊ ချမ်းသာရန် ထွက်သွားကြကုန်လော့။ အစကောင်း၊ အလယ်ကောင်း၊ အဆုံးကောင်းသော ဓမ္မကို ဟောကြကုန်လော့။ Dethana.org သည် ထိုတာဝန်ကို အကြောင်းရင်းအဖြစ် ယူသည်။',
  aboutP4: 'ဤနေရာတွင် သာသနာဆိုသည်မှာ ပါဠိနှင့် လေ့လာရေး ဘာသာပြန်ဖြင့် ပိဋကတ်ကို ရရှိစေခြင်း ဖြစ်သည်။ မည်သူမဆို၊ မည်သည့်နေရာမှမဆို သုတ္တန်၊ ဂါထာ၊ သိက္ခာပုဒ် သို့မဟုတ် အဖွင့်ကို အကောင့်မလို၊ ငွေမပေးဘဲ ဖွင့်နိုင်သည်။ ဓမ္မကို ဖြန့်ဝေခြင်းသည် အမှတ်တံဆိပ် ရောင်းခြင်း မဟုတ်။ စကားလုံးများကို လူတို့ ရှာတွေ့နိုင်ရာတွင် ထားရှိပြီး အခမဲ့ ထားရှိခြင်းသာ ဖြစ်သည်။',
  aboutInstH: 'အဖွဲ့အစည်း',
  aboutP5: 'Dethana.org Institution သည် ဤအလုပ်ကို စုစည်းသည် — ဤစာကြည့်တိုက်၊ ကျမ်းစာ စောင့်ရှောက်မှု၊ ဖတ်ရှုရန် ဖိတ်ခေါ်မှု။ ဘာသာပြန်သူ၊ ဖတ်သူ၊ ကူညီသူ၊ ဓမ္မကမ္ဘာတွင် ကျန်ရှိစေလိုသူများ၏ ကြိုးပမ်းမှု အိမ် ဖြစ်သည်။ ဝက်ဘ်ဆိုက်သည် ထိုကြိုးပမ်းမှု၏ အများပြည်သူ မျက်နှာစာ ဖြစ်ပြီး၊ လှုပ်ရှားမှုမှာ ၎င်းကို သုံး၍ ထိန်းသိမ်းသူများ ဖြစ်သည်။',
  aboutP6a: 'Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka ကို VRI ဒစ်ဂျစ်တယ် ထုတ်ဝေမှုအတိုင်း ဖတ်သည်။ Aṭṭhakathā နှင့် Ṭīkā ကို အနီးကပ် ထားရှိသည်။ အင်္ဂလိပ် မည်သို့ ထုတ်လုပ်သည်၊ မည်သည် မဟုတ်ကြောင်းကို ',
  aboutP6b: ' တွင် ဖော်ပြထားသည်။',
  aboutJoinH: 'ပါဝင်ရန်',
  aboutP7a: 'ဖတ်ပါ။ သုတ္တန် မျှဝေပါ။ hosting ဆက်လက် ရရှိစေလိုလျှင် ',
  aboutP7b: ' ဖြင့် ကူညီပါ။ လှုပ်ရှားမှု ကြီးထွားစေလိုလျှင် ',
  aboutP7c: ' သို့ ရေးပါ။',
  policyH1: 'ဘာသာပြန် မူဝါဒ',
  policyP1: 'Dethana သည် Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka ကို — Aṭṭhakathā နှင့် Ṭīkā နှင့်အတူ — ပိုမို ဖတ်ရလွယ်အောင် ပြုသည်။ ပါဠိသည် VRI ဒစ်ဂျစ်တယ် ထုတ်ဝေမှုကို လိုက်သည်။',
  policyP2: 'ဤအင်္ဂလိပ်သည် AI အကူအညီဖြင့် လေ့လာရေး ဘာသာပြန် ဖြစ်သည်။ ရှိပြီးသား ပြန်ဆိုချက်များ (Bhikkhu Bodhi, Anandajoti, သီဟိုဠ်၊ ထိုင်း၊ မြန်မာ နိဿယ၊ ဗီယက်နမ် စသည်)၊ အဋ္ဌကထာနှင့် ဝေါဟာရစာရင်းကို အသုံးပြုပြီး လူက ပြန်လည် စစ်သည်။ လေ့လာရေး ပြန်ဆိုချက်များ ဖြစ်ပြီး မူရင်း ပါဠိ သို့မဟုတ် တရားဝင် ပြန်ဆိုချက် အစားထိုး မဟုတ်။',
  policyHowH: 'မည်သို့ ပြုလုပ်သည်',
  policyP3: 'ရင်းမြစ် ဘာသာပြန်များကို VRI ပိုဒ်များနှင့် ညှိသည်။ စာကြောင်းတစ်ခုစီတွင် မော်ဒယ်သည် ထိုရင်းမြစ်များ၊ ဆက်စပ် အဋ္ဌကထာ၊ အနီးအနား အကြောင်းအရာကို မြင်သည်။ ဒုတိယအဆင့်တွင် အင်္ဂလိပ်ကို ပါဠိနှင့် စစ်သည်။ ပြင်ဆင်ချက်များကို ဝေါဟာရနှင့် prompt များသို့ ပြန်ထည့်သည်။',
  policyNotH: 'ဤသည် မဟုတ်သည့်အရာ',
  policyP4: 'ဤအင်္ဂလိပ်သည် လေ့လာရန်နှင့် ရရှိရန် ဖြစ်သည်။ ပညာရပ်ဆိုင်ရာ ထုတ်ဝေမှု၊ ဂိုဏ်းဂဏ တစ်ခု၏ စာ၊ သို့မဟုတ် ပါဠိ သင်ယူခြင်း အစားထိုးဟု မဆို။ ပါဠိနှင့် အင်္ဂလိပ် မတူလျှင် ပါဠိကို ယုံကြည်ပါ။',
  aboutDethanaLink: 'Dethana.org အကြောင်း',
  danaTitle: 'ဤဆိုက်ကို ကူညီရန်',
  danaLead: 'Dethana ကို အခမဲ့ ကမ်းလှမ်းသည်။ အွန်လိုင်း ဆက်ရှိစေရန် hosting နှင့် ကုန်ကျစရိတ်အတွက် ဒါနကို ကျေးဇူးတင်စွာ လက်ခံသည်။',
  danaExpenses: 'လက်ရှိ ကုန်ကျစရိတ်',
  danaItem: 'အကြောင်းအရာ',
  danaAmount: 'ပမာဏ',
  danaDomain: 'ဒိုမိန်း (နှစ်စဉ်)',
  danaHosting: 'ဝက်ဘ် hosting (လစဉ်)',
  danaProtection: 'ဝက်ဘ် ကာကွယ်မှု (လစဉ်)',
  danaMonthly: 'လစဉ် $1.17',
  danaTotal: 'လစဉ် စုစုပေါင်း',
  danaHow: 'ကူညီနည်း',
  danaHowP: 'ဤကုန်ကျစရိတ်အတွက် ဒါန ပေးလိုလျှင် {email} သို့ ရေးပါ။ ကျေးဇူးတင်ပါသည်။',
  privacyTitle: 'ကိုယ်ရေးလုံခြုံမှု မူဝါဒ',
  privacyLead: 'Dethana ကို Tipiṭaka ဖတ်ရန် ကမ်းလှမ်းသည်။ အကောင့် မလိုပါ။ ကိုယ်ရေး အချက်အလက် မရောင်းပါ။',
  privacyAnalyticsH: 'ခွဲခြမ်းစိတ်ဖြာမှု',
  privacyAnalytics: 'cookie နဖူးစည်းကို လက်ခံပြီးမှသာ Google Analytics ကို ဖွင့်သည်။ ထိုရွေးချယ်မှုကို ပြန်လည်သတ်မှတ်ရန် ဘရောက်ဇာတွင် ဆိုက်ဒေတာ ရှင်းနိုင်သည်။',
  privacyLocalH: 'စက်တွင်း သိုလှောင်မှု',
  privacyLocal: 'ဖတ်ရှု ကြိုက်နှစ်သက်မှုများ (အက္ခရာ၊ စာလုံးအရွယ်၊ မှတ်သားမှု၊ သတိပေးချက်) သည် သင့်ဘရောက်ဇာတွင်သာ ရှိသည်။ ဆာဗာသို့ မပို့ပါ။',
  privacyContactH: 'ဆက်သွယ်ရန်',
  privacyContact: 'မေးခွန်းများ:',
}

export const UI_STRINGS = { en: EN, my: MY }

export function interpolate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

export function readUiLang(): UiLang {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'my' || value === 'en') return value
  } catch { /* ignore */ }
  return 'en'
}

type Ctx = {
  uiLang: UiLang
  setUiLang: (lang: UiLang) => void
  t: typeof EN
}

const UiLangContext = createContext<Ctx>({
  uiLang: 'en',
  setUiLang: () => {},
  t: EN,
})

export function UiLangProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLangState] = useState<UiLang>(readUiLang)

  useEffect(() => {
    document.documentElement.lang = uiLang === 'my' ? 'my' : 'en'
    document.documentElement.setAttribute('data-ui-lang', uiLang)
  }, [uiLang])

  const value = useMemo<Ctx>(() => ({
    uiLang,
    setUiLang(next) {
      try { localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
      setUiLangState(next)
    },
    t: UI_STRINGS[uiLang],
  }), [uiLang])

  return <UiLangContext.Provider value={value}>{children}</UiLangContext.Provider>
}

export function useUi() {
  return useContext(UiLangContext)
}

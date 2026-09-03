export type LangInfo = {
  code: string
  english_name: string
  native_name: string
}

export type MenuLeaf = [string, string, number]

export type MenuTree = Record<string, Record<string, Record<string, MenuLeaf[]>>>

export type HierarchyMap = Record<string, {
  nikaya?: string
  category?: string
  book_name?: string
}>

export type MenuResponse = {
  menu: MenuTree
  hierarchy: HierarchyMap
}

export type TocItem = {
  para_id: number
  level: number
  title: string
  has_content: boolean
  slug?: string
}

export type BookRef = {
  book_id: string
  book_name?: string
}

export type Sentence = {
  para_id: number
  line_id: number
  pali?: string
  translation?: string
  vripage?: string
  ptspage?: string
  mypage?: string
  thaipage?: string
}

export type SectionData = {
  heading_translation?: string
  sentences?: Sentence[]
  has_content?: boolean
}

export type BookFile = {
  book_id: string
  book_name: string
  toc: TocItem[]
  bookref: {
    mula_ref: BookRef[]
    attha_ref: BookRef[]
    tika_ref: BookRef[]
  }
  sections?: Record<string, SectionData>
}

export type HeadingHit = {
  book_id: string
  book_name: string
  para_id: number
  title: string
  slug: string
  pali?: string
  translation?: string
}

export type BookConfig = {
  bookId: string
  baseUrl: string
  lang: string
  paraId: number | null
  lineId: number | null
  bookTitle?: string
  outlineUrl?: string
  availableLangs?: LangInfo[]
  toc?: TocItem[]
  bookref: {
    mula_ref: BookRef[]
    attha_ref: BookRef[]
    tika_ref: BookRef[]
  }
}

export type IndexConfig = {
  baseUrl: string
  lang: string
  availableLangs: LangInfo[]
}

export type PageConfig = {
  page: 'about' | 'translation-policy' | 'privacy' | '404' | 'outline' | 'search' | 'collection' | 'dana'
  baseUrl: string
  lang: string
  availableLangs: LangInfo[]
  query?: string
  collection?: string
}

export type BookEntry = {
  id: string
  name: string
  category: string
  nikaya: string
  subNikaya: string
  sort: number
}

export type AppRoute =
  | { name: 'home'; lang: string }
  | { name: 'book'; lang: string; bookId: string; slug?: string; paraId: number | null }
  | { name: 'search'; lang: string; query: string }
  | { name: 'collection'; lang: string; collection: string }
  | { name: 'about' }
  | { name: 'translation-policy' }
  | { name: 'privacy' }
  | { name: 'dana' }
  | { name: 'blog' }
  | { name: 'blog-post'; slug: string }
  | { name: 'notfound' }

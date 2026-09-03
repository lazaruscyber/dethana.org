import { useEffect, useState } from 'react'
import { Shell } from './ui/Shell'
import { Home } from './pages/Home'
import { Reader } from './pages/Reader'
import { SearchPage } from './pages/SearchPage'
import { CollectionPage } from './pages/CollectionPage'
import { DanaPage } from './pages/DanaPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { fetchLangs } from './api/menu'
import { BASE_URL, DEFAULT_LANG, parseRoute } from './routes'
import { initCookieConsent } from './cookie-consent.js'
import type { LangInfo } from './types'
import './ui/tokens.css'
import './ui/content.css'

export function App() {
  const [langs, setLangs] = useState<LangInfo[]>([])
  const route = parseRoute()

  useEffect(() => {
    initCookieConsent({ gaId: 'G-7NQWX1DCC2' })
    fetchLangs().then(setLangs).catch(() => setLangs([{
      code: DEFAULT_LANG, english_name: 'English', native_name: 'English',
    }]))
  }, [])

  const lang = 'lang' in route ? route.lang : DEFAULT_LANG
  const available = langs.length ? langs : [{
    code: DEFAULT_LANG, english_name: 'English', native_name: 'English',
  }]

  if (route.name === 'book') {
    return (
      <Reader
        lang={route.lang}
        bookId={route.bookId}
        paraId={route.paraId}
        langs={available}
      />
    )
  }

  if (route.name === 'home') {
    return (
      <Shell baseUrl={BASE_URL} lang={route.lang} langs={available} fullBleed showSearch={false}>
        <Home config={{ baseUrl: BASE_URL, lang: route.lang, availableLangs: available }} />
      </Shell>
    )
  }

  if (route.name === 'search') {
    return (
      <Shell baseUrl={BASE_URL} lang={route.lang} langs={available}>
        <SearchPage config={{
          page: 'search',
          baseUrl: BASE_URL,
          lang: route.lang,
          availableLangs: available,
          query: route.query,
        }} />
      </Shell>
    )
  }

  if (route.name === 'collection') {
    return (
      <Shell baseUrl={BASE_URL} lang={route.lang} langs={available} fullBleed>
        <CollectionPage config={{
          page: 'collection',
          baseUrl: BASE_URL,
          lang: route.lang,
          availableLangs: available,
          collection: route.collection,
        }} />
      </Shell>
    )
  }

  if (route.name === 'dana') {
    return (
      <Shell baseUrl={BASE_URL} lang={lang} langs={available}>
        <DanaPage config={{
          page: 'dana',
          baseUrl: BASE_URL,
          lang,
          availableLangs: available,
        }} />
      </Shell>
    )
  }

  if (route.name === 'privacy') {
    return (
      <Shell baseUrl={BASE_URL} lang={lang} langs={available}>
        <PrivacyPage />
      </Shell>
    )
  }

  if (route.name === 'about') {
    return (
      <Shell baseUrl={BASE_URL} lang={lang} langs={available}>
        <AboutPage />
      </Shell>
    )
  }

  return (
    <Shell baseUrl={BASE_URL} lang={DEFAULT_LANG} langs={available}>
      <div>
        <h1>Page not found</h1>
        <p><a href={`${BASE_URL}/${DEFAULT_LANG}/`}>Back to Dethana</a></p>
      </div>
    </Shell>
  )
}

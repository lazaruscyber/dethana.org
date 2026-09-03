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
import { collectionById } from './api/collections'
import { BASE_URL, DEFAULT_LANG, parseRoute } from './routes'
import { applySeo, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from './seo'
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

  useEffect(() => {
    const path = window.location.pathname
    if (route.name === 'book') return
    if (route.name === 'home') {
      applySeo({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, path: path === '/' ? '/' : path })
      return
    }
    if (route.name === 'collection') {
      const meta = collectionById(route.collection)
      applySeo({
        title: meta ? `${meta.title} (${meta.note}) | Dethana.org` : 'Collection | Dethana.org',
        description: meta?.description || DEFAULT_DESCRIPTION,
        path,
      })
      return
    }
    if (route.name === 'search') {
      applySeo({
        title: route.query ? `Search “${route.query}” | Dethana.org` : 'Search | Dethana.org',
        description: 'Search the Chaṭṭha Saṅgāyana Tipiṭaka on Dethana.org.',
        path,
        noindex: true,
      })
      return
    }
    if (route.name === 'about') {
      applySeo({
        title: 'About | Dethana.org',
        description: 'How Dethana presents the Chaṭṭha Saṅgāyana Tipiṭaka, commentaries, and AI-assisted study translations.',
        path,
      })
      return
    }
    if (route.name === 'dana') {
      applySeo({
        title: 'Dana | Dethana.org',
        description: 'Support Dethana.org hosting so the Tipiṭaka remains freely readable.',
        path,
      })
      return
    }
    if (route.name === 'privacy') {
      applySeo({
        title: 'Privacy | Dethana.org',
        description: 'Privacy policy for Dethana.org.',
        path,
      })
      return
    }
    applySeo({
      title: 'Page not found | Dethana.org',
      description: DEFAULT_DESCRIPTION,
      path,
      noindex: true,
    })
  }, [route.name, 'collection' in route ? route.collection : '', 'query' in route ? route.query : ''])

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

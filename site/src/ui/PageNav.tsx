import { useUi } from '../i18n'
import styles from './PageNav.module.css'

type Props = {
  lang: string
  baseUrl: string
}

function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

export function PageNav({ lang, baseUrl }: Props) {
  const { t } = useUi()
  const path = currentPath()
  const browseHref = `${baseUrl}/browse`
  const langBrowse = `${baseUrl}/${lang}`

  const links = [
    { href: '/', label: t.home, active: path === '/' },
    {
      href: browseHref,
      label: t.browse,
      active: path === '/browse' || path === langBrowse || path.startsWith(`${langBrowse}/`),
    },
    { href: `${baseUrl}/social-media`, label: t.socialMedia, active: path === '/social-media' },
    { href: `${baseUrl}/charity`, label: t.charity, active: path === '/charity' },
  ]

  return (
    <nav className={styles.nav} aria-label={t.sitePages}>
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          className={styles.link}
          data-on={String(link.active)}
          aria-current={link.active ? 'page' : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}

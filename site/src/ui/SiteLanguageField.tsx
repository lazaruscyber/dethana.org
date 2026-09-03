import { useUi, type UiLang } from '../i18n'
import styles from './Shell.module.css'

export function SiteLanguageField() {
  const { uiLang, setUiLang, t } = useUi()
  const options: Array<{ id: UiLang; label: string }> = [
    { id: 'en', label: t.english },
    { id: 'my', label: t.burmese },
  ]
  return (
    <div className={styles.field}>
      {t.siteLanguage}
      <div className={styles.langs}>
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={styles.langBtn}
            data-on={String(uiLang === opt.id)}
            onClick={() => setUiLang(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

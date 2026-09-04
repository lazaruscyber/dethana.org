import { UI_LANGS, useUi } from '../i18n'
import styles from './Shell.module.css'

export function SiteLanguageField() {
  const { uiLang, setUiLang, t } = useUi()
  return (
    <div className={styles.field}>
      {t.siteLanguage}
      <div className={styles.langs}>
        {UI_LANGS.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={styles.langBtn}
            data-on={String(uiLang === opt.id)}
            onClick={() => setUiLang(opt.id)}
          >
            {opt.native}
          </button>
        ))}
      </div>
    </div>
  )
}

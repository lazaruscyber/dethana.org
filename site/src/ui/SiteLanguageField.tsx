import { motion } from 'framer-motion'
import { UI_LANGS, useUi } from '../i18n'
import { springSnappy } from './motion'
import styles from './Shell.module.css'

export function SiteLanguageField() {
  const { uiLang, setUiLang, t } = useUi()
  return (
    <div className={styles.field}>
      {t.siteLanguage}
      <div className={styles.langs}>
        {UI_LANGS.map(opt => (
          <motion.button
            key={opt.id}
            type="button"
            className={styles.langBtn}
            data-on={String(uiLang === opt.id)}
            onClick={() => setUiLang(opt.id)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={springSnappy}
          >
            {opt.native}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

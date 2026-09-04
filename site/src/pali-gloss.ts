import { TextProcessor, Script } from './pali-script.js'
import gloss from './data/pali-gloss.json'

const GLOSS = gloss as Record<string, string>

const SUFFIXES = [
  'ānaṃ', 'ānam', 'ebhi', 'ehi', 'esu', 'āni', 'āyo', 'āya', 'āhi',
  'assa', 'amhā', 'amhi', 'asmiṃ', 'asmiṁ', 'smiṃ', 'smiṁ', 'smā',
  'ino', 'iyo', 'iyā', 'uno', 'uyā', 'ūhi', 'īhi', 'īsu', 'ūsu',
  'ena', 'ehi', 'naṃ', 'nam', 'ssa', 'hi', 'su',
  'aṃ', 'am', 'iṃ', 'im', 'uṃ', 'um', 'o', 'ā', 'e', 'ī', 'ū',
]

export function romanizePaliWord(word: string) {
  const sinh = TextProcessor.convertFromMixed(word)
  const roman = TextProcessor.convert(sinh, Script.RO)
  return normalizeGlossKey(roman)
}

export function normalizeGlossKey(word: string) {
  return word
    .normalize('NFC')
    .replace(/[“”‘’"'`]/g, '')
    .replace(/ṁ/g, 'ṃ')
    .replace(/Ṁ/g, 'ṃ')
    .toLowerCase()
    .trim()
}

function stems(key: string) {
  const out = [key]
  for (const suffix of SUFFIXES) {
    if (key.length - suffix.length < 2) continue
    if (key.endsWith(suffix)) out.push(key.slice(0, -suffix.length))
  }
  if (key.endsWith('ṃ') && key.length > 3) out.push(key.slice(0, -1))
  return out
}

export function lookupGlossKey(roman: string) {
  const key = normalizeGlossKey(roman)
  for (const form of stems(key)) {
    const meaning = GLOSS[form]
    if (meaning) return { key: form, meaning }
  }
  return { key, meaning: '' }
}

export function lookupGloss(word: string) {
  return lookupGlossKey(romanizePaliWord(word))
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function bindPaliTooltips(root: ParentNode, missingLabel: string) {
  const tip = document.createElement('div')
  tip.className = 'pali-tip'
  tip.hidden = true
  tip.setAttribute('role', 'tooltip')
  document.body.appendChild(tip)

  function hide() {
    tip.hidden = true
  }

  function show(wordEl: HTMLElement) {
    const roman = wordEl.getAttribute('data-ro') || ''
    const hit = lookupGlossKey(roman || wordEl.textContent || '')
    tip.innerHTML = `<p class="pali-tip-word">${escapeHtml(hit.key)}</p><p class="pali-tip-mean">${escapeHtml(hit.meaning || missingLabel)}</p>`
    tip.hidden = false
    const box = wordEl.getBoundingClientRect()
    const width = tip.offsetWidth
    const height = tip.offsetHeight
    let left = box.left
    let top = box.bottom + 8
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8
    if (top + height > window.innerHeight - 8) top = box.top - height - 8
    tip.style.left = `${Math.max(8, left)}px`
    tip.style.top = `${Math.max(8, top)}px`
  }

  function fromEvent(e: Event) {
    const el = (e.target as HTMLElement | null)?.closest?.('.pali-word') as HTMLElement | null
    return el && root.contains(el) ? el : null
  }

  const onOver = (e: Event) => {
    const el = fromEvent(e)
    if (el) show(el)
  }
  const onOut = (e: PointerEvent) => {
    const next = e.relatedTarget as Node | null
    if (tip.contains(next)) return
    const el = fromEvent(e)
    if (el && !el.contains(next)) hide()
  }
  const onClick = (e: Event) => {
    const el = fromEvent(e)
    if (el) {
      show(el)
      return
    }
    if (!tip.contains(e.target as Node)) hide()
  }

  root.addEventListener('pointerover', onOver)
  root.addEventListener('pointerout', onOut as EventListener)
  document.addEventListener('click', onClick)
  window.addEventListener('scroll', hide, true)

  return () => {
    root.removeEventListener('pointerover', onOver)
    root.removeEventListener('pointerout', onOut as EventListener)
    document.removeEventListener('click', onClick)
    window.removeEventListener('scroll', hide, true)
    tip.remove()
  }
}

export function wrapPaliWords(html: string) {
  return html.replace(/(<[^>]+>)|([^<]+)/g, (_m, tag: string, text: string) => {
    if (tag) return tag
    if (!text) return ''
    return text.replace(/[\p{L}\p{M}]+/gu, word => {
      if (word.length < 1) return word
      const roman = romanizePaliWord(word)
      if (!roman) return word
      return `<span class="pali-word" tabindex="0" data-ro="${escapeHtml(roman)}">${word}</span>`
    })
  })
}

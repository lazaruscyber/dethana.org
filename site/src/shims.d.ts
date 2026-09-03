/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*cookie-consent.js' {
  export function initCookieConsent(options?: { gaId?: string }): void
}

declare module '*settings.js' {
  export function loadSettings(lang?: string): Record<string, any>
  export function saveSettings(settings: Record<string, any>): void
  export function applySettings(settings: Record<string, any>): void
  export function defaultSettings(): Record<string, any>
}

declare module '*pali-script.js' {
  export const TextProcessor: {
    convert: (text: string, script: string) => string
    convertFromMixed: (text: string) => string
  }
  export const Script: {
    RO: string
    MY: string
    SI: string
    HI: string
    THAI: string
    LAOS: string
    KM: string
  }
}

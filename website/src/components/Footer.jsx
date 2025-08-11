import React from 'react'
import { ClockIcon } from '@heroicons/react/24/solid'
import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.open(href, '_blank')
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="relative">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ClockIcon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Stage Timer
                </span>
                <span className="ml-1 text-xs sm:text-sm font-semibold text-accent-400">
                  PRO
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => scrollToSection('https://github.com/yourusername/stage-timer-tauri')}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button 
                onClick={() => scrollToSection('https://twitter.com/stagetimerpro')}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(t('footer.links')).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.items.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              {t('footer.copyright')}
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 flex-wrap justify-center">
              {t('footer.bottomLinks').map((link) => (
                <button 
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

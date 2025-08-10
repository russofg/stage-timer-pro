import React, { useState, useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ClockIcon } from '@heroicons/react/24/solid'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../hooks/useTranslation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navigation = [
    { name: t('navbar.features'), href: '#features' },
    { name: t('navbar.videoDemo'), href: '#demo' },
    { name: t('navbar.pricing'), href: '#pricing' },
    { name: t('navbar.documentation'), href: '#documentacion' },
  ]

  return (
    <Disclosure as="nav" className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      {({ open }) => (
        <>
          <div className="container-custom">
            <div className="relative flex h-16 items-center justify-between">
              {/* Logo - Mobile First */}
              <div className="flex flex-shrink-0 items-center">
                <div className="relative">
                  <div className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-700' 
                      : 'bg-white/95 backdrop-blur-sm'
                  }`}>
                    <ClockIcon className={`h-3 w-3 sm:h-5 sm:w-5 transition-colors duration-300 ${
                      isScrolled ? 'text-white' : 'text-primary-600'
                    }`} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <span className={`text-lg sm:text-xl font-bold transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent' 
                      : 'text-white drop-shadow-lg'
                  }`}>
                    Stage Timer
                  </span>
                  <span className={`ml-1 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent'
                      : 'text-accent-400 drop-shadow-lg'
                  }`}>
                    PRO
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        isScrolled
                          ? 'text-gray-900 hover:text-primary-600'
                          : 'text-white hover:text-accent-400 drop-shadow-md'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Toggle & Download Button - Desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 border ${
                    isScrolled
                      ? 'text-gray-900 hover:text-primary-600 border-gray-200 hover:border-primary-300 bg-white'
                      : 'text-white hover:text-accent-400 border-white/30 hover:border-white/60 bg-white/10 backdrop-blur-sm drop-shadow-md'
                  }`}
                  aria-label="Toggle language"
                >
                  <span className="text-base">🌐</span>
                  <span className="uppercase font-semibold">{language === 'es' ? 'ES' : 'EN'}</span>
                </button>
                
                <button
                  onClick={() => scrollToSection('#download')}
                  className={`btn-primary text-sm px-4 py-2 transition-all duration-300 ${
                    isScrolled 
                      ? '' 
                      : 'shadow-lg shadow-primary-900/25'
                  }`}
                >
                  {t('navbar.downloadFree')}
                </button>
              </div>

              {/* Mobile menu button & language toggle */}
              <div className="flex items-center space-x-2 lg:hidden">
                <button
                  onClick={toggleLanguage}
                  className={`inline-flex items-center justify-center rounded-md p-2 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                    isScrolled
                      ? 'text-gray-900 hover:bg-gray-100 hover:text-primary-600 border-gray-200 bg-white'
                      : 'text-white hover:bg-white/10 hover:text-accent-400 border-white/30 bg-white/10 backdrop-blur-sm drop-shadow-md'
                  }`}
                  aria-label="Toggle language"
                >
                  <span className="text-sm">🌐 {language === 'es' ? 'ES' : 'EN'}</span>
                </button>
                
                <Disclosure.Button className={`inline-flex items-center justify-center rounded-md p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                  isScrolled
                    ? 'text-gray-900 hover:bg-gray-100 hover:text-primary-600'
                    : 'text-white hover:bg-white/10 hover:text-accent-400 drop-shadow-md'
                }`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="lg:hidden">
            <div className="bg-white border-t border-gray-200 px-4 pt-2 pb-3 space-y-1 sm:px-6">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="button"
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => scrollToSection('#download')}
                  className="btn-primary w-full text-center"
                >
                  {t('navbar.downloadFree')}
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

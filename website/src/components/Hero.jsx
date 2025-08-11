import React from 'react'
import { PlayIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

export default function Hero() {
  const { t } = useTranslation()

  const scrollToDemo = () => {
    document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToDownload = () => {
    document.querySelector('#download')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-white/10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 lg:mt-40 container-custom text-center text-white px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Mobile-first heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
            {t('hero.title')}
            <span className="block text-accent-400 mt-1 sm:mt-2">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-primary-100 leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Mobile-first CTA buttons */}
          <motion.div
            className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center items-center mb-8 sm:mb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={scrollToDownload}
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-sm sm:text-base lg:text-lg transition-all duration-200 transform hover:scale-105 shadow-xl w-full sm:w-auto max-w-xs"
            >
              {t('hero.downloadFree')}
            </button>
            
            <button
              onClick={scrollToDemo}
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-sm sm:text-base lg:text-lg transition-all duration-200 w-full sm:w-auto max-w-xs"
            >
              <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('hero.watchDemo')}
            </button>
          </motion.div>

          {/* Mobile-first stats grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-400 mb-1 sm:mb-2">200+</div>
              <div className="text-sm sm:text-base text-primary-200">{t('hero.stats.activeUsers')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-400 mb-1 sm:mb-2">30+</div>
              <div className="text-sm sm:text-base text-primary-200">{t('hero.stats.enterprises')}</div>
            </div>
            <div className="text-center sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-accent-400 mb-1 sm:mb-2">99.9%</div>
              <div className="text-sm sm:text-base text-primary-200">{t('hero.stats.uptime')}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - Now positioned below stats with proper spacing */}
        <motion.div
          className="justify-center items-center hidden sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="animate-bounce">
            <ArrowDownIcon className="w-10 h-10 sm:w-10 sm:h-10 lg:mt-8  text-white opacity-80" />
          </div>
        </motion.div>
      </div>

      {/* Floating Elements - Responsive */}
      <motion.div
        className="absolute top-1/4 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-white/10 rounded-full"
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-4 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 bg-accent-400/20 rounded-full"
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-white/15 rounded-full hidden sm:block"
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </section>
  )
}

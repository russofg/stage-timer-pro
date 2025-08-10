import React, { useState } from 'react'
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

export default function VideoDemo() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <section id="demo" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('videoDemo.title')}
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('videoDemo.subtitle')}
          </motion.p>
        </div>

        {/* Video Thumbnail */}
        <motion.div 
          className="relative max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative video-container bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group">
            {/* Placeholder Image */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center py-16 sm:py-20 md:py-24"
              onClick={() => setIsVideoOpen(true)}
            >
              <div className="text-center text-white px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{t('videoDemo.watchDemo')}</h3>
                <p className="text-sm sm:text-base text-primary-100">{t('videoDemo.duration')}</p>
              </div>
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
          </div>
          
          {/* Decorative Elements - Hidden on mobile */}
          <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-primary-200 rounded-full opacity-20 animate-pulse hidden sm:block"></div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-32 sm:h-32 bg-accent-200 rounded-full opacity-20 animate-float hidden sm:block"></div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 md:mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t('videoDemo.features').map((feature, index) => (
            <div key={index} className="text-center p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-2xl">
                  {index === 0 ? '⏱️' : index === 1 ? '⌨️' : '📺'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-xs sm:max-w-2xl md:max-w-4xl">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <div className="video-container bg-black rounded-lg overflow-hidden">
                {/* Demo Coming Soon Content */}
                <div className="absolute inset-0 flex items-center justify-center text-white p-6 sm:p-8">
                  <div className="text-center max-w-md">
                    <PlayIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 opacity-50" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">{t('videoDemo.modal.title')}</h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                      {t('videoDemo.modal.subtitle')}
                    </p>
                    <div className="text-left">
                      <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                        {t('videoDemo.modal.features').map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-accent-400 rounded-full mr-3 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

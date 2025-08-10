import React from 'react'
import { 
  ClockIcon, 
  ComputerDesktopIcon, 
  BellIcon, 
  KeyIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

export default function Features() {
  const { t } = useTranslation()
  
  const features = t('features.list')
  const benefits = t('features.benefits')

  const iconMap = [
    ClockIcon,
    ComputerDesktopIcon,
    BellIcon,
    KeyIcon,
    VideoCameraIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    LightBulbIcon
  ]

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-6">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('features.title')}
            <span className="text-gradient"> {t('features.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        {/* Mobile-first features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[index]
            return (
              <motion.div
                key={feature.name}
                className="bg-white rounded-xl p-4 sm:p-6 card-shadow hover:shadow-2xl transition-all duration-300 feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Key Benefits Section - Mobile optimized */}
        <motion.div 
          className="mt-12 sm:mt-16 lg:mt-20 bg-white rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 card-shadow mx-4 sm:mx-6 lg:mx-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                {benefits.title}
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {benefits.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 sm:p-8 text-white">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-primary-100 mb-4 sm:mb-6 text-sm sm:text-base">{benefits.successRate}</div>
                  <p className="text-primary-100 leading-relaxed text-sm sm:text-base">
                    {benefits.successDescription}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-accent-400/20 rounded-full animate-pulse"></div>
              <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary-400/20 rounded-full animate-float"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

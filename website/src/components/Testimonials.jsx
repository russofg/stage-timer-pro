import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

export default function Testimonials() {
  const { t } = useTranslation()

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('testimonials.title')}
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {t('testimonials.stats').map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {t('testimonials.list').map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              className="testimonial-card rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center text-lg sm:text-2xl">
                  {index === 0 ? '👩‍💻' : index === 1 ? '🎮' : index === 2 ? '🎯' : index === 3 ? '📚' : index === 4 ? '📹' : '🎭'}
                </div>
                <div>
                  <div className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-primary-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-8 sm:mt-12 md:mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {t('testimonials.cta.title')}
            </h3>
            <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto">
              {t('testimonials.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base transition-all duration-200 transform hover:scale-105">
                {t('testimonials.cta.downloadFree')}
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base transition-all duration-200">
                {t('testimonials.cta.joinCommunity')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

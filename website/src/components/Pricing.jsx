import React from 'react'
import { CheckIcon, HeartIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

export default function Pricing() {
  const { t } = useTranslation()

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        {/* Mission Statement */}
        <motion.div 
          className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 md:mb-16 shadow-lg max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('pricing.mission.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
              {t('pricing.mission.description')}
            </p>
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
              <p className="text-sm sm:text-base text-blue-800 font-medium italic">
                {t('pricing.mission.author')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 md:mb-16 px-4">
          <motion.div
            className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              💝 Filosofía Open Source
            </h4>
            <p className="text-sm sm:text-base text-gray-600">
              Creemos que las herramientas esenciales para profesionales deben ser accesibles para todos, independientemente del presupuesto.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              🤝 Comunidad Primero
            </h4>
            <p className="text-sm sm:text-base text-gray-600">
              Tu experiencia y feedback son más valiosos que cualquier pago. Juntos mejoramos la herramienta para todos.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RocketLaunchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              🚀 Innovación Colaborativa
            </h4>
            <p className="text-sm sm:text-base text-gray-600">
              Al liberar Stage Timer Pro, fomentamos la innovación y el intercambio de conocimiento en nuestra industria.
            </p>
          </motion.div>
        </div>

        {/* Complete Features */}
        <motion.div 
          className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 md:mb-16 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('pricing.features.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              {t('pricing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Temporización profesional con precisión de milisegundos</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Atajos globales para control desde cualquier aplicación</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Soporte completo multi-monitor</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Integración con Resolume Arena y OBS</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Alertas visuales y de audio personalizables</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Análisis de sesión para mejorar tus presentaciones</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Actualizaciones constantes y nuevas características</span>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">✅ Soporte de la comunidad en GitHub</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Community CTA */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 sm:p-8 md:p-10 text-white">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              {t('pricing.community.title')}
            </h3>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">
              {t('pricing.community.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                {t('pricing.community.cta')}
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                {t('pricing.community.githubCall')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Personal Testimonial */}
        <motion.div 
          className="bg-gray-900 rounded-2xl p-6 sm:p-8 md:p-10 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-lg sm:text-xl italic mb-6">
              {t('pricing.testimonial.quote')}
            </blockquote>
            <div className="border-t border-gray-700 pt-6">
              <p className="font-bold text-lg">{t('pricing.testimonial.author')}</p>
              <p className="text-gray-400">{t('pricing.testimonial.role')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

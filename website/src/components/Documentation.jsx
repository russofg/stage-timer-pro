import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function Documentation() {
  const { t } = useTranslation();
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section id="documentacion" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('documentation.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('documentation.subtitle')}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-5xl mx-auto">
          {t('documentation.faqs').map((faq, index) => (
            <motion.div
              key={index}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-2xl"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">{faq.icon}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openItem === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-gray-400 group-hover:text-blue-500 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openItem === index ? "auto" : 0,
                    opacity: openItem === index ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 pt-4 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-none">
                      <div className="text-gray-700 leading-relaxed">
                        {/* Detectar si es el FAQ de instalación con macOS y Windows */}
                        {faq.answer.includes('Para macOS:') && faq.answer.includes('Para Windows:') ? (
                          <div className="space-y-8">
                            {/* Sección macOS */}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-2xl">🍎</span>
                                Para macOS:
                              </h4>
                              <div className="space-y-4">
                                {faq.answer.split('Para Windows:')[0].split('Para macOS:')[1].split(/\d\)/).slice(1).map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-gray-700 pt-2 text-base leading-relaxed">{step.trim().replace(/[,.]$/, '')}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Sección Windows */}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-2xl">🪟</span>
                                Para Windows:
                              </h4>
                              <div className="space-y-4">
                                {faq.answer.split('Para Windows:')[1].split(/\d\)/).slice(1).map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-gray-700 pt-2 text-base leading-relaxed">{step.trim().replace(/[,.]$/, '')}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : faq.answer.includes('For macOS:') && faq.answer.includes('For Windows:') ? (
                          /* Versión en inglés */
                          <div className="space-y-8">
                            {/* Sección macOS */}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-2xl">🍎</span>
                                For macOS:
                              </h4>
                              <div className="space-y-4">
                                {faq.answer.split('For Windows:')[0].split('For macOS:')[1].split(/\d\)/).slice(1).map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-gray-700 pt-2 text-base leading-relaxed">{step.trim().replace(/[,.]$/, '')}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Sección Windows */}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-2xl">🪟</span>
                                For Windows:
                              </h4>
                              <div className="space-y-4">
                                {faq.answer.split('For Windows:')[1].split(/\d\)/).slice(1).map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-gray-700 pt-2 text-base leading-relaxed">{step.trim().replace(/[,.]$/, '')}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : faq.answer.includes('•') ? (
                          /* Detectar si es texto con bullets (•) */
                          <div>
                            {faq.answer.split('•').map((part, partIndex) => {
                              if (partIndex === 0 && !faq.answer.startsWith('•')) {
                                return (
                                  <p key={partIndex} className="mb-6 text-gray-700 text-lg">
                                    {part.trim()}
                                  </p>
                                );
                              }
                              if (part.trim()) {
                                return (
                                  <div key={partIndex} className="flex items-start gap-4 mb-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                                    <span className="text-gray-700 text-base leading-relaxed">{part.trim()}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        ) : faq.answer.includes('1)') ? (
                          /* Detectar si es texto con pasos numerados simples */
                          <div>
                            <p className="mb-6 text-gray-700 text-lg">
                              {faq.answer.split('1)')[0].trim()}
                            </p>
                            <div className="space-y-4">
                              {faq.answer.split(/\d\)/).slice(1).map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-5">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">
                                    {stepIndex + 1}
                                  </div>
                                  <p className="text-gray-700 pt-2 text-base leading-relaxed">{step.trim().replace(/,$/, '')}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Texto simple */
                          <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                        )}
                      </div>
                    </div>
                    {faq.code && (
                      <div className="mt-6 bg-gray-900 rounded-xl p-6 overflow-x-auto shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-400 text-xs ml-2">Terminal</span>
                        </div>
                        <pre className="text-green-400 text-sm leading-relaxed">
                          <code>{faq.code}</code>
                        </pre>
                      </div>
                    )}
                    {faq.links && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {faq.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            {link.text}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {t('documentation.cta.title')}
          </h3>
          <p className="text-lg mb-8 opacity-90">
            {t('documentation.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://github.com/russofg/stage-timer-pro"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {t('documentation.cta.github')}
            </motion.a>
            <motion.a
              href="mailto:support@matecode.dev"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Soporte
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

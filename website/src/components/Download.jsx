import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

export default function Download() {
  const { t } = useTranslation();

  return (
    <section id="descargar" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('download.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('download.subtitle')}
          </p>
        </motion.div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Windows Version */}
          <motion.div
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.285L24 0v11.551H10.949V2.164zm0 12.237H24V24l-13.051-1.436V14.401zM0 14.401h9.75v8.135L0 21.15V14.401z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Windows
              </h3>
              <p className="text-gray-600 mb-6">
                Versión completa para Windows 10/11
              </p>
              <motion.a
                href="https://github.com/russofg/stage-timer-pro/releases/download/v1.0.2/Stage.Timer.Pro_1.0.2_x64_en-US.msi"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar para Windows
              </motion.a>
              <p className="text-sm text-gray-500 mt-3">
                ~3.46 MB - Instalador directo
              </p>
            </div>
          </motion.div>

          {/* macOS Version */}
          <motion.div
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C6.624 0 2.184 4.293 2.184 9.682c0 4.539 3.131 8.347 7.374 9.484.54.116.735-.228.735-.508 0-.251-.01-1.08-.014-1.96-2.739.594-3.316-1.159-3.316-1.159-.492-1.25-1.201-1.582-1.201-1.582-.981-.67.075-.656.075-.656 1.085.077 1.656 1.112 1.656 1.112.964 1.651 2.529 1.174 3.146.898.098-.699.378-1.174.687-1.443-2.399-.273-4.92-1.198-4.92-5.334 0-1.178.422-2.142 1.111-2.896-.111-.272-.481-1.370.105-2.857 0 0 .906-.290 2.968 1.107.862-.240 1.786-.360 2.704-.364.918.004 1.843.124 2.707.364 2.059-1.397 2.964-1.107 2.964-1.107.588 1.487.219 2.585.107 2.857.692.754 1.109 1.718 1.109 2.896 0 4.146-2.526 5.057-4.932 5.324.388.334.733.991.733 1.996 0 1.441-.013 2.601-.013 2.953 0 .285.192.628.741.521C18.689 18.021 21.816 14.216 21.816 9.682 21.816 4.293 17.376 0 12.017 0"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                macOS
              </h3>
              <p className="text-gray-600 mb-6">
                Versión completa para macOS 10.15+
              </p>
              <motion.a
                href="https://github.com/russofg/stage-timer-pro/releases/download/v1.0.2/Stage.Timer.Pro_1.0.2_universal.dmg"
                className="bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar para macOS
              </motion.a>
              <p className="text-sm text-gray-500 mt-3">
                ~8.62 MB - Instalador DMG
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Características Incluidas
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Rápido e Intuitivo</h4>
              <p className="text-sm text-gray-600">Interfaz simple y fluida para eventos profesionales</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Multi-pantalla</h4>
              <p className="text-sm text-gray-600">Soporte completo para múltiples monitores</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">100% Gratuito</h4>
              <p className="text-sm text-gray-600">Sin limitaciones, sin costo, para toda la comunidad</p>
            </div>
          </div>
        </motion.div>

        {/* Installation Note */}
        <motion.div
          className="bg-blue-50 rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 text-blue-700 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Instalación Simple</span>
          </div>
          <p className="text-sm text-gray-600">
            Instalador directo, sin configuración técnica complicada
          </p>
        </motion.div>

        {/* System Requirements */}
        <motion.div
          className="mt-16 bg-gray-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('download.systemRequirements.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Windows Requirements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.285L24 0v11.551H10.949V2.164zm0 12.237H24V24l-13.051-1.436V14.401zM0 14.401h9.75v8.135L0 21.15V14.401z"/>
                </svg>
                Windows
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Windows 10 o superior</li>
                <li>• 4 GB de RAM mínimo</li>
                <li>• 100 MB de espacio libre</li>
                <li>• Resolución mínima 1024x768</li>
              </ul>
            </div>
            
            {/* macOS Requirements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C6.624 0 2.184 4.293 2.184 9.682c0 4.539 3.131 8.347 7.374 9.484.54.116.735-.228.735-.508 0-.251-.01-1.08-.014-1.96-2.739.594-3.316-1.159-3.316-1.159-.492-1.25-1.201-1.582-1.201-1.582-.981-.67.075-.656.075-.656 1.085.077 1.656 1.112 1.656 1.112.964 1.651 2.529 1.174 3.146.898.098-.699.378-1.174.687-1.443-2.399-.273-4.92-1.198-4.92-5.334 0-1.178.422-2.142 1.111-2.896-.111-.272-.481-1.370.105-2.857 0 0 .906-.290 2.968 1.107.862-.240 1.786-.360 2.704-.364.918.004 1.843.124 2.707.364 2.059-1.397 2.964-1.107 2.964-1.107.588 1.487.219 2.585.107 2.857.692.754 1.109 1.718 1.109 2.896 0 4.146-2.526 5.057-4.932 5.324.388.334.733.991.733 1.996 0 1.441-.013 2.601-.013 2.953 0 .285.192.628.741.521C18.689 18.021 21.816 14.216 21.816 9.682 21.816 4.293 17.376 0 12.017 0"/>
                </svg>
                macOS
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• macOS 10.15 o superior</li>
                <li>• 4 GB de RAM mínimo</li>
                <li>• 100 MB de espacio libre</li>
                <li>• Resolución mínima 1024x768</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

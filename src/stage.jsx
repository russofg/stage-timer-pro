import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { formatMs } from './timer'
import { listen } from '@tauri-apps/api/event'

function Stage() {
  const [data, setData] = useState({ 
    remainingMs: 15*60_000, 
    color: 'green', 
    negativeMode: false, 
    totalMs: 15*60_000,
    sequenceMode: false,
    currentSequenceIndex: 0,
    totalSequenceTimers: 0,
    currentTimerName: null,
    colorInfo: null,
    timeConfig: {
      showCurrentTime: true,
      timeFormat24h: true,
      showSeconds: true,
      timePosition: 'top-right'
    }
  })
  const [msg, setMsg] = useState(null) // { text, untilTs, fontSize, blinking, replaceTimer }
  const [currentTime, setCurrentTime] = useState(new Date())
  const [branding, setBranding] = useState({
    colors: { primary: '#3B82F6', secondary: '#10B981', background: '#1F2937', accent: '#F59E0B' },
    logo: '',
    showBranding: true
  })
  const prevColor = useRef('green')
  const [blink, setBlink] = useState(false)

  // simple beep using Web Audio when entering red
  const audioCtx = useRef(null)
  function beep() {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
      const duration = 0.2
      const oscillator = audioCtx.current.createOscillator()
      const gain = audioCtx.current.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = 880
      gain.gain.value = 0.05
      oscillator.connect(gain)
      gain.connect(audioCtx.current.destination)
      oscillator.start()
      setTimeout(() => oscillator.stop(), duration * 1000)
    } catch {}
  }

  useEffect(() => {
    const unsubs = []
    
    // Request initial branding when stage window loads by emitting to main window
    const requestInitialData = async () => {
      try {
        const { emit } = await import('@tauri-apps/api/event')
        // Emit to main window to request current data
        await emit('stage:request-initial-data', {})
      } catch (error) {
        console.log('Could not request initial data:', error)
      }
    }
    
    // Request initial data after a short delay to ensure everything is ready
    // SOLO si no tenemos branding configurado
    const hasCustomBranding = branding.logo || branding.colors.primary !== '#3B82F6'
    if (!hasCustomBranding) {
      setTimeout(requestInitialData, 500)
      console.log('Requesting initial data because no custom branding detected')
    } else {
      console.log('Skipping initial data request - custom branding already set')
    }
    
    listen('stage:state', (ev) => {
      const s = JSON.parse(ev.payload)
      // Preservar configuración de tiempo actual si no viene en el payload
      setData(prevData => {
        const newData = {
          ...s,
          timeConfig: s.timeConfig || prevData.timeConfig
        }
        return newData
      })
      if (prevColor.current !== 'red' && s.color === 'red') {
        beep()
      }
      prevColor.current = s.color
      setBlink(s.color === 'red')
    }).then(u => unsubs.push(u))

    listen('stage:message', (ev) => {
      const { text, ttlMs = 4000, fontSize = 200, blinking = false, replaceTimer = false } = JSON.parse(ev.payload)
      const until = Date.now() + ttlMs
      console.log('Received message, current branding state:', branding)
      setMsg({ text, untilTs: until, fontSize, blinking, replaceTimer })
    }).then(u => unsubs.push(u))

    listen('stage:branding', (ev) => {
      const brandingData = JSON.parse(ev.payload)
      console.log('Received branding data:', brandingData)
      
      // SOLO actualizar si realmente viene información nueva y válida
      setBranding(prevBranding => {
        let hasChanges = false
        const newBranding = { ...prevBranding }
        
        // Solo actualizar si hay cambios reales y válidos
        if (brandingData.colors && JSON.stringify(brandingData.colors) !== JSON.stringify(prevBranding.colors)) {
          newBranding.colors = brandingData.colors
          hasChanges = true
        }
        
        if (brandingData.logo !== undefined && brandingData.logo !== prevBranding.logo) {
          newBranding.logo = brandingData.logo
          hasChanges = true
        }
        
        if (brandingData.showBranding !== undefined && brandingData.showBranding !== prevBranding.showBranding) {
          newBranding.showBranding = brandingData.showBranding
          hasChanges = true
        }
        
        // Solo actualizar si hay cambios reales
        if (hasChanges) {
          console.log('Updating branding with changes:', newBranding)
          return newBranding
        } else {
          console.log('No branding changes, keeping current state')
          return prevBranding
        }
      })
    }).then(u => unsubs.push(u))

    listen('stage:hide-message', () => setMsg(null)).then(u => unsubs.push(u))

    return () => { unsubs.forEach(u => u()); }
  }, []) // NO dependencies - solo ejecutar una vez

  // Separate useEffect for message cleanup interval
  useEffect(() => {
    const id = setInterval(() => {
      if (msg && Date.now() > msg.untilTs) {
        console.log('Auto-hiding expired message')
        setMsg(null)
      }
    }, 200)

    return () => clearInterval(id)
  }, [msg]) // This one NEEDS msg dependency to work properly

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Format current time according to configuration
  const formatCurrentTime = useMemo(() => {
    const config = data.timeConfig || { timeFormat24h: true, showSeconds: true }
    
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
    
    let formattedHours = hours
    let ampm = ''
    
    if (!config.timeFormat24h) {
      // 12-hour format
      ampm = hours >= 12 ? ' PM' : ' AM'
      formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    }
    
    const timeString = config.showSeconds 
      ? `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${ampm}`
      : `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${ampm}`
    
    return timeString
  }, [currentTime, data.timeConfig])

  // Get positioning style for current time display
  const getTimePositionStyle = useMemo(() => {
    const position = data.timeConfig?.timePosition || 'top-right'
    
    const baseStyle = {
      position: 'absolute',
      zIndex: 50,
      padding: '16px',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      fontFamily: 'monospace'
    }
    
    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px' }
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px' }
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px' }
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px' }
      default:
        return { ...baseStyle, top: '20px', right: '20px' }
    }
  }, [data.timeConfig?.timePosition])

  const display = useMemo(() => formatMs(data.remainingMs, true), [data.remainingMs])
  
  // Calcular porcentaje de progreso y colores del progress bar
  const progressData = useMemo(() => {
    const totalMs = data.totalMs || 15*60_000 // fallback si no viene totalMs
    const remainingMs = Math.max(0, data.remainingMs) // no negativos para la barra
    const progressPercent = Math.max(0, Math.min(100, ((totalMs - remainingMs) / totalMs) * 100))
    
    // Usar color avanzado si está disponible
    let progressColor = branding.colors.secondary || '#10B981' // verde por defecto
    
    if (data.colorInfo && data.colorInfo.bgColor) {
      progressColor = data.colorInfo.bgColor
    } else {
      // Colores del progress bar basados en tiempo restante (sistema original)
      const remainingPercent = (remainingMs / totalMs) * 100
      
      if (remainingPercent <= 10) {
        progressColor = '#DC2626' // rojo crítico
      } else if (remainingPercent <= 25) {
        progressColor = '#EF4444' // rojo
      } else if (remainingPercent <= 50) {
        progressColor = branding.colors.accent || '#F59E0B' // amarillo
      }
    }
    
    const remainingPercent = (remainingMs / totalMs) * 100
    return { progressPercent, progressColor, remainingPercent }
  }, [data.remainingMs, data.totalMs, data.colorInfo, branding.colors])
  
  // Usar colores del branding o colores avanzados
  const getBackgroundColor = () => {
    // Si tenemos información detallada de color, usarla
    if (data.colorInfo && data.colorInfo.bgColor) {
      return data.colorInfo.bgColor
    }
    
    // Fallback al sistema original
    if (data.color === 'critical') return '#DC2626'
    if (data.color === 'warning') return '#EF4444'
    if (data.color === 'caution') return '#F59E0B'
    if (data.color === 'transition') return '#10B981'
    if (data.color === 'good') return '#059669'
    if (data.color === 'green') return branding.colors.secondary || '#10B981'
    if (data.color === 'yellow') return branding.colors.accent || '#F59E0B'
    if (data.color === 'red') return '#DC2626'
    return branding.colors.background || '#1F2937'
  }

  // Determinar si mostrar el timer o solo el mensaje
  const showTimer = !msg || !msg.replaceTimer
  const messageBlinking = msg && msg.blinking

  const bgColor = getBackgroundColor()

  return (
    <div 
      className="w-screen h-screen text-white flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Branding Header */}
      {branding.showBranding && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
          {branding.logo && (
            <img 
              src={branding.logo} 
              alt="Logo" 
              className="h-12 w-auto object-contain"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
      )}

      {/* Indicador de Secuencia */}
      {data.sequenceMode && data.currentTimerName && (
        <div className="absolute top-6 left-6 z-10">
          <div 
            className="px-4 py-2 rounded-lg backdrop-blur-sm border shadow-lg"
            style={{
              backgroundColor: `${branding.colors.background}E6`,
              borderColor: branding.colors.primary,
              color: branding.colors.primary
            }}
          >
            <div className="text-sm font-semibold">{data.currentTimerName}</div>
            <div className="text-xs opacity-80">
              {data.currentSequenceIndex + 1} de {data.totalSequenceTimers}
            </div>
          </div>
        </div>
      )}

      {/* Progress de Secuencia */}
      {data.sequenceMode && data.totalSequenceTimers > 1 && (
        <div className="absolute top-6 right-6 z-10">
          <div className="flex items-center gap-1">
            {Array.from({ length: data.totalSequenceTimers }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  i === data.currentSequenceIndex 
                    ? 'scale-125 shadow-lg' 
                    : i < data.currentSequenceIndex 
                      ? 'opacity-60' 
                      : 'opacity-30'
                }`}
                style={{
                  backgroundColor: i <= data.currentSequenceIndex ? branding.colors.primary : 'transparent',
                  borderColor: branding.colors.primary
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Indicador de Estado del Timer */}
      {data.colorInfo && (
        <div className={`absolute ${data.sequenceMode ? 'top-16' : 'top-6'} right-6 z-10`}>
          <div 
            className="px-3 py-1 rounded-lg backdrop-blur-sm border shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: `${data.colorInfo.bgColor}E6`,
              borderColor: data.colorInfo.bgColor,
              color: data.colorInfo.textColor
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.colorInfo.bgColor }}
            />
            <div>
              <div className="text-xs font-semibold">{data.colorInfo.name}</div>
              <div className="text-xs opacity-80">{data.colorInfo.remainingPercent}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Timer principal */}
      {showTimer && (
        <div className={`text-center ${blink ? 'blink' : ''}`}>
          <div 
            className="font-mono font-bold drop-shadow-lg" 
            style={{ 
              fontSize: '18vw', 
              lineHeight: 1,
              textShadow: '4px 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            {display}
          </div>
        </div>
      )}

      {/* Mensaje que reemplaza al timer */}
      {msg && msg.replaceTimer && (
        <div className={`text-center ${messageBlinking ? 'blink' : ''}`}>
          <div 
            className="font-bold break-words max-w-[90vw]" 
            style={{ 
              fontSize: `${Math.max(msg.fontSize, 24)}px`,
              lineHeight: 1.2,
              textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
              color: branding.colors.primary
            }}
          >
            {msg.text}
          </div>
        </div>
      )}

      {/* Mensaje flotante (no reemplaza al timer) */}
      {msg && !msg.replaceTimer && (
        <div 
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl font-semibold backdrop-blur-sm max-w-[90vw] text-center border-2 ${messageBlinking ? 'blink' : ''}`}
          style={{
            backgroundColor: `${branding.colors.background}E6`, // 90% opacity
            borderColor: branding.colors.primary,
            color: branding.colors.primary
          }}
        >
          <div 
            style={{ 
              fontSize: `${Math.max(msg.fontSize, 16)}px`,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {msg.text}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-black bg-opacity-40 border-t border-white border-opacity-20">
        <div 
          className="h-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{
            width: `${progressData.progressPercent}%`,
            backgroundColor: progressData.progressColor,
            boxShadow: `0 0 12px ${progressData.progressColor}60, inset 0 1px 0 rgba(255,255,255,0.2)`
          }}
        >
          {/* Efecto de brillo animado */}
          <div 
            className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
            style={{
              animation: 'shimmer 2s infinite linear',
              transform: 'skewX(-15deg)'
            }}
          />
        </div>
        
        {/* Marcadores de tiempo en la barra */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Marcador 25% */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-white bg-opacity-50"
            style={{ left: '25%' }}
          />
          {/* Marcador 50% */}
          <div 
            className="absolute top-0 h-full w-1 bg-white bg-opacity-70"
            style={{ left: '50%', marginLeft: '-2px' }}
          />
          {/* Marcador 75% */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-white bg-opacity-50"
            style={{ left: '75%' }}
          />
        </div>
        
        {/* Indicador de porcentaje */}
        {progressData.progressPercent > 5 && (
          <div 
            className="absolute top-0 h-full flex items-center transition-all duration-500"
            style={{ 
              left: `${Math.min(progressData.progressPercent - 5, 95)}%`,
              color: progressData.remainingPercent <= 25 ? '#fff' : progressData.progressColor
            }}
          >
            <span className="text-xs font-bold drop-shadow-sm">
              {Math.round(progressData.progressPercent)}%
            </span>
          </div>
        )}
      </div>

      {/* Footer con branding sutil */}
      {branding.showBranding && (
        <div className="absolute bottom-4 right-6 opacity-60">
          <div 
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: 'white' }}
          >
            Hecho con{' '}
            <span 
              className="animate-pulse inline-block"
              style={{
                animation: 'heartbeat 1.5s ease-in-out infinite',
                color: 'white'
              }}
            >
              ♥
            </span>
            {' '}por MateCode
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      {/* Current Time Display */}
      {data.timeConfig?.showCurrentTime && (
        <div style={getTimePositionStyle}>
          {formatCurrentTime}
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Stage />)

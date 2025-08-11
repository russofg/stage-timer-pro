import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Countdown, formatMs } from './timer'
import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'

function Button({ children, onClick, className = '', variant = 'default' }) {
  const baseClasses = 'px-3 py-2 rounded border shadow-sm hover:opacity-90 transition-all'
  const variants = {
    default: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
    primary: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
    success: 'bg-green-500 text-white border-green-500 hover:bg-green-600',
    warning: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600'
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

// Función para formatear tiempo de milisegundos a HH:MM:SS
function formatTime(milliseconds) {
  if (!milliseconds || milliseconds < 0) return '00:00:00'
  
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function App() {
  // Estados del timer (ahora con horas, minutos, segundos)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(15)
  const [seconds, setSeconds] = useState(0)
  const [warn, setWarn] = useState(5) // en minutos
  const [neg, setNeg] = useState(false)
  
  // Estados para colores avanzados del timer
  const [colorThresholds, setColorThresholds] = useState({
    critical: 2,    // minutos - Rojo crítico
    warning: 5,     // minutos - Amarillo/Naranja
    caution: 10,    // minutos - Amarillo claro
    good: 25        // porcentaje - Verde/Azul
  })
  const [enableAdvancedColors, setEnableAdvancedColors] = useState(true)
  
  // Estados para display de hora actual
  const [showCurrentTime, setShowCurrentTime] = useState(true)
  const [timeFormat24h, setTimeFormat24h] = useState(true)
  const [showSeconds, setShowSeconds] = useState(true)
  const [timePosition, setTimePosition] = useState('top-right') // top-left, top-right, bottom-left, bottom-right
  
  // Estado para controlar fullscreen del stage
  const [isStageFullscreen, setIsStageFullscreen] = useState(true)
  
  // Referencias para acceder a los valores más actuales
  const timeConfigRef = useRef({
    showCurrentTime: true,
    timeFormat24h: true,
    showSeconds: true,
    timePosition: 'top-right'
  })
  
  // Estados de mensajes mejorados
  const [message, setMessage] = useState('')
  const [messageTtl, setMessageTtl] = useState(4) // seg
  const [persistMsg, setPersistMsg] = useState(false)
  const [fontSize, setFontSize] = useState(200) // px - Aumentado a 200px por defecto
  const [blinking, setBlinking] = useState(false)
  const [replaceTimer, setReplaceTimer] = useState(false)
  
  // Estados de branding (solo logo)
  const [brandColors, setBrandColors] = useState({
    primary: '#3B82F6',
    secondary: '#10B981', 
    background: '#1F2937',
    accent: '#F59E0B'
  })
  const [logo, setLogo] = useState('')
  const [logoSize, setLogoSize] = useState(120) // Tamaño en píxeles, sincronizado con stage
  const [blackBackground, setBlackBackground] = useState(false)
  const [showBranding, setShowBranding] = useState(true)
  
  // Estados globales para mensajes y branding actual
  const [currentGlobalMessage, setCurrentGlobalMessage] = useState(null)
  const [currentGlobalBranding, setCurrentGlobalBranding] = useState(null)
  
  // Estados para timers secuenciales
  const [timerSequence, setTimerSequence] = useState([])
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0)
  const [sequenceMode, setSequenceMode] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  
  // Estado temporal para agregar nuevos timers a la secuencia
  const [newTimerName, setNewTimerName] = useState('')
  const [newTimerHours, setNewTimerHours] = useState(0)
  const [newTimerMinutes, setNewTimerMinutes] = useState(5)
  const [newTimerSeconds, setNewTimerSeconds] = useState(0)
  
  // Mensajes predefinidos
  const [presetMessages] = useState([
    'TIME OUT',
    'BREAK',
    '5 MINUTOS',
    'ÚLTIMO MINUTO',
    'FINALIZANDO',
    'PREPARARSE'
  ])

  const timerRef = useRef(null)
  const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000
  const [state, setState] = useState({ running: false, remainingMs: totalMs, color: 'green' })

  // instanciar timer al montar
  useEffect(() => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000
    timerRef.current = new Countdown({ initialMs: totalMs, warnMs: warn * 60_000, negativeMode: neg })
    setState({ running: false, remainingMs: totalMs, color: 'green' })
    
    // Solicitar permisos de notificación al iniciar
    requestNotificationPermission()
    
    // Auto-position stage window on secondary monitor when app starts
    const autoPositionStage = async () => {
      try {
        await invoke('position_stage_on_secondary_monitor')
      } catch (error) {
        console.log('Failed to auto-position stage window:', error)
      }
    }
    
    // Wait a bit for the stage window to be ready
    setTimeout(autoPositionStage, 1000)
  }, [])

  // Manejar atajos globales
  useEffect(() => {
    let unlisten = null

    const setupGlobalShortcuts = async () => {
      try {
        // Escuchar eventos de atajos globales
        unlisten = await listen('global-shortcut', (event) => {
          const action = event.payload
          console.log('🔥 Atajo global activado:', action)

          switch (action) {
            case 'toggle-timer':
              handleStartStop()
              break
            case 'reset-timer':
              handleReset()
              break
            case 'toggle-stage-fullscreen':
              handleToggleStageFullscreen()
              break
            default:
              console.log('Acción de atajo global no reconocida:', action)
          }
        })

        console.log('✅ Atajos globales configurados')
      } catch (error) {
        console.error('❌ Error configurando atajos globales:', error)
      }
    }

    setupGlobalShortcuts()

    // Cleanup
    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, []) // Solo al montar

  // Aplicar siempre modo oscuro
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Efecto para enviar branding cuando cambie (solo si hay branding personalizado)
  // Inicializar timer al cargar la aplicación
  useEffect(() => {
    applyInitial()
  }, []) // Solo al montar el componente

  // Efecto para enviar configuración de hora cuando cambie
  useEffect(() => {
    if (timerRef.current) {
      pushStageState()
    }
  }, [showCurrentTime, timeFormat24h, showSeconds, timePosition])

  // Actualizar la referencia de timeConfig cuando cambien los valores
  useEffect(() => {
    timeConfigRef.current = {
      showCurrentTime,
      timeFormat24h,
      showSeconds,
      timePosition
    }
  }, [showCurrentTime, timeFormat24h, showSeconds, timePosition])

  // Efecto para actualizar branding automáticamente - MÁS SIMPLE
  useEffect(() => {
    const updateBrandingNow = async () => {
      const brandingData = {
        colors: brandColors,
        logo,
        logoSize,
        blackBackground,
        showBranding
      }
      
      console.log('🔄 Updating branding immediately:', { logoSize, blackBackground, showBranding })
      
      // Actualizar estado global
      setCurrentGlobalBranding(brandingData)
      
      // Enviar al stage inmediatamente
      try {
        await invoke('emit_to_stage', {
          event: 'stage:branding',
          payload: JSON.stringify(brandingData)
        })
        console.log('✅ Branding sent successfully')
      } catch (err) {
        console.error('❌ Error sending branding:', err)
      }
    }
    
    updateBrandingNow()
  }, [brandColors, logo, logoSize, blackBackground, showBranding])

  // aplicar tiempo inicial
  const applyInitial = () => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000
    
    // Preparar umbrales de color
    const thresholds = enableAdvancedColors ? {
      critical: colorThresholds.critical * 60_000,  // convertir minutos a ms
      warning: colorThresholds.warning * 60_000,
      caution: colorThresholds.caution * 60_000,
      good: colorThresholds.good / 100  // convertir porcentaje a decimal
    } : null;
    
    timerRef.current = new Countdown({ 
      initialMs: totalMs, 
      warnMs: warn * 60_000, 
      negativeMode: neg,
      colorThresholds: thresholds
    })
    pushStageState()
    setState({ running: false, remainingMs: totalMs, color: 'green' })
  }

  const tick = () => {
    if (!timerRef.current) return
    const changed = timerRef.current.tick()
    if (changed) {
      const color = timerRef.current.color()
      const remainingMs = timerRef.current.remainingMs
      const colorInfo = timerRef.current.getColorInfo()
      const prevState = state
      
      setState({ running: timerRef.current.running, remainingMs, color, colorInfo })
      pushStageState()
      
      // Actualizar badge con tiempo restante
      if (timerRef.current.running && remainingMs > 0) {
        const badgeText = formatMs(remainingMs, false)
        updateBadge(badgeText)
      } else if (!timerRef.current.running || remainingMs <= 0) {
        updateBadge(null) // Limpiar badge
      }
      
      // Notificaciones importantes
      if (timerRef.current.running) {
        // Notificación cuando el timer termina
        if (remainingMs <= 0 && prevState.remainingMs > 0) {
          sendNotification(
            '⏰ Timer Terminado',
            sequenceMode && timerSequence[currentSequenceIndex] 
              ? `${timerSequence[currentSequenceIndex].name} ha finalizado`
              : 'El tiempo ha terminado',
            null
          )
        }
        // Notificación de warning (solo una vez al entrar en estado warning)
        else if (color === 'yellow' && prevState.color !== 'yellow') {
          const warningTime = Math.ceil(remainingMs / 60000)
          sendNotification(
            '⚠️ Advertencia de Tiempo',
            `Quedan ${warningTime} minuto${warningTime !== 1 ? 's' : ''}`,
            null
          )
        }
        // Notificación crítica (solo una vez al entrar en estado crítico)
        else if (color === 'red' && prevState.color !== 'red') {
          sendNotification(
            '🚨 Tiempo Crítico',
            'El tiempo está por agotarse',
            null
          )
        }
      }
      
      // Lógica de avance automático en modo secuencia
      if (sequenceMode && autoAdvance && remainingMs <= 0 && timerRef.current.running) {
        advanceToNextTimer()
      }
    }
  }

  // loop de 100ms
  useEffect(() => {
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [])

  // controles
  const start = () => { 
    timerRef.current.start(); 
    pushStageState(); 
    setState(s => ({...s, running: true}))
  }
  const pause = () => { 
    timerRef.current.pause(); 
    pushStageState(); 
    setState(s => ({...s, running: false}))
  }
  const stop  = () => { timerRef.current.stop(); pushStageState(); setState(s => ({...s, remainingMs: timerRef.current.remainingMs, running: false, color: 'green'})) }

  const addMin = (n) => { timerRef.current.add(n * 60_000); pushStageState(); setState(s => ({...s, remainingMs: timerRef.current.remainingMs, color: timerRef.current.color()})) }

  const setWarnMin = (m) => { setWarn(m); timerRef.current.setWarnMs(m * 60_000); pushStageState() }
  const toggleNeg = () => { const v = !neg; setNeg(v); timerRef.current.setNegative(v); pushStageState() }

  // Funciones para atajos globales
  const handleStartStop = () => {
    if (!timerRef.current) return
    // Usar directamente el estado del timer en lugar del estado de React
    if (timerRef.current.running) {
      pause()
      setState(s => ({...s, running: false}))
    } else {
      start()
      setState(s => ({...s, running: true}))
    }
  }

  const handleReset = () => {
    if (!timerRef.current) return
    stop()
    applyInitial()
  }

  const handleToggleStageFullscreen = async () => {
    try {
      // Get current stage window
      const stageWin = await invoke('get_window', { label: 'stage' })
      if (stageWin) {
        // Toggle fullscreen (we'll toggle the state)
        await invoke('toggle_stage_fullscreen', { on: !isStageFullscreen })
        setIsStageFullscreen(!isStageFullscreen)
      }
    } catch (error) {
      console.log('Error toggling stage fullscreen:', error)
    }
  }

  // Funciones de notificación y badge
  const sendNotification = async (title, body, icon = null) => {
    try {
      await invoke('send_notification', { title, body, icon })
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const updateBadge = async (label) => {
    try {
      await invoke('set_badge_label', { label })
    } catch (error) {
      console.error('Error updating badge:', error)
    }
  }

  const requestNotificationPermission = async () => {
    try {
      const result = await invoke('request_notification_permission')
      console.log('Notification permission:', result)
      return result.includes('granted')
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  // Funciones para integración con software de video (Resolume Arena, OBS)
  const setStageForCapture = async (width, height) => {
    try {
      await invoke('set_stage_for_capture', { width, height })
      console.log(`✅ Stage configurado para captura: ${width}x${height}`)
      
      // Mostrar notificación
      await sendNotification(
        'Stage Timer - Video Capture', 
        `Ventana configurada para captura de video: ${width}x${height}`
      )
    } catch (error) {
      console.error('Error configurando stage para captura:', error)
    }
  }

  const resetStageWindow = async () => {
    try {
      await invoke('reset_stage_window')
      console.log('✅ Stage window reset to normal mode')
      
      // Mostrar notificación
      await sendNotification(
        'Stage Timer', 
        'Ventana restaurada al modo normal'
      )
    } catch (error) {
      console.error('Error resetting stage window:', error)
    }
  }

  // Funciones para timers secuenciales
  const addTimerToSequence = () => {
    if (!newTimerName.trim()) return
    
    const newTimer = {
      id: Date.now(),
      name: newTimerName.trim(),
      hours: newTimerHours,
      minutes: newTimerMinutes,
      seconds: newTimerSeconds,
      totalMs: (newTimerHours * 3600 + newTimerMinutes * 60 + newTimerSeconds) * 1000
    }
    
    setTimerSequence(prev => [...prev, newTimer])
    setNewTimerName('')
    setNewTimerHours(0)
    setNewTimerMinutes(5)
    setNewTimerSeconds(0)
  }

  const removeTimerFromSequence = (id) => {
    setTimerSequence(prev => prev.filter(timer => timer.id !== id))
    if (currentSequenceIndex >= timerSequence.length - 1) {
      setCurrentSequenceIndex(0)
    }
  }

  const startSequence = () => {
    if (timerSequence.length === 0) return
    
    setSequenceMode(true)
    setCurrentSequenceIndex(0)
    loadTimerFromSequence(0)
    start()
  }

  const stopSequence = () => {
    setSequenceMode(false)
    setCurrentSequenceIndex(0)
    stop()
  }

  const loadTimerFromSequence = (index) => {
    if (index >= timerSequence.length) return
    
    const timer = timerSequence[index]
    setHours(timer.hours)
    setMinutes(timer.minutes)
    setSeconds(timer.seconds)
    
    // Preparar umbrales de color
    const thresholds = enableAdvancedColors ? {
      critical: colorThresholds.critical * 60_000,
      warning: colorThresholds.warning * 60_000,
      caution: colorThresholds.caution * 60_000,
      good: colorThresholds.good / 100
    } : null;
    
    // Aplicar el timer
    timerRef.current = new Countdown({ 
      initialMs: timer.totalMs, 
      warnMs: warn * 60_000, 
      negativeMode: neg,
      colorThresholds: thresholds
    })
    setState({ running: false, remainingMs: timer.totalMs, color: 'green' })
    pushStageState()
    
    // Enviar mensaje con nombre del timer actual
    sendTimerMessage(`${timer.name}`, 3000)
  }

  const advanceToNextTimer = () => {
    const nextIndex = currentSequenceIndex + 1
    
    if (nextIndex < timerSequence.length) {
      setCurrentSequenceIndex(nextIndex)
      loadTimerFromSequence(nextIndex)
      // Auto-start el siguiente timer
      setTimeout(() => {
        if (timerRef.current) {
          timerRef.current.start()
          pushStageState()
        }
      }, 100)
    } else {
      // Secuencia completada
      setSequenceMode(false)
      setCurrentSequenceIndex(0)
      sendTimerMessage('SECUENCIA COMPLETADA', 5000)
    }
  }

  const jumpToSequenceTimer = (index) => {
    if (index >= timerSequence.length) return
    
    setCurrentSequenceIndex(index)
    loadTimerFromSequence(index)
    
    // Si estaba corriendo, continuar con el nuevo timer
    if (state.running) {
      setTimeout(() => {
        if (timerRef.current) {
          timerRef.current.start()
          pushStageState()
        }
      }, 100)
    }
  }

  const sendTimerMessage = async (text, ttlMs = 3000) => {
    const messageData = {
      text,
      ttlMs,
      fontSize: 150,
      blinking: false,
      replaceTimer: false,
      visible: true
    }
    
    // Actualizar estado global
    setCurrentGlobalMessage(messageData)
    
    await invoke('emit_to_stage', { 
      event: 'stage:message', 
      payload: JSON.stringify(messageData)
    })
    
    // Actualizar estado
    await pushStageState()
    
    // Limpiar mensaje después del TTL
    setTimeout(() => {
      setCurrentGlobalMessage(null)
      pushStageState()
    }, ttlMs)
  }

  // Enviar estado al Stage
  const pushStageState = async () => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000
    const colorInfo = timerRef.current ? timerRef.current.getColorInfo() : null
    
    // Usar la referencia actual para obtener los valores más recientes
    const currentTimeConfig = timeConfigRef.current
    
    // Preparar branding actual
    const currentBranding = {
      colors: brandColors,
      logo,
      showBranding
    }
    
    const payload = JSON.stringify({
      remainingMs: timerRef.current.remainingMs,
      running: timerRef.current.running,
      warnMs: timerRef.current.warnMs,
      negativeMode: timerRef.current.negativeMode,
      color: timerRef.current.color(),
      colorInfo: colorInfo, // Información detallada del color
      totalMs: totalMs,
      // Información de secuencia
      sequenceMode: sequenceMode,
      currentSequenceIndex: currentSequenceIndex,
      totalSequenceTimers: timerSequence.length,
      currentTimerName: sequenceMode && timerSequence[currentSequenceIndex] ? timerSequence[currentSequenceIndex].name : null,
      // Configuración de hora actual - usar la referencia
      timeConfig: currentTimeConfig
    })
    
    // Enviar al stage window local
    await invoke('emit_to_stage', { event: 'stage:state', payload })
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    const ttlMs = persistMsg ? 24 * 60 * 60 * 1000 : Math.max(1000, messageTtl * 1000)
    
    const messageData = { 
      text: message, 
      ttlMs,
      fontSize,
      blinking,
      replaceTimer,
      visible: true
    }
    
    // Actualizar estado global
    setCurrentGlobalMessage(messageData)
    
    // Enviar solo el mensaje, SIN tocar el branding
    await invoke('emit_to_stage', { 
      event: 'stage:message', 
      payload: JSON.stringify(messageData)
    })
    
    // Actualizar estado
    await pushStageState()
    
    setMessage('')
    
    // Limpiar mensaje después del TTL (si no es persistente)
    if (!persistMsg) {
      setTimeout(() => {
        setCurrentGlobalMessage(null)
        pushStageState()
      }, ttlMs)
    }
  }

  const sendPresetMessage = async (presetText) => {
    const ttlMs = persistMsg ? 24 * 60 * 60 * 1000 : Math.max(1000, messageTtl * 1000)
    
    const messageData = { 
      text: presetText, 
      ttlMs,
      fontSize,
      blinking,
      replaceTimer,
      visible: true
    }
    
    // Actualizar estado global
    setCurrentGlobalMessage(messageData)
    
    // Enviar solo el mensaje predefinido, SIN tocar el branding
    await invoke('emit_to_stage', { 
      event: 'stage:message', 
      payload: JSON.stringify(messageData)
    })
    
    // Actualizar estado
    await pushStageState()
    
    // Limpiar mensaje después del TTL (si no es persistente)
    if (!persistMsg) {
      setTimeout(() => {
        setCurrentGlobalMessage(null)
        pushStageState()
      }, ttlMs)
    }
  }

  // Funciones para la vista previa del stage
  const getPreviewBackgroundColor = () => {
    if (blackBackground) return '#000000' // Fondo negro si está activado
    if (state.color === 'critical') return '#DC2626' // Rojo crítico
    if (state.color === 'warning') return '#EF4444'  // Rojo warning
    if (state.color === 'caution') return '#F59E0B'  // Naranja/amarillo
    if (state.color === 'good' || state.color === 'green') return '#059669' // Verde
    if (state.color === 'transition') return '#10B981' // Verde claro
    return '#1F2937' // Gris por defecto cuando está detenido
  }

  const getPreviewTextColor = () => {
    return '#FFFFFF' // Siempre blanco para buena legibilidad
  }

  const hideMessage = async () => {
    // Limpiar mensaje global
    setCurrentGlobalMessage(null)
    
    await invoke('emit_to_stage', { event: 'stage:hide-message', payload: '{}' })
    
    // Actualizar estado
    await pushStageState()
  }

  const openFullscreen = async () => { 
    try {
      console.log('Opening stage window...')
      
      // First ensure stage window exists (recreate if closed)
      await invoke('create_stage_window')
      console.log('Stage window created')
      
      // Wait a bit for window to be ready
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Position the stage window on secondary monitor and make fullscreen
      await invoke('position_stage_on_secondary_monitor')
      console.log('Stage positioned on secondary monitor')
      
      // Focus the stage window
      await invoke('focus_stage')
      console.log('Stage focused')
      
      // Wait a moment then send current state and branding
      setTimeout(async () => {
        try {
          // Send current timer state
          await pushStageState()
          console.log('Timer state sent to stage')
          
          // Send current branding to ensure new window has correct branding
          const brandingData = {
            colors: brandColors,
            logo,
            logoSize,
            blackBackground,
            showBranding
          }
          await invoke('emit_to_stage', {
            event: 'stage:branding',
            payload: JSON.stringify(brandingData)
          })
          console.log('Branding sent to stage')
        } catch (error) {
          console.error('Error sending data to stage:', error)
        }
      }, 800)
    } catch (error) {
      console.error('Error opening stage window:', error)
    }
  }

  // hotkeys
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') { 
        e.preventDefault(); 
        // Usar el ref para obtener el estado actual del timer
        if (timerRef.current && timerRef.current.running) {
          pause()
        } else {
          start()
        }
      }
      if (e.key === 's' || e.key === 'S') stop()
      if (e.key === '+') addMin(1)
      if (e.key === '-') addMin(-1)
      if ((e.ctrlKey || e.metaKey) && e.key === '+') addMin(5)
      if ((e.ctrlKey || e.metaKey) && e.key === '-') addMin(-5)
      if (e.key === 'm' || e.key === 'M') sendMessage()
      if (e.key === 'h' || e.key === 'H') hideMessage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, []) // Remover todas las dependencias innecesarias

  // Listen for stage window requesting initial data
  useEffect(() => {
    const setupStageListener = async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event')
        const unlisten = await listen('stage:request-initial-data', async () => {
          // Send current timer state ONLY (no branding to avoid reset)
          await pushStageState()
          console.log('Stage requested initial data - sent timer state only')
        })
        return unlisten
      } catch (error) {
        console.log('Could not setup stage listener:', error)
        return null
      }
    }
    
    let unlisten = null
    setupStageListener().then(u => unlisten = u)
    
    return () => {
      if (unlisten) unlisten()
    }
  }, [])

  // Close stage window when dashboard closes
  useEffect(() => {
    const closeStageOnExit = async () => {
      try {
        const { appWindow } = await import('@tauri-apps/api/window')
        const unlisten = await appWindow.onCloseRequested(async (event) => {
          try {
            await invoke('close_stage_window')
          } catch (error) {
            console.log('Could not close stage window:', error)
          }
        })
        return unlisten
      } catch (error) {
        console.log('Could not setup close listener:', error)
        return null
      }
    }
    
    let unlisten = null
    closeStageOnExit().then(u => unlisten = u)
    
    return () => {
      if (unlisten) unlisten()
    }
  }, [])

  const display = useMemo(() => formatMs(state.remainingMs, true), [state.remainingMs])

  return (
    <div className="min-h-screen transition-colors dark bg-gray-900">
      <div className="p-4 max-w-6xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              ⏱️ Stage Timer Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Control profesional de tiempo para presentaciones y eventos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Tiempo inicial */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">⏰ Tiempo Inicial</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">Horas</label>
                <input 
                  type="number" 
                  value={hours} 
                  onChange={e=>setHours(Math.max(0, +e.target.value||0))} 
                  className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">Min</label>
                <input 
                  type="number" 
                  value={minutes} 
                  onChange={e=>setMinutes(Math.max(0, Math.min(59, +e.target.value||0)))} 
                  className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0" max="59"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">Seg</label>
                <input 
                  type="number" 
                  value={seconds} 
                  onChange={e=>setSeconds(Math.max(0, Math.min(59, +e.target.value||0)))} 
                  className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0" max="59"
                />
              </div>
            </div>
            <Button onClick={applyInitial} variant="primary" className="w-full">Aplicar Tiempo</Button>
          </div>

          {/* Timers Secuenciales */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">📋 Secuencia</h3>
            
            {/* Estado actual de la secuencia */}
            {sequenceMode && timerSequence.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Activo: {timerSequence[currentSequenceIndex]?.name}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {currentSequenceIndex + 1} de {timerSequence.length}
                </div>
              </div>
            )}
            
            {/* Lista de timers en la secuencia */}
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {timerSequence.map((timer, index) => (
                <div 
                  key={timer.id} 
                  className={`flex items-center justify-between p-1.5 rounded text-xs ${
                    sequenceMode && index === currentSequenceIndex 
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex-1 truncate">
                    <div className="font-medium text-gray-900 dark:text-white">{timer.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {String(timer.hours).padStart(2,'0')}:{String(timer.minutes).padStart(2,'0')}:{String(timer.seconds).padStart(2,'0')}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => jumpToSequenceTimer(index)}
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      disabled={!sequenceMode}
                      title="Saltar a este timer"
                    >
                      ▶️
                    </button>
                    <button 
                      onClick={() => removeTimerFromSequence(timer.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Controles de secuencia */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <Button 
                  onClick={startSequence} 
                  variant="success" 
                  className="flex-1 text-xs"
                  disabled={timerSequence.length === 0 || sequenceMode}
                >
                  🎬 Iniciar Secuencia
                </Button>
                <Button 
                  onClick={stopSequence} 
                  variant="danger" 
                  className="flex-1 text-xs"
                  disabled={!sequenceMode}
                >
                  ⏹️ Detener
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  id="autoAdvance" 
                  type="checkbox" 
                  checked={autoAdvance} 
                  onChange={e => setAutoAdvance(e.target.checked)}
                  className="text-blue-500"
                />
                <label htmlFor="autoAdvance" className="text-xs text-gray-600 dark:text-gray-300">
                  Avance automático
                </label>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">⚙️ Configuración</h3>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-300">Warning (min)</label>
              <input 
                type="number" 
                value={warn} 
                onChange={e=>setWarnMin(+e.target.value||0)} 
                className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                id="neg" 
                type="checkbox" 
                checked={neg} 
                onChange={toggleNeg}
                className="text-blue-500"
              />
              <label htmlFor="neg" className="text-xs text-gray-600 dark:text-gray-300">Contar en negativo</label>
            </div>
          </div>

          {/* Controles */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">🎮 Controles</h3>
            <div className="flex gap-2">
              <Button onClick={start} variant="success" className="flex-1 text-xs">▶️ Start</Button>
              <Button onClick={pause} variant="warning" className="flex-1 text-xs">⏸️ Pause</Button>
              <Button onClick={stop} variant="danger" className="flex-1 text-xs">⏹️ Stop</Button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <Button onClick={() => addMin(1)} className="text-xs">+1m</Button>
              <Button onClick={() => addMin(5)} className="text-xs">+5m</Button>
              <Button onClick={() => addMin(10)} className="text-xs">+10m</Button>
              <Button onClick={() => addMin(-1)} className="text-xs">-1m</Button>
              <Button onClick={() => addMin(-5)} className="text-xs">-5m</Button>
              <Button onClick={() => addMin(-10)} className="text-xs">-10m</Button>
            </div>
          </div>

          {/* Stage */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">🎬 Stage Display</h3>
            <Button onClick={openFullscreen} variant="primary" className="w-full">
              🖥️ Abrir Stage Fullscreen
            </Button>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ⌨️ Atajos: Space (▶️/⏸️), S (⏹️), +/− (±1m), D (🌙/☀️)
            </div>
          </div>
        </div>

        {/* Agregar Timer a Secuencia */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">➕ Agregar Timer a Secuencia</h3>
          <div className="grid grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-300">Nombre del Timer</label>
              <input 
                type="text" 
                value={newTimerName} 
                onChange={e => setNewTimerName(e.target.value)}
                placeholder="ej: Introducción"
                className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-300">Horas</label>
              <input 
                type="number" 
                value={newTimerHours} 
                onChange={e => setNewTimerHours(Math.max(0, +e.target.value || 0))}
                className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-300">Minutos</label>
              <input 
                type="number" 
                value={newTimerMinutes} 
                onChange={e => setNewTimerMinutes(Math.max(0, Math.min(59, +e.target.value || 0)))}
                className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0" max="59"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-300">Segundos</label>
              <input 
                type="number" 
                value={newTimerSeconds} 
                onChange={e => setNewTimerSeconds(Math.max(0, Math.min(59, +e.target.value || 0)))}
                className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0" max="59"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addTimerToSequence} 
                variant="success" 
                className="w-full"
                disabled={!newTimerName.trim()}
              >
                ➕ Agregar
              </Button>
            </div>
          </div>
          
          {/* Plantillas rápidas */}
          <div className="mt-3 pt-3 border-t dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">🎯 Plantillas Rápidas:</div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => {
                  setNewTimerName('Introducción')
                  setNewTimerMinutes(5)
                  setNewTimerSeconds(0)
                }}
                variant="default"
                className="text-xs"
              >
                📢 Introducción (5m)
              </Button>
              <Button 
                onClick={() => {
                  setNewTimerName('Presentación')
                  setNewTimerMinutes(15)
                  setNewTimerSeconds(0)
                }}
                variant="default"
                className="text-xs"
              >
                🎤 Presentación (15m)
              </Button>
              <Button 
                onClick={() => {
                  setNewTimerName('Q&A')
                  setNewTimerMinutes(10)
                  setNewTimerSeconds(0)
                }}
                variant="default"
                className="text-xs"
              >
                ❓ Q&A (10m)
              </Button>
              <Button 
                onClick={() => {
                  setNewTimerName('Descanso')
                  setNewTimerMinutes(15)
                  setNewTimerSeconds(0)
                }}
                variant="default"
                className="text-xs"
              >
                ☕ Descanso (15m)
              </Button>
              <Button 
                onClick={() => {
                  setNewTimerName('Cierre')
                  setNewTimerMinutes(5)
                  setNewTimerSeconds(0)
                }}
                variant="default"
                className="text-xs"
              >
                🎯 Cierre (5m)
              </Button>
            </div>
          </div>
        </div>

        {/* Configuración Avanzada de Colores */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">🎨 Colores Avanzados del Timer</h3>
            <div className="flex items-center gap-2">
              <input 
                id="enableAdvancedColors" 
                type="checkbox" 
                checked={enableAdvancedColors} 
                onChange={e => setEnableAdvancedColors(e.target.checked)}
                className="text-blue-500"
              />
              <label htmlFor="enableAdvancedColors" className="text-xs text-gray-600 dark:text-gray-300">
                Activar colores avanzados
              </label>
            </div>
          </div>
          
          {enableAdvancedColors && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    🔴 Crítico (min)
                  </label>
                  <input 
                    type="number" 
                    value={colorThresholds.critical} 
                    onChange={e => setColorThresholds(prev => ({...prev, critical: Math.max(0, +e.target.value || 0)}))}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="0"
                  />
                  <div className="text-xs text-gray-400 mt-1">Últimos minutos</div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    🟠 Alerta (min)
                  </label>
                  <input 
                    type="number" 
                    value={colorThresholds.warning} 
                    onChange={e => setColorThresholds(prev => ({...prev, warning: Math.max(0, +e.target.value || 0)}))}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="0"
                  />
                  <div className="text-xs text-gray-400 mt-1">Tiempo de alerta</div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    🟡 Precaución (min)
                  </label>
                  <input 
                    type="number" 
                    value={colorThresholds.caution} 
                    onChange={e => setColorThresholds(prev => ({...prev, caution: Math.max(0, +e.target.value || 0)}))}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="0"
                  />
                  <div className="text-xs text-gray-400 mt-1">Tiempo de atención</div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    🟢 Bueno (%)
                  </label>
                  <input 
                    type="number" 
                    value={colorThresholds.good} 
                    onChange={e => setColorThresholds(prev => ({...prev, good: Math.max(0, Math.min(100, +e.target.value || 0))}))}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="0" max="100"
                  />
                  <div className="text-xs text-gray-400 mt-1">% tiempo restante</div>
                </div>
              </div>
              
              {/* Vista previa de colores */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">Vista previa de estados:</div>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#059669'}}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Bueno (&gt;{colorThresholds.good}%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#10B981'}}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Transición</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#F59E0B'}}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Precaución ({colorThresholds.caution}m)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#EF4444'}}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Alerta ({colorThresholds.warning}m)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#DC2626'}}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Crítico ({colorThresholds.critical}m)</span>
                  </div>
                </div>
              </div>
              
              {/* Botones de presets */}
              <div className="mt-3 pt-3 border-t dark:border-gray-600">
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">Presets rápidos:</div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => setColorThresholds({critical: 1, warning: 3, caution: 5, good: 50})}
                    variant="default"
                    className="text-xs"
                  >
                    🚀 Presentación Rápida
                  </Button>
                  <Button 
                    onClick={() => setColorThresholds({critical: 2, warning: 5, caution: 10, good: 25})}
                    variant="default"
                    className="text-xs"
                  >
                    📋 Conferencia Estándar
                  </Button>
                  <Button 
                    onClick={() => setColorThresholds({critical: 5, warning: 15, caution: 30, good: 20})}
                    variant="default"
                    className="text-xs"
                  >
                    🎓 Evento Largo
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Configuración de Hora Actual */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">🕒 Display de Hora Actual</h3>
            <div className="flex items-center gap-2">
              <input 
                id="showCurrentTime" 
                type="checkbox" 
                checked={showCurrentTime} 
                onChange={e => setShowCurrentTime(e.target.checked)}
                className="text-blue-500"
              />
              <label htmlFor="showCurrentTime" className="text-xs text-gray-600 dark:text-gray-300">
                Mostrar hora actual
              </label>
            </div>
          </div>
          
          {showCurrentTime && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    🕐 Formato de Hora
                  </label>
                  <select 
                    value={timeFormat24h ? '24h' : '12h'} 
                    onChange={e => setTimeFormat24h(e.target.value === '24h')}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="24h">24 horas (14:30)</option>
                    <option value="12h">12 horas (2:30 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    ⏰ Mostrar Segundos
                  </label>
                  <select 
                    value={showSeconds ? 'yes' : 'no'} 
                    onChange={e => setShowSeconds(e.target.value === 'yes')}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="yes">Sí (14:30:45)</option>
                    <option value="no">No (14:30)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    📍 Posición en Stage
                  </label>
                  <select 
                    value={timePosition} 
                    onChange={e => setTimePosition(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="top-left">↖️ Superior Izquierda</option>
                    <option value="top-right">↗️ Superior Derecha</option>
                    <option value="bottom-left">↙️ Inferior Izquierda</option>
                    <option value="bottom-right">↘️ Inferior Derecha</option>
                  </select>
                </div>
              </div>
              
              {/* Vista previa de hora */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">Vista previa de hora:</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="px-3 py-1 rounded font-mono text-lg"
                    style={{ backgroundColor: brandColors.background, color: brandColors.primary }}
                  >
                    {(() => {
                      const now = new Date()
                      if (timeFormat24h) {
                        return showSeconds 
                          ? now.toLocaleTimeString('es-ES', { hour12: false })
                          : now.toLocaleTimeString('es-ES', { hour12: false, second: undefined })
                      } else {
                        return showSeconds 
                          ? now.toLocaleTimeString('es-ES', { hour12: true })
                          : now.toLocaleTimeString('es-ES', { hour12: true, second: undefined })
                      }
                    })()}
                  </div>
                  <span className="text-xs text-gray-500">
                    Se mostrará en {
                      timePosition === 'top-left' ? 'superior izquierda' :
                      timePosition === 'top-right' ? 'superior derecha' :
                      timePosition === 'bottom-left' ? 'inferior izquierda' :
                      'inferior derecha'
                    }
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Display del reloj */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                ⏱️ Tiempo Restante
              </div>
              <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white">{display}</div>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${
              state.color==='green' && 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
            } ${
              state.color==='yellow' && 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
            } ${
              state.color==='red' && 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
            } ${
              (state.color==='critical' || state.color==='warning') && 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
            } ${
              state.color==='caution' && 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
            } ${
              (state.color==='transition' || state.color==='good') && 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
            }`}>
              {state.colorInfo ? (
                <>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: state.colorInfo.bgColor }}
                  />
                  <div>
                    <div>{state.colorInfo.name}</div>
                    <div className="text-xs opacity-70">{state.colorInfo.remainingPercent}%</div>
                  </div>
                </>
              ) : (
                state.color.toUpperCase()
              )}
            </span>
          </div>
        </div>

        {/* Mensajes y Comunicación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Mensaje personalizado */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Mensaje Personalizado</h3>
            </div>
            
            <div className="space-y-3">
              <input 
                value={message} 
                onChange={e=>setMessage(e.target.value)} 
                placeholder="Escribe tu mensaje..." 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Tamaño</label>
                  <input 
                    type="number" 
                    value={fontSize} 
                    onChange={e=>setFontSize(Math.max(12, +e.target.value||200))} 
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                    min="12"
                    placeholder="200px"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Duración</label>
                  <input 
                    type="number" 
                    value={messageTtl} 
                    onChange={e=>setMessageTtl(+e.target.value||0)} 
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="5s"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Opciones</label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input 
                        type="checkbox" 
                        checked={blinking} 
                        onChange={e=>setBlinking(e.target.checked)}
                        className="w-3 h-3 text-blue-600 rounded"
                      />
                      <span className="text-gray-600 dark:text-gray-300">Titila</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input 
                        type="checkbox" 
                        checked={replaceTimer} 
                        onChange={e=>setReplaceTimer(e.target.checked)}
                        className="w-3 h-3 text-blue-600 rounded"
                      />
                      <span className="text-gray-600 dark:text-gray-300">Reemplaza timer</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={persistMsg} 
                  onChange={e=>setPersistMsg(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-600 dark:text-gray-300">Mantener hasta ocultar manualmente</span>
              </label>
              
              <div className="flex gap-2">
                <Button onClick={sendMessage} variant="primary" className="flex-1 text-sm py-2">
                  📤 Enviar
                </Button>
                <Button onClick={hideMessage} variant="danger" className="flex-1 text-sm py-2">
                  🚫 Ocultar
                </Button>
              </div>
            </div>
          </div>

          {/* Mensajes predefinidos */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Mensajes Predefinidos</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetMessages.map((preset, index) => (
                <Button 
                  key={index}
                  onClick={() => sendPresetMessage(preset)}
                  variant="default"
                  className="text-xs py-2 px-3 hover:scale-105 transition-transform"
                >
                  {preset}
                </Button>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">💡 Configuración:</span> Los mensajes usan el tamaño, titilación y duración actuales.
              </div>
            </div>
          </div>
        </div>

        {/* Branding y Herramientas Profesionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Branding del Evento */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Branding del Evento</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">URL del Logo</label>
                <input 
                  value={logo} 
                  onChange={e=>setLogo(e.target.value)} 
                  placeholder="https://ejemplo.com/logo.png" 
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <span>💡</span> Recomendado: 200×80px, PNG/JPG
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Tamaño del Logo (px)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="24" 
                    max="120" 
                    value={logoSize} 
                    onChange={e=>{
                      const newSize = Number(e.target.value)
                      console.log('🎛️ SLIDER CHANGED TO:', newSize)
                      setLogoSize(newSize)
                    }}
                    className="flex-1"
                  />
                  <input 
                    type="number" 
                    min="24" 
                    max="120" 
                    value={logoSize} 
                    onChange={e=>{
                      const newSize = Math.max(24, Math.min(120, Number(e.target.value)))
                      console.log('🔢 INPUT CHANGED TO:', newSize)
                      setLogoSize(newSize)
                    }}
                    className="w-16 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">px</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={showBranding} 
                    onChange={e=>setShowBranding(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-gray-600 dark:text-gray-300">Mostrar logo</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={blackBackground} 
                    onChange={e=>setBlackBackground(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-gray-600 dark:text-gray-300">Fondo negro</span>
                </label>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-purple-600 dark:text-purple-400">ℹ️ Información:</span> Los colores del stage se configuran automáticamente según el estado del timer (verde, amarillo, rojo).
                </div>
              </div>
            </div>
          </div>

          {/* Vista Previa del Stage */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👁️</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Vista Previa del Stage</h3>
            </div>
            
            <div className="space-y-3">
              {/* Simulación del Stage en miniatura */}
              <div 
                className="relative border border-gray-300 dark:border-gray-600 rounded-lg aspect-video flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ 
                  minHeight: '200px',
                  backgroundColor: getPreviewBackgroundColor()
                }}
              >
                {/* Timer Principal */}
                <div 
                  className="text-4xl font-mono font-bold mb-2"
                  style={{ 
                    color: getPreviewTextColor()
                  }}
                >
                  {formatTime(state.remainingMs)}
                </div>
                
                {/* Nombre del Timer */}
                {state.currentTimerName && (
                  <div 
                    className="text-lg font-medium mb-2 opacity-80"
                    style={{ 
                      color: getPreviewTextColor()
                    }}
                  >
                    {state.currentTimerName}
                  </div>
                )}
                
                {/* Mensaje si existe */}
                {state.messageShown && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  >
                    <div 
                      className="text-xl font-bold text-center px-4 text-white"
                      style={{
                        fontSize: Math.min(24, (state.messageFontSize || 200) * 0.1) + 'px'
                      }}
                    >
                      {state.messageText}
                    </div>
                  </div>
                )}
                
                {/* Logo si está configurado - centrado como en el stage */}
                {logo && showBranding && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="w-auto object-contain opacity-80"
                      style={{ height: logoSize * 0.67 + 'px' }} // Escalado para vista previa
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                {/* Branding matecode - SIEMPRE VISIBLE */}
                <div 
                  className="absolute bottom-2 right-2 text-xs opacity-60"
                  style={{ 
                    color: getPreviewTextColor()
                  }}
                >
                  Hecho con ♥ por MateCode
                </div>
                
                {/* Barra de progreso */}
                <div className="absolute bottom-0 left-0 h-1 bg-black bg-opacity-30 w-full">
                  <div 
                    className="h-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.max(0, Math.min(100, ((state.totalMs - state.remainingMs) / state.totalMs) * 100))}%`,
                      backgroundColor: getPreviewTextColor()
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Información del estado actual */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium text-gray-600 dark:text-gray-300">Estado</div>
                  <div className="text-gray-800 dark:text-gray-200 capitalize">
                    {state.color || 'Detenido'}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium text-gray-600 dark:text-gray-300">Progreso</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {Math.round(((state.totalMs - state.remainingMs) / state.totalMs) * 100 || 0)}%
                  </div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium text-gray-600 dark:text-gray-300">Secuencia</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {state.currentSequenceIndex !== null ? `${state.currentSequenceIndex + 1}/${timerSequence.length}` : 'Individual'}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium text-gray-600 dark:text-gray-300">Mensaje</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {state.messageShown ? 'Visible' : 'Oculto'}
                  </div>
                </div>
              </div>
              
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-medium">🔄 Actualización en tiempo real:</span> Esta vista previa refleja exactamente lo que se muestra en el Stage.
                </div>
              </div>
            </div>
          </div>

          {/* Atajos Globales */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Atajos Globales</h3>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-600">⌘+Shift+Space</code>
                <span className="text-xs text-gray-600 dark:text-gray-300">Start/Pause</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-600">⌘+Shift+R</code>
                <span className="text-xs text-gray-600 dark:text-gray-300">Reset Timer</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-600">⌘+Shift+F</code>
                <span className="text-xs text-gray-600 dark:text-gray-300">Toggle Fullscreen</span>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                <span>✅</span> Activos desde cualquier aplicación
              </div>
            </div>
          </div>
        </div>

        {/* Integración con Software de Video */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎥</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Integración con Software de Video</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Configuración de Captura */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Configurar Stage para Captura
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => setStageForCapture(1920, 1080)} 
                  variant="primary" 
                  className="text-xs py-2"
                >
                  📺 1920×1080
                </Button>
                <Button 
                  onClick={() => setStageForCapture(1280, 720)} 
                  variant="primary" 
                  className="text-xs py-2"
                >
                  📺 1280×720
                </Button>
                <Button 
                  onClick={() => setStageForCapture(1024, 768)} 
                  variant="primary" 
                  className="text-xs py-2"
                >
                  📺 1024×768
                </Button>
                <Button 
                  onClick={() => resetStageWindow()} 
                  variant="warning" 
                  className="text-xs py-2"
                >
                  🔄 Reset
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.open('https://obsproject.com/', '_blank')} 
                  variant="default" 
                  className="text-xs flex-1 py-2"
                >
                  📥 OBS Studio
                </Button>
                <Button 
                  onClick={() => window.open('https://ndi.video/tools/', '_blank')} 
                  variant="default" 
                  className="text-xs flex-1 py-2"
                >
                  📥 NDI Tools
                </Button>
              </div>
            </div>
            
            {/* Métodos de Integración */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Métodos de Integración
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">🥇 NDI (Recomendado)</div>
                  <div className="text-blue-700 dark:text-blue-400">Calidad profesional • Sin lag • Fácil setup</div>
                </div>
                
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <div className="font-medium text-green-800 dark:text-green-300 mb-1">🥈 OBS Virtual Camera</div>
                  <div className="text-green-700 dark:text-green-400">Gratis • Compatible con todo • Fácil</div>
                </div>
                
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                  <div className="font-medium text-orange-800 dark:text-orange-300 mb-1">🥉 Captura Directa</div>
                  <div className="text-orange-700 dark:text-orange-400">Básico • Mayor uso de CPU</div>
                </div>
              </div>
              
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  💡 <strong>Tip:</strong> Usa fondo negro para mejor chromakey
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

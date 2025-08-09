# 🔧 Documentación Técnica - Stage Timer Pro

## Arquitectura del Sistema

### Frontend (React + Vite)
```
src/
├── main.jsx         # Dashboard - Ventana de control principal
├── stage.jsx        # Stage - Pantalla de presentación fullscreen  
├── timer.js         # Lógica del countdown/temporizador
└── index.css        # Estilos globales con modo oscuro
```

### Backend (Rust + Tauri)
```
src-tauri/src/
└── main.rs          # Comandos Rust y configuración de ventanas
```

## API Interna (Comandos Tauri)

### Comandos Disponibles

#### `emit_to_stage(event: String, payload: String)`
Envía eventos desde Dashboard hacia Stage
```rust
// Eventos soportados:
// - "stage:state"     -> Estado del timer
// - "stage:message"   -> Mensaje para mostrar
// - "stage:branding"  -> Configuración de branding
// - "stage:hide-message" -> Ocultar mensaje
```

#### `toggle_stage_fullscreen(on: bool)`
Controla el modo fullscreen de la ventana Stage
```rust
invoke('toggle_stage_fullscreen', { on: true })  // Activar
invoke('toggle_stage_fullscreen', { on: false }) // Desactivar
```

#### `focus_stage()`
Da foco a la ventana Stage
```rust
invoke('focus_stage')
```

#### `position_stage_on_secondary_monitor()`
Posiciona la ventana Stage en monitor secundario
```rust
// Auto-detecta monitores disponibles
// Coloca Stage en monitor con posición X > 0
// Fallback: posición 1920,0
```

#### `create_stage_window()`
Recrea la ventana Stage si fue cerrada
```rust
// Verifica si existe, si no la crea
// Usa configuración por defecto
```

## Eventos Inter-Window

### Dashboard → Stage

#### `stage:state`
```javascript
{
  remainingMs: number,    // Tiempo restante en milisegundos
  running: boolean,       // Si el timer está corriendo
  warnMs: number,        // Umbral de warning en ms
  negativeMode: boolean, // Si puede contar en negativo
  color: string         // 'green' | 'yellow' | 'red'
}
```

#### `stage:message`
```javascript
{
  text: string,          // Texto del mensaje
  ttlMs: number,         // Tiempo de vida en ms
  fontSize: number,      // Tamaño de fuente en px
  blinking: boolean,     // Si debe titilar
  replaceTimer: boolean  // Si reemplaza al timer
}
```

#### `stage:branding`
```javascript
{
  colors: {
    primary: string,     // Color principal (#hex)
    secondary: string,   // Color secundario (#hex)
    background: string,  // Color de fondo (#hex)
    accent: string       // Color de acento (#hex)
  },
  logo: string,          // URL del logo
  eventName: string,     // Nombre del evento
  showBranding: boolean  // Mostrar/ocultar branding
}
```

## Lógica del Timer (timer.js)

### Clase Countdown
```javascript
class Countdown {
  constructor({ initialMs, warnMs, negativeMode })
  
  // Métodos principales
  start()              // Inicia el countdown
  pause()              // Pausa el countdown  
  stop()               // Para y resetea
  tick()               // Actualiza (llamar cada 100ms)
  
  // Modificadores
  add(ms)              // Agrega/quita tiempo
  setWarnMs(ms)        // Cambia umbral warning
  setNegative(bool)    // Activa/desactiva modo negativo
  
  // Estado
  get remainingMs()    // Tiempo restante
  get running()        // Estado de ejecución
  color()              // Color actual del estado
}
```

### Estados del Timer
- **GREEN**: Tiempo normal (> warning threshold)
- **YELLOW**: Warning activado (< warning threshold, > 0)
- **RED**: Tiempo agotado (≤ 0 o modo negativo)

## Configuración Multi-Monitor

### Detección Automática
```rust
// Busca monitores disponibles
let monitors = main_win.available_monitors()?;

// Encuentra monitor secundario
let secondary = monitors.iter().find(|m| m.position().x > 0);

// Posiciona ventana Stage
stage_win.set_position(PhysicalPosition { x: pos.x, y: pos.y })
```

### Configuraciones Típicas
- **Single monitor**: Stage se abre en mismo monitor
- **Dual horizontal**: Stage va a monitor derecho (X > 0)
- **Dual vertical**: Stage va a monitor inferior
- **Triple+**: Usa primer monitor secundario encontrado

## Persistencia de Estado

### Durante Sesión
- Configuración de branding se mantiene
- Estado del timer persiste entre ventanas
- Mensajes activos se conservan
- Modo oscuro se recuerda

### Entre Sesiones
- **No implementado aún**: Configuración no se guarda
- **Roadmap**: Archivo config local o cloud storage

## Sistema de Colores

### Modo Claro
```css
/* Variables CSS automáticas */
--bg-primary: #f9fafb;
--text-primary: #111827;
--border-color: #d1d5db;
```

### Modo Oscuro
```css
/* Se activa con clase 'dark' */
--bg-primary: #111827;
--text-primary: #f9fafb;
--border-color: #374151;
```

### Branding Dinámico
```javascript
// Se aplica vía inline styles
style={{ 
  backgroundColor: branding.colors.background,
  color: branding.colors.primary 
}}
```

## Optimizaciones de Performance

### Rendering
- **React.memo**: Componentes pesados memoizados
- **useMemo**: Cálculos de display cacheados
- **useCallback**: Funciones estables para eventos

### Timer Precision
- **Interval**: 100ms para suavidad visual
- **Tick Logic**: Solo re-renderiza si hay cambios
- **Audio Context**: Lazy loading para beeps

### Window Management
- **Position Caching**: Recuerda posición de ventanas
- **Error Recovery**: Auto-recreación de ventanas cerradas
- **Memory Cleanup**: Event listeners removidos correctamente

## Debugging y Troubleshooting

### Logs Útiles
```javascript
// Frontend debugging
console.log('Timer state:', timerRef.current)
console.log('Branding config:', branding)
console.log('Message state:', msg)

// Monitor detection
console.log('Available monitors:', monitors.length)
console.log('Monitor positions:', monitors.map(m => m.position()))
```

### Problemas Comunes

#### Stage no aparece en monitor secundario
- Verificar que monitor secundario está conectado
- Revisar resolución y posición en OS
- Fallback manual: ajustar coordenadas en código

#### Space bar no funciona
- Verificar que Dashboard tiene foco
- Event listener puede estar duplicado
- Revisar dependencias de useEffect

#### Mensajes no se sincronizan
- Verificar que Stage window existe
- Revisar event emission en console
- Comprobar JSON.parse de payloads

#### Colores no se aplican
- Verificar formato hex (#RRGGBB)
- Comprobar que branding.showBranding = true
- Revisar CSS specificity

## Build y Deploy

### Desarrollo
```bash
npm run tauri:dev  # Hot reload activado
```

### Producción
```bash
npm run build      # Build frontend
npm run tauri:build # Genera binario nativo
```

### Targets Soportados
- **macOS**: `.app` bundle para distribución
- **Windows**: `.exe` con installer opcional
- **Linux**: `.deb`, `.rpm`, `.AppImage`

### Bundle Configuration
```json
// tauri.conf.json
{
  "bundle": {
    "identifier": "com.stage-timer.app",
    "icon": ["icons/icon.png"],
    "resources": ["resources/*"],
    "copyright": "Copyright © 2025"
  }
}
```

## Seguridad

### CSP (Content Security Policy)
```json
// Configurado en tauri.conf.json
"security": {
  "csp": null  // Relajado para desarrollo
}
```

### Allowlist
```json
// APIs Tauri habilitadas
"allowlist": {
  "all": true  // Todas las APIs (desarrollo)
}
```

### Producción Recommendations
- Configurar CSP restrictivo
- Habilitar solo APIs necesarias
- Validar inputs de usuario
- Sanitizar URLs de logos

---

**Esta documentación está viva y se actualiza con cada release.**

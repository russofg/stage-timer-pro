# 🎥 Stage Timer Pro - Integración con Software de Video

**Guía completa para integrar con OBS Studio, Resolume Arena, y otros software profesionales**

---

## 📋 Índice

1. [OBS Studio Integration](#obs-studio-integration)
2. [Resolume Arena Integration](#resolume-arena-integration)
3. [Wirecast Integration](#wirecast-integration)
4. [vMix Integration](#vmix-integration)
5. [XSplit Integration](#xsplit-integration)
6. [Configuraciones Avanzadas](#configuraciones-avanzadas)
7. [Troubleshooting](#troubleshooting)

---

## 🎬 OBS Studio Integration

### Método 1: Window Capture (Recomendado)

#### Configuración Básica
1. **Abrir Stage Timer Pro**
2. **Verificar** que Stage window esté visible
3. **OBS Studio** → Sources → Add → **Window Capture**

#### Configuración Detallada
```
┌─────────────────────────────────────┐
│  Window Capture Properties         │
├─────────────────────────────────────┤
│  Window: [Stage Timer - Video...▼] │
│  Match Title: ☑ Exact            │
│  Priority: ○ Window title         │
│            ● Window class          │
│  Capture Cursor: ☐                │
│  Use Color Correction: ☐          │
└─────────────────────────────────────┘
```

**Configuración recomendada:**
- ✅ **Window**: "Stage Timer - Video Capture"
- ✅ **Match Title**: Exact
- ✅ **Priority**: Window class
- ❌ **Capture Cursor**: Desactivado

#### Optimizaciones
```json
{
  "method": "Windows Graphics Capture",
  "priority": "High",
  "compatibility": "Windows 10 Build 1903+",
  "performance": "Low CPU usage"
}
```

### Método 2: Display Capture

#### Cuando usar
- **Multi-monitor setup** complejo
- **Capture de pantalla completa**
- **Múltiples aplicaciones** simultáneas

#### Configuración
1. **OBS** → Sources → **Display Capture**
2. **Display**: Seleccionar monitor con Stage Timer
3. **Crop**: Ajustar área específica

#### Crop Configuration
```
Top: 0px
Bottom: 0px  
Left: 0px
Right: 0px

// Para capture de solo timer area:
Top: 100px
Bottom: 200px
Left: 300px  
Right: 400px
```

### Método 3: Virtual Camera Bridge

#### Setup Avanzado
1. **Stage Timer** en monitor secundario
2. **OBS Scene 1**: Window Capture → Stage Timer
3. **OBS Scene 2**: Otros elementos
4. **Virtual Camera**: Start
5. **Target Software**: Webcam source

#### Virtual Camera Settings
```
Resolution: 1920x1080
FPS: 30
Format: I420
Start: Automatic
Stop: Manual
```

---

## 🎨 Resolume Arena Integration

### Método 1: NDI (Profesional - Recomendado)

#### Pre-requisitos
1. **Instalar NDI Tools**: [ndi.tv/tools](https://ndi.tv/tools/)
2. **NDI Screen Capture**: Incluido en NDI Tools
3. **Resolume Arena**: Versión 7.0+ (NDI support)

#### Configuración NDI
```bash
# 1. Abrir NDI Screen Capture
# 2. Select Region → "Stage Timer - Video Capture" window
# 3. NDI Name: "StageTimer_NDI"
# 4. Frame Rate: 30 FPS
# 5. Start Capture
```

#### Resolume Configuration
```
Sources → Input → NDI
├── Device: "StageTimer_NDI"
├── Resolution: Auto (maintains aspect)
├── Frame Rate: 30 FPS
└── Latency: Low (~1-2 frames)
```

#### Ventajas NDI
- ✅ **Latencia ultra-baja** (1-2 frames)
- ✅ **Calidad profesional** (sin compresión)
- ✅ **Network streaming** (múltiples equipos)
- ✅ **Alpha channel** support
- ✅ **Metadata** incluida

### Método 2: DirectShow Capture

#### Configuración Básica
1. **Resolume** → Sources → **Camera**
2. **Device**: Screen Capture Device
3. **Region**: Manual selection

#### Screen Capture Setup
```
┌─────────────────────────────────────┐
│  DirectShow Device Setup           │
├─────────────────────────────────────┤
│  Device: [Screen Capture Device ▼] │
│  Resolution: 1920x1080             │
│  Frame Rate: 30 FPS                │
│  Format: RGB24                     │
│  Region: Custom Rectangle          │
│    X: 1920 (second monitor)        │
│    Y: 0                           │
│    Width: 1920                     │
│    Height: 1080                    │
└─────────────────────────────────────┘
```

### Método 3: OBS → Virtual Camera → Resolume

#### Pipeline Setup
```
Stage Timer → OBS Window Capture → OBS Scene → 
Virtual Camera → Resolume Webcam Source
```

#### OBS Configuration
```json
{
  "scene": "Stage Timer Scene",
  "sources": [
    {
      "type": "window_capture",
      "window": "Stage Timer - Video Capture",
      "transform": {
        "scale": 1.0,
        "position": {"x": 0, "y": 0}
      }
    }
  ],
  "virtualCamera": {
    "resolution": "1920x1080",
    "fps": 30,
    "format": "I420"
  }
}
```

#### Resolume Webcam Source
```
Sources → Camera → Webcam
├── Device: "OBS Virtual Camera"
├── Resolution: 1920x1080
├── FPS: 30
└── Format: YUV420
```

---

## 📺 Wirecast Integration

### Setup Básico
```
Wirecast → Add Shot → Desktop Presenter
├── Application: "Stage Timer Pro"
├── Window: "Stage Timer - Video Capture"
├── Capture: Full Window
└── Audio: None
```

### Configuración Avanzada
```xml
<shot type="desktop">
  <application>Stage Timer Pro</application>
  <window>Video Capture</window>
  <capture_mode>window</capture_mode>
  <frame_rate>30</frame_rate>
  <quality>high</quality>
  <transparency>false</transparency>
</shot>
```

---

## 🎛️ vMix Integration

### Input Configuration
```
Add Input → More → Desktop Capture
├── Capture Type: Application
├── Application: Stage Timer Pro
├── Window: Stage Timer - Video Capture
├── Frame Rate: 30
└── Audio: None
```

### Automation Scripts
```vbnet
' vMix Script para control automático
Dim input As String = "Stage Timer"
API.Function("SetText", Input:=input, SelectedName:="Title", Value:="LIVE")
```

---

## 🎮 XSplit Integration

### Source Setup
```
Add Source → Screen Capture → Window
├── Window: "Stage Timer Pro - Video Capture"
├── Capture method: Graphics Capture
├── Capture cursor: No
└── Capture layered windows: Yes
```

---

## ⚙️ Configuraciones Avanzadas

### Resolution & Aspect Ratio

#### Configuraciones Recomendadas
```json
{
  "fullHD": {
    "resolution": "1920x1080",
    "aspectRatio": "16:9",
    "dpi": 96,
    "usage": "Broadcast, streaming profesional"
  },
  "HD": {
    "resolution": "1280x720", 
    "aspectRatio": "16:9",
    "dpi": 96,
    "usage": "Streaming básico, eventos locales"
  },
  "4K": {
    "resolution": "3840x2160",
    "aspectRatio": "16:9", 
    "dpi": 192,
    "usage": "Producción cinematográfica"
  },
  "vertical": {
    "resolution": "1080x1920",
    "aspectRatio": "9:16",
    "dpi": 96,
    "usage": "Social media vertical"
  }
}
```

### Frame Rate Optimization

#### Configuración por Uso
```javascript
const frameRateSettings = {
  "streaming": {
    "fps": 30,
    "reason": "Balance between quality and bandwidth"
  },
  "recording": {
    "fps": 60,
    "reason": "Smooth motion for post-production"
  },
  "broadcast": {
    "fps": 25,
    "reason": "European broadcast standard (PAL)"
  },
  "cinema": {
    "fps": 24,
    "reason": "Cinematic look and feel"
  }
}
```

### Color Space & Format

#### Recommended Settings
```yaml
colorSpace:
  rec709: "Standard HD/Full HD"
  rec2020: "4K/HDR content"
  sRGB: "Web streaming"

format:
  RGB24: "Uncompressed, highest quality"
  YUV420: "Compressed, good for streaming"
  ARGB32: "With alpha channel support"
```

### Latency Optimization

#### Low Latency Pipeline
```
Stage Timer → NDI (1-2 frames) → Resolume
Stage Timer → OBS GPU Encode (2-3 frames) → Virtual Camera
Stage Timer → DirectShow (3-5 frames) → Any software
```

#### Network Streaming (NDI)
```json
{
  "network": "Gigabit Ethernet",
  "latency": "1-2 frames (~33-66ms)",
  "bandwidth": "~100 Mbps",
  "quality": "Visually lossless",
  "setup": "Professional grade"
}
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### ❌ Window no aparece en software de captura
**Diagnóstico:**
```bash
# Verificar que Stage Timer esté ejecutándose
# Verificar que "Video Capture" window esté visible
# Verificar permisos de screen recording
```

**Soluciones:**
1. **Restart Stage Timer Pro**
2. **Toggle fullscreen**: `⌘+Shift+F`
3. **Check permissions**: Screen Recording enabled
4. **Update software**: Tanto Stage Timer como software de captura

#### ❌ Latencia alta o frames perdidos
**Optimizaciones:**
```json
{
  "hardware": "Use hardware acceleration when available",
  "resolution": "Lower resolution if CPU limited",
  "frameRate": "30 FPS vs 60 FPS based on hardware",
  "captureMethod": "Windows Graphics Capture > Legacy"
}
```

#### ❌ Audio no sincronizado
**Nota**: Stage Timer Pro es aplicación visual únicamente
- ✅ **Video source**: Stage Timer
- ✅ **Audio source**: External microphone/music
- ❌ **Audio from app**: No audio generated

#### ❌ Color/Quality Issues
```css
/* Resolume Color Correction */
.stage-timer-source {
  brightness: 1.0;
  contrast: 1.0;
  saturation: 1.0;
  gamma: 1.0;
  color-temperature: 6500K;
}
```

### Performance Optimization

#### High-End Setup (Recommended)
```yaml
hardware:
  cpu: "Intel i7/AMD Ryzen 7 or better"
  gpu: "Dedicated graphics with hardware encoding"
  ram: "16GB+ DDR4"
  storage: "SSD for better I/O"
network:
  ethernet: "Gigabit for NDI streaming"
  wifi: "WiFi 6 for wireless NDI"
```

#### Budget Setup (Minimum)
```yaml
hardware:
  cpu: "Intel i5/AMD Ryzen 5"
  gpu: "Integrated graphics OK for basic capture"
  ram: "8GB DDR4 minimum"
  storage: "HDD acceptable"
capture:
  method: "DirectShow or basic window capture"
  resolution: "1280x720"
  frameRate: "30 FPS"
```

---

## 📊 Comparison Matrix

| Método | Latencia | Calidad | Setup | CPU Usage | Pro Use |
|--------|----------|---------|-------|-----------|---------|
| **NDI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ✅ |
| **OBS Window Capture** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ |
| **DirectShow** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ |
| **Virtual Camera Bridge** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⚠️ |

### Recomendaciones por Caso de Uso

#### 🎵 DJ/Music Events
- **Primary**: NDI → Resolume Arena
- **Backup**: OBS Window Capture
- **Display**: LED walls, projectors

#### 📺 Live Streaming
- **Primary**: OBS Window Capture
- **Output**: Twitch, YouTube, Facebook Live
- **Quality**: 1080p30 or 720p60

#### 🎭 Corporate Events  
- **Primary**: Wirecast/vMix integration
- **Output**: IMAG screens, broadcast
- **Features**: Lower thirds, graphics overlay

#### 🎬 Video Production
- **Primary**: OBS recording + Virtual Camera
- **Output**: Post-production pipeline
- **Quality**: 4K/60fps for future-proofing

---

**🎯 Con estas configuraciones, Stage Timer Pro se integra perfectamente en cualquier flujo de trabajo profesional de video.**

*Para soporte específico de integración: support@matecode.dev*

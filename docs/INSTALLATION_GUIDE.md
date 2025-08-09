# 📦 Stage Timer Pro - Guía de Instalación

**Instalación paso a paso para macOS y Windows**

---

## 🍎 Instalación en macOS

### Paso 1: Descargar la Aplicación

1. Ve a [GitHub Releases](https://github.com/russofg/stage-timer-pro/releases)
2. Busca la **versión más reciente** (v1.0.2 o superior)
3. Haz clic en **`Stage Timer Pro.dmg`** para descargar
4. Espera a que termine la descarga (±50MB)

### Paso 2: Montar el DMG

1. Ve a **Downloads** en Finder
2. **Doble clic** en `Stage Timer Pro.dmg`
3. Se abrirá una ventana con el ícono de la aplicación

### Paso 3: Instalar la Aplicación

```
┌─────────────────────────────────┐
│  Stage Timer Pro Installer     │
│                                 │
│  [🎯]  ────────────→  [📁]      │
│  Stage Timer Pro    Applications│
│                                 │
│  Arrastra el ícono a la carpeta │
└─────────────────────────────────┘
```

1. **Arrastra** el ícono de Stage Timer Pro
2. **Suelta** sobre la carpeta Applications
3. Espera a que se copie (unos segundos)
4. **Expulsa** el DMG (clic derecho → Eject)

### Paso 4: Primera Ejecución

1. Abre **Launchpad** (F4)
2. Busca **"Stage Timer Pro"**
3. **Clic** en el ícono
4. **⚠️ Alerta de seguridad**: "No se puede abrir porque es de un desarrollador no identificado"

### Paso 5: Resolver Alertas de Seguridad

```bash
# Método 1: System Preferences
System Preferences → Security & Privacy → General
→ "Open Anyway" (aparece después del primer intento)

# Método 2: Terminal
sudo xattr -rd com.apple.quarantine "/Applications/Stage Timer Pro.app"
```

### Paso 6: Configurar Permisos

Al abrir por primera vez, macOS pedirá permisos:

1. **Accessibility Access** (para atajos globales)

   - System Preferences → Security & Privacy → Privacy
   - Accessibility → ✅ Stage Timer Pro

2. **Screen Recording** (para video capture)
   - Security & Privacy → Privacy
   - Screen Recording → ✅ Stage Timer Pro

---

## 🪟 Instalación en Windows

### Paso 1: Descargar el Instalador

1. Ve a [GitHub Releases](https://github.com/russofg/stage-timer-pro/releases)
2. Busca la **versión más reciente**
3. Haz clic en **`Stage Timer Pro_1.0.2_x64_en-US.msi`**
4. Guarda en **Downloads**

### Paso 2: Ejecutar el Instalador

1. Ve a **Downloads** en File Explorer
2. **Doble clic** en el archivo `.msi`
3. **⚠️ Windows Defender**: "Windows protected your PC"

### Paso 3: Resolver Alertas de Windows

```
┌─────────────────────────────────────┐
│  Windows Defender SmartScreen      │
│                                     │
│  Windows protected your PC          │
│  Microsoft Defender SmartScreen     │
│  prevented an unrecognized app      │
│  from starting.                     │
│                                     │
│  [Don't run]  [More info]           │
└─────────────────────────────────────┘
```

1. Haz clic en **"More info"**
2. Aparecerá **"Run anyway"**
3. Haz clic en **"Run anyway"**

### Paso 4: Asistente de Instalación

```
┌─────────────────────────────────────┐
│  Stage Timer Pro Setup Wizard      │
├─────────────────────────────────────┤
│  Welcome to Stage Timer Pro Setup  │
│                                     │
│  This will install Stage Timer Pro │
│  version 1.0.2 on your computer.   │
│                                     │
│  [< Back]  [Next >]  [Cancel]      │
└─────────────────────────────────────┘
```

**Pasos del wizard:**

1. **Welcome**: Clic en "Next"
2. **License Agreement**: Accept → "Next"
3. **Installation Folder**: Default OK → "Next"
4. **Ready to Install**: "Install"
5. **Completing**: "Finish"

### Paso 5: Primera Ejecución

1. **Start Menu** → Buscar "Stage Timer Pro"
2. **Clic derecho** → "Run as administrator" (primera vez)
3. La aplicación se abrirá normalmente

---

## 🔧 Configuración Post-Instalación

### Verificar Dual Monitor

```bash
# macOS: System Preferences → Displays
# Arrangement: Asegurar que los monitores estén ordenados

# Windows: Settings → System → Display
# Multiple displays: "Extend these displays"
```

### Configurar Atajos Globales

**Primer uso**: La app pedirá permisos de accesibilidad

- **Permitir** todos los permisos solicitados
- Los atajos `⌘+Shift+Space`, `⌘+Shift+R`, `⌘+Shift+F` funcionarán

### Test de Funcionalidad

1. **Timer básico**: Configurar 5 minutos → Start
2. **Dual monitor**: Verificar que Stage aparezca en segundo monitor
3. **Atajos globales**: Probar `⌘+Shift+Space` desde otra app
4. **Mensajes**: Enviar mensaje de prueba
5. **Video capture**: Verificar que sea visible en OBS/otros software

---

## 🚨 Resolución de Problemas de Instalación

### macOS Issues

#### ❌ "App is damaged and can't be opened"

```bash
# Solución: Quitar quarantine
sudo xattr -rd com.apple.quarantine "/Applications/Stage Timer Pro.app"
```

#### ❌ "No permission to open"

```bash
# Solución: Cambiar permisos
sudo chmod +x "/Applications/Stage Timer Pro.app/Contents/MacOS/Stage Timer Pro"
```

#### ❌ Atajos globales no funcionan

1. System Preferences → Security & Privacy
2. Privacy → Accessibility
3. ✅ Stage Timer Pro
4. **Restart** la aplicación

### Windows Issues

#### ❌ "This app can't run on your PC"

- **Verificar**: Windows 10/11 x64
- **Descargar**: Versión correcta del instalador
- **Ejecutar**: Como administrador

#### ❌ Installer no inicia

```cmd
# Verificar en Command Prompt
msiexec /i "Stage Timer Pro_1.0.2_x64_en-US.msi" /l*v install.log
```

#### ❌ App no aparece después de instalación

- **Buscar en**: `C:\Program Files\Stage Timer Pro\`
- **Crear acceso directo**: Arrastrar al Desktop
- **Verificar**: Windows Defender no lo bloqueó

---

## ✅ Verificación de Instalación Exitosa

### Checklist Post-Instalación

- [ ] **App abre** sin errores
- [ ] **Dashboard** visible y funcional
- [ ] **Stage window** aparece en segundo monitor
- [ ] **Timer** inicia y cuenta correctamente
- [ ] **Atajos globales** funcionan desde otras apps
- [ ] **Mensajes** se muestran correctamente
- [ ] **Branding** se puede configurar
- [ ] **Video capture** es visible en software externo

### Información del Sistema

```bash
# macOS: About This Mac
# CPU: Intel/Apple Silicon (ambos soportados)
# RAM: Mínimo 4GB recomendado
# macOS: 10.15 Catalina o superior

# Windows: Settings → System → About
# CPU: x64 processor
# RAM: Mínimo 4GB recomendado
# Windows: 10 version 1903 o superior
```

---

## 📞 Soporte de Instalación

**Si tienes problemas con la instalación:**

1. **Verifica requisitos del sistema**
2. **Ejecuta como administrador** (Windows)
3. **Desactiva temporalmente antivirus**
4. **Descarga nuevamente** el instalador

**Contacto:**

- 📧 **Email**: support@matecode.dev
- 🐛 **GitHub Issues**: [Reportar problema](https://github.com/russofg/stage-timer-pro/issues)
- 📖 **Documentación**: [Manual completo](USER_MANUAL.md)

---

**🎯 ¡Bienvenido a Stage Timer Pro!**

_Una vez instalado correctamente, revisa el [Manual de Usuario](USER_MANUAL.md) para aprender todas las funcionalidades._

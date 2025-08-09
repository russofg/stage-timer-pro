# 🎯 Stage Timer Pro

**Una aplicación profesional de timer para eventos con branding personalizable y funcionalidades avanzadas.**

![Stage Timer Pro](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tauri-Rust-orange?style=for-the-badge)
![Frontend](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![Styling](https://img.shields.io/badge/Tailwind-CSS-teal?style=for-the-badge)

## 🌟 Características Principales

### ⏰ **Timer Avanzado**

- **Configuración precisa**: Horas, minutos y segundos
- **Modo countdown**: Con alertas visuales y sonoras
- **Modo negativo**: Continúa contando después de 0
- **Alertas de warning**: Configurable por tiempo restante
- **Estados visuales**: Verde (normal), Amarillo (warning), Rojo (crítico)

### 🖥️ **Dual Monitor Support**

- **Dashboard**: Ventana de control en monitor principal
- **Stage**: Pantalla fullscreen automática en monitor secundario
- **Auto-posicionamiento**: Detecta y utiliza monitor secundario
- **Re-apertura inteligente**: Recrea ventana Stage si se cierra accidentalmente

### 💬 **Sistema de Mensajes Profesional**

- **Mensajes personalizados**: Texto libre con configuración avanzada
- **Tamaño de fuente**: Ajustable desde 12px hasta tamaños gigantes (defecto: 200px)
- **Efectos visuales**: Opción de titilación/parpadeo
- **Modos de display**:
  - Flotante (sobre el timer)
  - Reemplazo completo (oculta el timer)
- **Mensajes predefinidos**: TIME OUT, DESCANSO, PRÓXIMO TURNO, etc.
- **Persistencia configurable**: Auto-ocultar o mantener hasta ocultar manual

### 🎨 **Branding y Personalización**

- **Logo personalizado**: Soporta imágenes desde URL
- **Colores corporativos**: Paleta de colores completamente personalizable
- **Nombre del evento**: Branding superior en pantalla Stage
- **Estilos profesionales**: Sombras, efectos blur, gradientes
- **Activación/desactivación**: Control total del branding visible

### 🌙 **Modo Oscuro**

- **Toggle instantáneo**: Botón dedicado o atajo `D`
- **Transiciones suaves**: Animaciones entre modos
- **Persistencia de sesión**: Recuerda preferencia

### ⌨️ **Atajos de Teclado**

| Tecla            | Función                  |
| ---------------- | ------------------------ |
| `Space`          | ▶️ Start / ⏸️ Pause      |
| `S`              | ⏹️ Stop                  |
| `+` / `-`        | ±1 minuto                |
| `Ctrl/Cmd + +/-` | ±5 minutos               |
| `M`              | 📤 Enviar mensaje        |
| `H`              | 🙈 Ocultar mensaje       |
| `D`              | 🌙/☀️ Toggle modo oscuro |

## 🛠️ Instalación y Configuración

### Requisitos

- **Node.js** >= 18
- **Rust toolchain** (rustup, cargo, rustc)
- **macOS**: Xcode Command Line Tools

```bash
xcode-select --install
```

### Setup Rápido

```bash
# Clonar el proyecto
git clone <repo-url>
cd stage-timer-tauri

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run tauri:dev
```

### Resolución de Problemas

```bash
# Si aparece error EACCES en npm
sudo chown -R $(id -u):$(id -g) ~/.npm

# Limpiar cache de Rust si hay problemas
cd src-tauri && cargo clean
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Vite solo (navegador)
npm run tauri:dev    # Aplicación completa (Dashboard + Stage)
npm run build        # Build frontend
npm run tauri:build  # Empaqueta aplicación desktop
```

## 💼 Uso Comercial y Branding

### Configuración de Evento

1. **Nombre del evento**: Aparece en header del Stage
2. **Logo**: URL de imagen (PNG/JPG recomendado)
3. **Colores corporativos**:
   - Primario: Para textos y logos
   - Secundario: Para timer en estado normal
   - Fondo: Color base de la aplicación
   - Acento: Para advertencias

### Casos de Uso Profesionales

- ✅ **Conferencias y presentaciones**
- ✅ **Eventos deportivos**
- ✅ **Producciones audiovisuales**
- ✅ **Competencias y concursos**
- ✅ **Sesiones de capacitación**

### Personalización por Cliente

```javascript
// Ejemplo de configuración de branding
const eventBranding = {
  eventName: "TechConf 2025",
  logo: "https://cliente.com/logo.png",
  colors: {
    primary: "#1E40AF", // Azul corporativo
    secondary: "#10B981", // Verde éxito
    background: "#1F2937", // Gris oscuro
    accent: "#F59E0B", // Naranja advertencia
  },
};
```

## 🔧 Funcionalidades Técnicas

### Arquitectura

- **Frontend**: React 18 + Vite 5
- **Backend**: Rust + Tauri 1.x
- **Comunicación**: Event-driven entre ventanas
- **Styling**: Tailwind CSS con modo oscuro
- **Build**: Binarios nativos multiplataforma

### Características Avanzadas

- **Multi-monitor detection**: Automática
- **Window management**: Posicionamiento inteligente
- **Real-time sync**: Entre Dashboard y Stage
- **Audio feedback**: Beep en estado crítico
- **State persistence**: Durante la sesión
- **Error recovery**: Auto-recreación de ventanas

## 📁 Estructura del Proyecto

```
stage-timer-tauri/
├── src/
│   ├── main.jsx        # Dashboard principal
│   ├── stage.jsx       # Pantalla de presentación
│   ├── timer.js        # Lógica del countdown
│   └── index.css       # Estilos globales
├── src-tauri/
│   ├── src/main.rs     # Backend Rust
│   ├── Cargo.toml      # Dependencias Rust
│   └── tauri.conf.json # Configuración app
├── index.html          # Dashboard HTML
├── stage.html          # Stage HTML
└── package.json        # Config Node.js
```

## 🔮 Roadmap Futuro

### v2.1 (Próximo)

- [ ] Persistencia de configuración en archivo
- [ ] Temas predefinidos por industria
- [ ] Sonidos personalizables
- [ ] Historial de eventos

### v2.2 (Planeado)

- [ ] Múltiples timers simultáneos
- [ ] Plugins de terceros

### v3.0 (Visión)

- [ ] Cloud sync de configuraciones
- [ ] Analytics de eventos
- [ ] Marketplace de temas

## 📄 Licencia

Este proyecto está bajo licencia MIT. Libre para uso comercial.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch
3. Commit tus cambios
4. Push al branch
5. Abre un Pull Request

---

### 💡 **¿Listo para hacer tus eventos más profesionales?**

**Stage Timer Pro** no es solo un timer - es una herramienta completa de producción que lleva tus eventos al siguiente nivel con branding personalizado y funcionalidades avanzadas.

---

_Desarrollado con ❤️ para la comunidad de eventos profesionales_

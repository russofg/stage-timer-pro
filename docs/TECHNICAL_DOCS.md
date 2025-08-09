# 🛠️ Stage Timer Pro - Documentación Técnica

**Documentación completa para desarrolladores y contribuidores**

---

## 📋 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [APIs y Interfaces](#apis-y-interfaces)
5. [Build & Deploy](#build--deploy)
6. [Desarrollo Local](#desarrollo-local)
7. [Testing](#testing)
8. [Contribución](#contribución)

---

## 🏗️ Arquitectura del Sistema

### Visión General

```
┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Stage Window  │
│   (React)       │◄──►│   (React)       │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │  Tauri Core     │
         │  (Rust)         │
         └─────────────────┘
                     │
         ┌─────────────────┐
         │  OS Services    │
         │  • Global Keys  │
         │  • Notifications│
         │  • Multi Monitor│
         └─────────────────┘
```

### Componentes Principales

#### Frontend (React)

- **Dashboard**: Control interface (`main.jsx`)
- **Stage**: Display interface (`stage.jsx`)
- **Timer Logic**: Core countdown logic (`timer.js`)
- **Styling**: Tailwind CSS + custom themes

#### Backend (Rust)

- **Window Management**: Multi-window coordination
- **Global Shortcuts**: System-wide hotkey handling
- **OS Integration**: Notifications, dock badges
- **Video Capture**: Window management for streaming

#### Communication

- **Tauri Events**: Bidirectional communication
- **State Sync**: Real-time updates between windows
- **Error Handling**: Centralized error management

---

## 🔧 Stack Tecnológico

### Frontend

```json
{
  "framework": "React 18.2.0",
  "buildTool": "Vite 5.0",
  "styling": "Tailwind CSS 3.4",
  "stateManagement": "React Hooks + Context",
  "routing": "React Router (stage.html separation)",
  "testing": "Vitest + React Testing Library"
}
```

### Backend

```toml
[dependencies]
tauri = "1.5"
serde = "1.0"
tokio = "1.0"
global-hotkey = "0.4"
notify-rust = "4.0"
window-shadows = "0.2"
```

### Build & Deploy

```yaml
ci_cd: "GitHub Actions"
platforms:
  - "macOS (Universal Binary)"
  - "Windows (x64)"
packaging:
  - "DMG (macOS)"
  - "MSI (Windows)"
distribution: "GitHub Releases"
```

### Development Tools

```json
{
  "package_manager": "npm",
  "linting": "ESLint + Prettier",
  "rust_toolchain": "stable",
  "ide_support": "VS Code extensions",
  "debugging": "Tauri DevTools"
}
```

---

## 📁 Estructura del Proyecto

```
stage-timer-pro/
├── src/                          # Frontend React
│   ├── main.jsx                  # Dashboard principal
│   ├── stage.jsx                 # Pantalla Stage
│   ├── timer.js                  # Lógica del timer
│   └── index.css                 # Estilos globales
├── src-tauri/                    # Backend Rust
│   ├── src/
│   │   └── main.rs               # Core Tauri application
│   ├── Cargo.toml               # Dependencias Rust
│   ├── tauri.conf.json          # Configuración Tauri
│   └── icons/                   # App icons
├── public/                       # Assets estáticos
├── dist/                        # Build output
├── .github/
│   └── workflows/
│       └── build.yml            # CI/CD pipeline
├── docs/                        # Documentación
│   ├── USER_MANUAL.md
│   ├── INSTALLATION_GUIDE.md
│   ├── VIDEO_INTEGRATION.md
│   ├── FAQ.md
│   └── TECHNICAL_DOCS.md
├── package.json                 # Node.js dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind setup
└── README.md                   # Project overview
```

### Archivos Clave

#### `src/main.jsx` - Dashboard Principal

```javascript
// Componente principal con control del timer
export default function App() {
  const [timerConfig, setTimerConfig] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  // Global shortcuts event listeners
  useEffect(() => {
    const unlisten = listen("global-shortcut", handleGlobalShortcut);
    return () => unlisten();
  }, []);

  return (
    <div className="dashboard">
      <TimerControls />
      <MessagePanel />
      <BrandingConfig />
    </div>
  );
}
```

#### `src/stage.jsx` - Pantalla de Presentación

```javascript
// Ventana fullscreen para el segundo monitor
export default function Stage() {
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");
  const [currentMessage, setCurrentMessage] = useState("");
  const [branding, setBranding] = useState({});

  // Real-time updates from main window
  useEffect(() => {
    const unlisten = listen("timer-update", updateDisplay);
    return () => unlisten();
  }, []);

  return (
    <div className="stage-display">
      <Header eventName={branding.eventName} logo={branding.logo} />
      <TimerDisplay time={timeDisplay} state={timerState} />
      <MessageOverlay message={currentMessage} />
    </div>
  );
}
```

#### `src-tauri/src/main.rs` - Backend Core

```rust
use tauri::{Manager, SystemTray, CustomMenuItem};
use global_hotkey::{GlobalHotKeyManager, HotKeyState};

#[tauri::command]
async fn create_stage_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    let stage_window = tauri::WindowBuilder::new(
        &app_handle,
        "stage",
        tauri::WindowUrl::App("stage.html".into())
    )
    .fullscreen(true)
    .always_on_top(true)
    .decorations(false)
    .build()
    .map_err(|e| e.to_string())?;

    // Position on secondary monitor if available
    position_on_secondary_monitor(&stage_window).await?;

    Ok(())
}

#[tauri::command]
async fn setup_global_shortcuts(app_handle: tauri::AppHandle) -> Result<(), String> {
    let mut manager = GlobalHotKeyManager::new().unwrap();

    // ⌘+Shift+Space - Start/Pause
    let start_pause_hotkey = HotKey::new(
        Some(Modifiers::SUPER | Modifiers::SHIFT),
        Code::Space
    );

    manager.register(start_pause_hotkey).unwrap();

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_stage_window,
            setup_global_shortcuts,
            send_notification,
            set_badge_label
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 🔌 APIs y Interfaces

### Tauri Commands (Rust → JS)

#### Window Management

```rust
#[tauri::command]
async fn create_stage_window(app_handle: tauri::AppHandle) -> Result<(), String>

#[tauri::command]
async fn toggle_stage_fullscreen(app_handle: tauri::AppHandle) -> Result<(), String>

#[tauri::command]
async fn position_stage_window(x: i32, y: i32) -> Result<(), String>
```

#### Global Shortcuts

```rust
#[tauri::command]
async fn register_global_shortcuts() -> Result<(), String>

#[tauri::command]
async fn unregister_global_shortcuts() -> Result<(), String>
```

#### OS Integration

```rust
#[tauri::command]
async fn send_notification(title: String, body: String) -> Result<(), String>

#[tauri::command]
async fn set_badge_label(label: Option<String>) -> Result<(), String>

#[tauri::command]
async fn get_displays_info() -> Result<Vec<Display>, String>
```

### Events (JS ↔ JS)

#### Timer Events

```javascript
// Dashboard → Stage
emit("timer-update", {
  time: "15:30",
  state: "warning",
  progress: 0.75,
});

// Stage ← Dashboard
listen("timer-update", (event) => {
  updateTimerDisplay(event.payload);
});
```

#### Message Events

```javascript
// Send message to Stage
emit("message-show", {
  text: "BREAK TIME",
  fontSize: 200,
  blinking: true,
  mode: "overlay",
});

// Hide message
emit("message-hide");
```

#### Branding Events

```javascript
// Update branding
emit("branding-update", {
  eventName: "TechConf 2025",
  logo: "https://example.com/logo.png",
  colors: {
    primary: "#1E40AF",
    secondary: "#10B981",
  },
});
```

### REST API (Future)

```typescript
// Planned for v1.1 - Remote control
interface TimerAPI {
  GET    /api/timer/status     // Current timer state
  POST   /api/timer/start      // Start timer
  POST   /api/timer/pause      // Pause timer
  POST   /api/timer/reset      // Reset timer
  POST   /api/timer/set        // Set time
  POST   /api/message/send     // Send message
  DELETE /api/message          // Hide message
}
```

---

## 🏗️ Build & Deploy

### Development Build

```bash
# Install dependencies
npm install

# Start development server
npm run tauri:dev

# Build frontend only
npm run build

# Build Tauri app
npm run tauri:build
```

### Production Build

```bash
# Clean build
rm -rf dist/ src-tauri/target/

# Build optimized
NODE_ENV=production npm run tauri:build

# Output locations
# macOS: src-tauri/target/release/bundle/dmg/
# Windows: src-tauri/target/release/bundle/msi/
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/build.yml
name: Build Stage Timer Pro

on:
  push:
    tags: ["v*"]

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, windows-latest]

    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: actions/setup-node@v4

      - name: Build app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: "Stage Timer Pro ${{ github.ref_name }}"
```

### Release Process

```bash
# 1. Update version numbers
# package.json: "version": "1.0.3"
# src-tauri/tauri.conf.json: "version": "1.0.3"
# src-tauri/Cargo.toml: version = "1.0.3"

# 2. Create git tag
git tag v1.0.3 -m "Release v1.0.3"
git push origin v1.0.3

# 3. GitHub Actions automatically:
# - Builds for macOS and Windows
# - Creates GitHub Release
# - Uploads installers
```

---

## 💻 Desarrollo Local

### Setup Inicial

```bash
# Prerequisites
# - Node.js 18+
# - Rust toolchain
# - Platform-specific tools

# macOS
xcode-select --install

# Windows
# Install Visual Studio Build Tools

# Clone y setup
git clone https://github.com/russofg/stage-timer-pro.git
cd stage-timer-pro
npm install
```

### Development Commands

```bash
# Development server (hot reload)
npm run tauri:dev

# Frontend only (browser)
npm run dev

# Type checking
npm run check

# Linting
npm run lint
npm run lint:fix

# Rust checks
cd src-tauri
cargo check
cargo clippy
```

### Debugging

#### Frontend Debugging

```javascript
// Enable React DevTools
if (import.meta.env.DEV) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
    window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

// Console logging
console.log("Timer state:", timerState);
```

#### Rust Debugging

```rust
// Debug logging
use log::{debug, info, warn, error};

#[tauri::command]
async fn debug_command() -> Result<(), String> {
    debug!("Debug message");
    info!("Info message");
    Ok(())
}
```

#### Tauri DevTools

```bash
# Enable devtools in tauri.conf.json
{
  "tauri": {
    "devPath": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "devtools": true  // Enable for development
  }
}
```

---

## 🧪 Testing

### Unit Tests (Frontend)

```javascript
// src/timer.test.js
import { describe, it, expect } from "vitest";
import { TimerLogic } from "./timer.js";

describe("Timer Logic", () => {
  it("should count down correctly", () => {
    const timer = new TimerLogic(60); // 1 minute
    timer.start();

    // Simulate 1 second
    timer.tick();
    expect(timer.getTimeRemaining()).toBe(59);
  });

  it("should handle pause/resume", () => {
    const timer = new TimerLogic(60);
    timer.start();
    timer.pause();

    expect(timer.isPaused()).toBe(true);
    timer.resume();
    expect(timer.isRunning()).toBe(true);
  });
});
```

### Integration Tests (Rust)

```rust
// src-tauri/src/tests.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_global_shortcut_registration() {
        let result = setup_global_shortcuts().await;
        assert!(result.is_ok());
    }

    #[test]
    fn test_display_detection() {
        let displays = get_displays_info();
        assert!(!displays.is_empty());
    }
}
```

### E2E Tests (Playwright)

```javascript
// tests/e2e/timer.spec.js
import { test, expect } from "@playwright/test";

test("basic timer functionality", async ({ page }) => {
  // Navigate to app
  await page.goto("http://localhost:5173");

  // Set timer to 5 seconds
  await page.fill('[data-testid="minutes"]', "0");
  await page.fill('[data-testid="seconds"]', "5");
  await page.click('[data-testid="set-timer"]');

  // Start timer
  await page.click('[data-testid="start-button"]');

  // Verify countdown
  await expect(page.locator('[data-testid="timer-display"]')).toContainText(
    "00:04"
  );
});
```

### Performance Tests

```javascript
// tests/performance/timer-performance.js
test("timer performance under load", async () => {
  const timer = new TimerLogic(3600); // 1 hour

  const startTime = performance.now();

  // Simulate 1000 ticks (high frequency)
  for (let i = 0; i < 1000; i++) {
    timer.tick();
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  // Should complete within reasonable time
  expect(duration).toBeLessThan(100); // 100ms
});
```

---

## 🤝 Contribución

### Getting Started

1. **Fork** el repositorio
2. **Clone** tu fork
3. **Create branch**: `git checkout -b feature/amazing-feature`
4. **Make changes** y test
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Create PR** con descripción detallada

### Code Style

#### JavaScript/React

```javascript
// Use ES6+ features
const TimerComponent = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  // Prefer hooks over class components
  useEffect(() => {
    // Setup logic
  }, []);

  return <div className="timer-display">{formatTime(time)}</div>;
};
```

#### Rust

```rust
// Follow Rust standard conventions
pub async fn create_stage_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    let window = tauri::WindowBuilder::new(
        &app_handle,
        "stage",
        tauri::WindowUrl::App("stage.html".into())
    )
    .build()
    .map_err(|e| e.to_string())?;

    Ok(())
}
```

### Commit Convention

```bash
# Format: type(scope): description
feat(timer): add pause functionality
fix(ui): resolve dark mode toggle issue
docs(api): update command documentation
test(timer): add unit tests for countdown logic
refactor(stage): optimize render performance
```

### Pull Request Guidelines

- **Clear title** y descripción
- **Reference issues** si aplica
- **Include tests** para new features
- **Update documentation** si es necesario
- **Screenshot/video** para UI changes
- **Test on both platforms** si es posible

### Architecture Decisions

Las decisiones arquitectónicas importantes se documentan en:

- **GitHub Issues** para discusión
- **ADR (Architecture Decision Records)** para decisiones finales
- **Technical discussions** en GitHub Discussions

---

## 📊 Performance & Optimization

### Memory Usage

```rust
// Optimize memory in Rust backend
use std::sync::Arc;
use tokio::sync::RwLock;

// Shared state with minimal allocations
type SharedState = Arc<RwLock<AppState>>;

// Minimize string allocations
fn format_timer_display(seconds: u32) -> String {
    format!("{:02}:{:02}:{:02}",
        seconds / 3600,
        (seconds % 3600) / 60,
        seconds % 60
    )
}
```

### Render Optimization

```javascript
// React optimization techniques
const TimerDisplay = memo(({ time, state }) => {
  return <div className={`timer ${state}`}>{time}</div>;
});

// Minimize re-renders
const useTimerState = () => {
  return useMemo(
    () => ({
      time: formatTime(seconds),
      progress: calculateProgress(seconds, total),
      state: getTimerState(seconds),
    }),
    [seconds, total]
  );
};
```

### Bundle Size

```javascript
// Vite optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          timer: ["./src/timer.js"],
        },
      },
    },
    minify: "terser",
    sourcemap: false,
  },
});
```

---

## 🔮 Roadmap Técnico

### v1.1 Features

- **Config persistence**: SQLite database
- **Plugin system**: JavaScript API
- **REST API**: Remote control
- **WebSocket**: Real-time updates

### v1.2 Architecture

- **Microservices**: Separate timer engine
- **Database**: Advanced state management
- **Cloud sync**: User accounts
- **Mobile companion**: React Native app

### v2.0 Vision

- **Multi-instance**: Multiple timer support
- **Network sync**: Distributed timers
- **Advanced scheduling**: Calendar integration
- **Analytics**: Usage metrics

---

**🛠️ Esta documentación se mantiene actualizada con cada release. Para contribuir a la documentación, crea un PR con tus mejoras.**

_© 2025 MateCode. Licensed under MIT._

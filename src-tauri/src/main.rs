#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, GlobalShortcutManager, Manager, WindowBuilder, WindowUrl};

#[tauri::command]
fn emit_to_stage(app: AppHandle, event: String, payload: String) -> Result<(), String> {
    app.emit_to("stage", event.as_str(), payload)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn toggle_stage_fullscreen(app: AppHandle, on: bool) -> Result<(), String> {
    if let Some(win) = app.get_window("stage") {
        win.set_fullscreen(on).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn focus_stage(app: AppHandle) -> Result<(), String> {
    if let Some(win) = app.get_window("stage") {
        win.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn create_stage_window(app: AppHandle) -> Result<(), String> {
    // Check if stage window already exists
    if app.get_window("stage").is_some() {
        return Ok(());
    }

    // Create new stage window - start with a specific position on secondary monitor
    let _stage_window = WindowBuilder::new(&app, "stage", WindowUrl::App("/stage.html".into()))
        .title("Stage Display")
        .resizable(true)
        .fullscreen(false)
        .position(1920.0, 0.0) // Start at likely secondary monitor position
        .inner_size(1920.0, 1080.0) // Set a reasonable default size
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn position_stage_on_secondary_monitor(app: AppHandle) -> Result<(), String> {
    if let Some(stage_win) = app.get_window("stage") {
        // First, ensure window is not fullscreen to allow positioning
        stage_win.set_fullscreen(false).map_err(|e| e.to_string())?;

        // Get monitor information from main window
        if let Some(main_win) = app.get_window("main") {
            if let Ok(monitors) = main_win.available_monitors() {
                println!("Found {} monitors", monitors.len());

                // Print monitor info for debugging
                for (i, monitor) in monitors.iter().enumerate() {
                    println!(
                        "Monitor {}: position=({}, {}), size={}x{}",
                        i,
                        monitor.position().x,
                        monitor.position().y,
                        monitor.size().width,
                        monitor.size().height
                    );
                }

                if monitors.len() > 1 {
                    // Try to find secondary monitor
                    let secondary_monitor = monitors
                        .iter()
                        .find(|m| m.position().x != 0) // Not the primary monitor
                        .or_else(|| monitors.get(1)) // Or just take the second one
                        .unwrap_or(&monitors[0]); // Fallback to primary

                    let pos = secondary_monitor.position();
                    let size = secondary_monitor.size();

                    println!(
                        "Using monitor at position ({}, {}) with size {}x{}",
                        pos.x, pos.y, size.width, size.height
                    );

                    // Position and size the window to match the monitor
                    stage_win
                        .set_position(tauri::Position::Physical(tauri::PhysicalPosition {
                            x: pos.x,
                            y: pos.y,
                        }))
                        .map_err(|e| e.to_string())?;

                    stage_win
                        .set_size(tauri::Size::Physical(tauri::PhysicalSize {
                            width: size.width,
                            height: size.height,
                        }))
                        .map_err(|e| e.to_string())?;

                    // Show and focus the window
                    stage_win.show().map_err(|e| e.to_string())?;
                    stage_win.set_focus().map_err(|e| e.to_string())?;
                    stage_win.unminimize().map_err(|e| e.to_string())?;

                    // Give it a moment to position properly
                    std::thread::sleep(std::time::Duration::from_millis(300));

                    // Now make it fullscreen
                    stage_win.set_fullscreen(true).map_err(|e| e.to_string())?;

                    return Ok(());
                }
            }
        }

        // Fallback: assume standard dual monitor setup (1920x1080 primary + secondary)
        println!("Using fallback positioning for secondary monitor");

        stage_win
            .set_position(tauri::Position::Physical(tauri::PhysicalPosition {
                x: 1920,
                y: 0,
            }))
            .map_err(|e| e.to_string())?;

        stage_win
            .set_size(tauri::Size::Physical(tauri::PhysicalSize {
                width: 1920,
                height: 1080,
            }))
            .map_err(|e| e.to_string())?;

        stage_win.show().map_err(|e| e.to_string())?;
        stage_win.set_focus().map_err(|e| e.to_string())?;
        stage_win.unminimize().map_err(|e| e.to_string())?;

        std::thread::sleep(std::time::Duration::from_millis(300));

        stage_win.set_fullscreen(true).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn close_stage_window(app: AppHandle) -> Result<(), String> {
    if let Some(stage_win) = app.get_window("stage") {
        stage_win.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn get_monitor_info(app: AppHandle) -> Result<String, String> {
    if let Some(main_win) = app.get_window("main") {
        if let Ok(monitors) = main_win.available_monitors() {
            let mut info = format!("Found {} monitors:\n", monitors.len());
            for (i, monitor) in monitors.iter().enumerate() {
                info.push_str(&format!(
                    "Monitor {}: position=({}, {}), size={}x{}\n",
                    i,
                    monitor.position().x,
                    monitor.position().y,
                    monitor.size().width,
                    monitor.size().height
                ));
            }
            return Ok(info);
        }
    }
    Ok("Could not get monitor information".to_string())
}

#[tauri::command]
async fn send_notification(
    app: AppHandle,
    title: String,
    body: String,
    icon: Option<String>,
) -> Result<(), String> {
    use tauri::api::notification::Notification;

    let mut notification = Notification::new(&app.config().tauri.bundle.identifier)
        .title(title)
        .body(body);

    if let Some(icon_path) = icon {
        notification = notification.icon(icon_path);
    }

    notification.show().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn set_badge_label(label: Option<String>) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        use std::process::Command;

        if let Some(badge_text) = label {
            // Set badge text (for example, remaining time)
            let script = format!(
                r#"osascript -e 'tell application "System Events" to set the badge of application process "Stage Timer Pro" to "{}""#,
                badge_text
            );
            let _ = Command::new("sh").arg("-c").arg(&script).output();
        } else {
            // Clear badge
            let script = r#"osascript -e 'tell application "System Events" to set the badge of application process "Stage Timer Pro" to ""'"#;
            let _ = Command::new("sh").arg("-c").arg(script).output();
        }
    }

    Ok(())
}

#[tauri::command]
fn request_notification_permission(app: AppHandle) -> Result<String, String> {
    use tauri::api::notification::Notification;

    // En macOS, las notificaciones requieren permisos
    // Este comando verifica si tenemos permisos
    match Notification::new(&app.config().tauri.bundle.identifier)
        .title("Test")
        .body("Verificando permisos de notificación")
        .show()
    {
        Ok(_) => Ok("granted".to_string()),
        Err(e) => Ok(format!("denied: {}", e)),
    }
}

// Comandos para atajos globales
#[tauri::command]
fn register_global_shortcut(
    app: AppHandle,
    shortcut: String,
    action: String,
) -> Result<(), String> {
    let mut global_shortcut_manager = app.global_shortcut_manager();

    let app_handle = app.clone();
    let action_clone = action.clone();

    global_shortcut_manager
        .register(&shortcut, move || {
            let _ = app_handle.emit_all("global-shortcut", &action_clone);
        })
        .map_err(|e| format!("Failed to register shortcut {}: {}", shortcut, e))
}

#[tauri::command]
fn unregister_global_shortcut(app: AppHandle, shortcut: String) -> Result<(), String> {
    let mut global_shortcut_manager = app.global_shortcut_manager();

    global_shortcut_manager
        .unregister(&shortcut)
        .map_err(|e| format!("Failed to unregister shortcut {}: {}", shortcut, e))
}

#[tauri::command]
fn is_global_shortcut_registered(app: AppHandle, shortcut: String) -> Result<bool, String> {
    let global_shortcut_manager = app.global_shortcut_manager();
    Ok(global_shortcut_manager
        .is_registered(&shortcut)
        .unwrap_or(false))
}

// Comandos para integración con software de video (Resolume Arena, OBS, etc.)
#[tauri::command]
fn set_stage_for_capture(app: AppHandle, width: u32, height: u32) -> Result<(), String> {
    if let Some(stage_win) = app.get_window("stage") {
        // Configurar ventana para captura de video óptima
        stage_win.set_fullscreen(false).map_err(|e| e.to_string())?;

        // Tamaño estándar para video (1920x1080, 1280x720, etc.)
        stage_win
            .set_size(tauri::Size::Physical(tauri::PhysicalSize { width, height }))
            .map_err(|e| e.to_string())?;

        // Posicionar en una ubicación fija para facilitar captura
        stage_win
            .set_position(tauri::Position::Physical(tauri::PhysicalPosition {
                x: 100,
                y: 100,
            }))
            .map_err(|e| e.to_string())?;

        // Configurar ventana para captura
        stage_win
            .set_always_on_top(true)
            .map_err(|e| e.to_string())?;
        stage_win.set_resizable(false).map_err(|e| e.to_string())?;
        stage_win
            .set_title("Stage Timer - Video Capture")
            .map_err(|e| e.to_string())?;

        println!(
            "✅ Stage configurado para captura de video: {}x{}",
            width, height
        );
    }
    Ok(())
}

#[tauri::command]
fn reset_stage_window(app: AppHandle) -> Result<(), String> {
    if let Some(stage_win) = app.get_window("stage") {
        // Resetear configuración de la ventana
        stage_win
            .set_always_on_top(false)
            .map_err(|e| e.to_string())?;
        stage_win.set_resizable(true).map_err(|e| e.to_string())?;
        stage_win
            .set_title("Stage Display")
            .map_err(|e| e.to_string())?;

        println!("✅ Stage window resetted to normal mode");
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            emit_to_stage,
            toggle_stage_fullscreen,
            focus_stage,
            position_stage_on_secondary_monitor,
            create_stage_window,
            get_monitor_info,
            close_stage_window,
            send_notification,
            set_badge_label,
            request_notification_permission,
            register_global_shortcut,
            unregister_global_shortcut,
            is_global_shortcut_registered,
            set_stage_for_capture,
            reset_stage_window
        ])
        .setup(|app| {
            // Create stage window pointing to stage.html
            // Position it on secondary monitor using a reasonable offset
            WindowBuilder::new(app, "stage", WindowUrl::App("/stage.html".into()))
                .title("Stage Display")
                .resizable(true)
                .fullscreen(false) // Start windowed, then position and fullscreen
                .position(1920.0, 0.0) // Standard dual monitor setup assumption
                .build()?;

            // Registrar atajos globales por defecto
            let mut global_shortcut_manager = app.global_shortcut_manager();
            let app_handle = app.handle();

            // Cmd+Shift+Space para start/pause
            let app_clone = app_handle.clone();
            global_shortcut_manager
                .register("Cmd+Shift+Space", move || {
                    let _ = app_clone.emit_all("global-shortcut", "toggle-timer");
                })
                .map_err(|e| format!("Failed to register Cmd+Shift+Space: {}", e))?;

            // Cmd+Shift+R para reset
            let app_clone = app_handle.clone();
            global_shortcut_manager
                .register("Cmd+Shift+R", move || {
                    let _ = app_clone.emit_all("global-shortcut", "reset-timer");
                })
                .map_err(|e| format!("Failed to register Cmd+Shift+R: {}", e))?;

            // Cmd+Shift+F para toggle fullscreen del stage
            let app_clone = app_handle.clone();
            global_shortcut_manager
                .register("Cmd+Shift+F", move || {
                    let _ = app_clone.emit_all("global-shortcut", "toggle-stage-fullscreen");
                })
                .map_err(|e| format!("Failed to register Cmd+Shift+F: {}", e))?;

            println!("✅ Aplicación iniciada con atajos globales:");
            println!("   Cmd+Shift+Space: Start/Pause timer");
            println!("   Cmd+Shift+R: Reset timer");
            println!("   Cmd+Shift+F: Toggle stage fullscreen");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

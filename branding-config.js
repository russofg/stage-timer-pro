// 🎨 CONFIGURACIÓN DE BRANDING - STAGE TIMER PRO
// =====================================================
// Personaliza aquí los colores, logo y nombre de tu evento

export const brandingConfig = {
  // INFORMACIÓN DEL EVENTO
  // ---------------------
  eventName: "MI EVENTO 2025",           // Aparece en la parte superior del Stage
  
  // LOGO
  // ----
  // URL de tu logo (PNG/JPG recomendado, máx 200px altura)
  logo: "https://ejemplo.com/mi-logo.png",
  
  // MOSTRAR BRANDING
  // ----------------
  showBranding: true,                    // true = mostrar, false = ocultar
  
  // PALETA DE COLORES
  // -----------------
  colors: {
    primary: "#3B82F6",    // Color principal (logo, textos, bordes)
    secondary: "#10B981",  // Color timer en estado normal (verde)
    background: "#1F2937", // Color de fondo del Stage
    accent: "#F59E0B"      // Color para advertencias (amarillo)
    // NOTA: El color rojo para crítico se mantiene fijo para seguridad
  }
}

// PLANTILLAS PREDEFINIDAS
// ========================

// 🏢 CORPORATIVO ELEGANTE
export const corporateBlue = {
  eventName: "SUMMIT EMPRESARIAL 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#1E40AF",    // Azul corporativo
    secondary: "#059669",  // Verde éxito
    background: "#1E293B", // Gris corporativo
    accent: "#D97706"      // Naranja profesional
  }
}

// 🎪 ENTRETENIMIENTO VIBRANTE
export const entertainmentMagenta = {
  eventName: "FESTIVAL DE MÚSICA 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#DB2777",    // Magenta vibrante
    secondary: "#10B981",  // Verde neón
    background: "#0F0F23", // Púrpura oscuro
    accent: "#F59E0B"      // Amarillo neón
  }
}

// 🏥 MÉDICO/CIENTÍFICO
export const medicalGreen = {
  eventName: "CONGRESO MÉDICO 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#065F46",    // Verde médico
    secondary: "#059669",  // Verde claro
    background: "#1F2937", // Gris neutral
    accent: "#92400E"      // Marrón advertencia
  }
}

// 🎓 EDUCATIVO
export const educationalBlue = {
  eventName: "CONFERENCIA EDUCATIVA 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#1D4ED8",    // Azul académico
    secondary: "#059669",  // Verde conocimiento
    background: "#1E293B", // Gris educativo
    accent: "#D97706"      // Naranja atención
  }
}

// 🏃‍♂️ DEPORTIVO
export const sportsRed = {
  eventName: "COPA NACIONAL 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#DC2626",    // Rojo deportivo
    secondary: "#16A34A",  // Verde campo
    background: "#0F172A", // Azul noche
    accent: "#FBBF24"      // Amarillo advertencia
  }
}

// 💼 TECNOLOGÍA
export const techCyan = {
  eventName: "TECH CONFERENCE 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#0891B2",    // Cian tech
    secondary: "#059669",  // Verde digital
    background: "#0C1222", // Azul oscuro tech
    accent: "#F59E0B"      // Amarillo warning
  }
}

// 🎭 CULTURAL/ARTÍSTICO
export const culturalPurple = {
  eventName: "FESTIVAL CULTURAL 2025",
  logo: "",
  showBranding: true,
  colors: {
    primary: "#7C3AED",    // Púrpura artístico
    secondary: "#059669",  // Verde vida
    background: "#1E1B3A", // Púrpura oscuro
    accent: "#F59E0B"      // Dorado advertencia
  }
}

// INSTRUCCIONES DE USO
// ====================

/*
1. PERSONALIZACIÓN BÁSICA:
   - Cambia 'eventName' por el nombre de tu evento
   - Reemplaza 'logo' con la URL de tu logo
   - Ajusta los colores en 'colors' usando códigos hex (#RRGGBB)

2. USAR PLANTILLA PREDEFINIDA:
   - Copia una de las plantillas de arriba
   - Personaliza el 'eventName' y 'logo'
   - Ajusta colores si es necesario

3. COLORES PERSONALIZADOS:
   - primary: Color principal para textos y logo
   - secondary: Color del timer en estado normal
   - background: Color de fondo de toda la pantalla
   - accent: Color para advertencias (estado yellow)
   
4. APLICAR CONFIGURACIÓN:
   - Ve al Dashboard de la aplicación
   - Sección "🎨 Branding del Evento"
   - Ingresa los valores manualmente
   - O importa esta configuración si está integrada

CONSEJOS DE DISEÑO:
- Usa colores con buen contraste sobre fondo oscuro
- El logo debe ser rectangular (no cuadrado) para mejor visualización
- Testa los colores en pantalla grande antes del evento
- primary y accent deben contrastar bien con background
*/

// COLORES RECOMENDADOS POR TIPO DE EVENTO
// =======================================

/*
CORPORATIVO: Azules, grises, blancos
ENTRETENIMIENTO: Magentas, cianes, amarillos
DEPORTIVO: Rojos, verdes, azules
EDUCATIVO: Azules, verdes, marrones
TECNOLOGÍA: Cianes, púrpuras, verdes
MÉDICO: Verdes, azules, blancos
CULTURAL: Púrpuras, dorados, rojos
*/

# 🚨 Portal de Emergencia Integral (Manual Táctico)

**URL en vivo:** [https://javitron112-debug.github.io/Portal-de-Emergencia-Integral/](https://javitron112-debug.github.io/Portal-de-Emergencia-Integral/)

## 📝 Descripción General

El **Portal de Emergencia Integral** es una aplicación web progresiva (PWA) diseñada para ofrecer asistencia crítica, protocolos de supervivencia y localización de recursos en situaciones de emergencia grave o escenarios *Grid-Down* (caída total de redes eléctricas y de telecomunicaciones). 

Su arquitectura está pensada para ser **instalable en dispositivos móviles y funcionar 100% offline**, garantizando que el usuario tenga acceso a información vital para la vida incluso cuando no hay acceso a Internet.

---

## 🛠️ Utilidad y Herramientas Principales

La aplicación se divide en cuatro pilares fundamentales de supervivencia y asistencia ciudadana:

### 1. 🎒 Mochila de 72 Horas (Checklist Interactivo)
Una lista de control exhaustiva basada en los estándares oficiales de Protección Civil y la Cruz Roja. 
* **Utilidad:** Permite a los ciudadanos preparar y auditar su equipo de evacuación o aislamiento.
* **Características:** Incluye categorías de Hidratación, Refugio/Ropa, Iluminación/Fuego, Herramientas, Botiquín y Documentos. Cuenta con una barra de progreso que guarda automáticamente el estado en el dispositivo del usuario.

### 2. 📻 Plan 333 (Comunicaciones Radio)
Un protocolo operativo de radiocomunicaciones de emergencia para la población civil en caso de aislamiento tecnológico.
* **Utilidad:** Optimiza al máximo la batería de los transmisores (walkie-talkies PMR446 o CB-27) estableciendo ventanas de comunicación globales.
* **Características:** Incluye un temporizador en tiempo real que indica exactamente cuándo encender el equipo (Canal 3, cada 3 horas, durante 3 minutos) para coordinar escucha, emergencias y logística.

### 3. 🗺️ Mapa Táctico de Emergencias
Un buscador GPS avanzado conectado a la base de datos de OpenStreetMap que localiza infraestructura crítica en un radio de 2 a 5 kilómetros.
* **Utilidad:** Permite encontrar rápidamente la Comisaría de Policía, Estación de Bomberos, base de Protección Civil o puesto de Cruz Roja más cercano.
* **Características:** Funciona mediante búsqueda por dirección o geolocalización GPS directa. Si el usuario ha descargado los mapas de Google Maps previamente, el sistema de navegación hacia el recurso funcionará sin conexión a Internet.

### 4. 🩹 Primeros Auxilios (Protocolos P.A.S.)
Guías visuales y directas para intervenciones de vida o muerte por parte de personal no sanitario.
* **Utilidad:** Ofrece instrucciones inmediatas y fácticas sobre cómo actuar en los primeros minutos de una emergencia médica.
* **Características:** Incluye el algoritmo universal P.A.S. (Proteger, Avisar, Socorrer), protocolos detallados de Reanimación Cardiopulmonar (RCP) y maniobras para atragantamiento (Heimlich), diferenciados por edad: Adultos, Niños (1-8 años) y Bebés (<1 año).

---

## ⚙️ Características Técnicas Críticas

* **PWA (Progressive Web App):** A través del archivo `manifest.json` y el motor `sw.js` (Service Worker), la web se instala como una app nativa en Android/iOS.
* **Tolerancia a fallos 504:** El mapa táctico cuenta con un sistema de redundancia de múltiples servidores internacionales para evitar caídas en caso de saturación de la red.
* **Cero dependencias externas:** Tras la primera carga, todos los textos, imágenes y lógicas se alojan en la caché profunda del dispositivo.

---
*Documento generado para fines de preparación ciudadana. Se recomienda verificar siempre los protocolos con el 112 y las autoridades locales de Protección Civil.*

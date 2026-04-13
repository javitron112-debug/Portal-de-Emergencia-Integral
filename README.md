#🚨 Portal de Emergencia Integral (PWA)#

⚠️ AVISO LEGAL CRÍTICO: Este proyecto es una versión de pruebas en fase de desarrollo. Los protocolos y guías aquí descritos tienen un carácter puramente informativo. Toda la responsabilidad derivada del uso de esta herramienta, así como de la ejecución de cualquier maniobra de primeros auxilios o protocolo de emergencia, recae exclusiva y totalmente sobre el usuario. Consulte siempre con el 112 y con los servicios de emergencia profesionales autorizados.

📝 Descripción del Proyecto

El Portal de Emergencia Integral es una Aplicación Web Progresiva (PWA) táctica diseñada para asistir a la población civil en situaciones de emergencia grave o escenarios Grid-Down (caída total de la red eléctrica y de telecomunicaciones).

Su arquitectura está construida bajo una filosofía estrictamente Offline-First. Una vez instalada, la aplicación no requiere conexión a Internet ni acceso a servidores externos, garantizando que las herramientas y protocolos vitales estén siempre disponibles en el dispositivo del usuario en el peor de los escenarios.

🛠️ Utilidad y Módulos Principales

La herramienta se estructura en cuatro pilares fundamentales de supervivencia y asistencia operativa:

1. 🎒 Mochila de 72 Horas

Sistema de auditoría para preparar el equipo de evacuación o aislamiento.

Características: Checklist interactivo categorizado (Hidratación, Alimentación, Iluminación, Botiquín, etc.). Cuenta con persistencia de datos local (el progreso no se pierde al cerrar la app) e infografías de referencia visual rápida.

2. 📻 Protocolo Plan 333 (Comunicaciones)

Estandarización de comunicaciones por radio para priorizar el ahorro crítico de batería.

Características: Cronómetro inteligente que calcula las ventanas operativas (Canal 3, cada 3 horas, durante 3 minutos). Incluye tablas de frecuencias de uso libre (PMR446) y Banda Ciudadana (CB-27), además de directrices de disciplina de radio.

3. 🩹 Protocolos de Auxilio

Guías de intervención rápida y directa para emergencias médicas de riesgo vital por parte de personal no sanitario.

Características: Algoritmo P.A.S. (Proteger, Avisar, Socorrer), evaluación de consciencia y respiración, soporte vital básico (RCP) y desobstrucción de vía aérea (Heimlich) con infografías divididas por edad (Adultos, Niños, Bebés). Incluye protocolo de control de hemorragias masivas.

4. 🆘 Baliza S.O.S

Herramienta de último recurso para facilitar la localización y el rescate del usuario.

Características: Integra una señal lumínica estroboscópica (patrón Morse), una alarma acústica penetrante (onda cuadrada a 800 Hz) y un disparador táctico que redacta un SMS automático con la ubicación GPS exacta hacia un número de contacto predefinido.

⚙️ Arquitectura Técnica

100% Autónoma: Todo el diseño y la lógica (HTML, Tailwind CSS, JS) reside en un único archivo de ejecución. Cero dependencias externas en tiempo de ejecución.

PWA Instalable: Utiliza un manifest.json y un Service Worker (sw.js) a prueba de fallos para instalarse en el escritorio de dispositivos Android, iOS y sistemas de escritorio.

Privacidad y Seguridad: La aplicación no utiliza bases de datos en la nube ni telemetría. Toda la configuración del usuario se almacena localmente mediante localStorage.

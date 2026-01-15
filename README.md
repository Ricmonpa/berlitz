# Berlitz Banner - Versión B (Lead Generation)

Banner interactivo 300x600 para Berlitz México con captura de leads cualificados.

## 🎯 Especificaciones Técnicas

- **Formato:** HTML5 Rich Media
- **Dimensiones:** 300x600px
- **Peso total:** <200KB (HTML+CSS+JS)
- **Compatibilidad:** DV360, CM360, Google Marketing Platform
- **clickTag:** ✅ Sí (variable global estándar)
- **Permisos especiales:** Micrófono (Web Speech API)

## 📊 Características

- 3 frases de pronunciación con dificultad progresiva
- Formulario de captura: Nombre, Email, Teléfono, Empresa
- Análisis detallado de nivel de inglés por frase
- Web Speech API para reconocimiento de voz en tiempo real
- Fallback automático si el micrófono falla o es denegado
- Score promedio basado en 3 evaluaciones

## 🚀 Deployment

- **Demo en vivo:** https://berlitz-leadgen.potenttial.site
- **Repositorio:** https://github.com/Ricmonpa/berlitz-leadgen
- **Hosting:** Cloudflare Pages
- **Para DV360:** Empaquetar HTML+CSS+JS en ZIP (sin carpetas)

## 📁 Estructura de archivos

```
berlitz-leadgen/
├── index.html    - Estructura del banner (7 slides)
├── styles.css    - Estilos Berlitz brand
├── script.js     - Lógica de reconocimiento, scoring y clickTag
└── README.md     - Esta documentación
```

## 🔧 Variables para Ad Server

**clickTag** - URL de destino final (modificable desde DV360/CM360)

Todos los botones CTA apuntan a esta variable mediante `handleClickTag()`

## ✅ Testing local

1. Abrir `index.html` en Google Chrome (requerido para Web Speech API)
2. Permitir acceso al micrófono cuando el navegador lo solicite
3. Probar las 3 frases de pronunciación
4. Completar el formulario de captura
5. Verificar en console que los datos se capturen correctamente
6. Verificar que el CTA final abra la URL del clickTag

## 📝 Notas para equipo de tráfico

- El banner requiere HTTPS para acceso al micrófono (política de navegadores)
- En DV360, configurar como "HTML5 Banner" o "HTML5 Expanding"
- Declarar uso de micrófono en creative review/aprobación
- El clickTag es estándar y puede sobrescribirse desde la plataforma

## 🎨 Frases de evaluación

- **Nivel Básico:** "We need to schedule a meeting for next Monday"
- **Nivel Intermedio:** "We need to leverage our synergies to maximize ROI"
- **Nivel Avanzado:** "Our Q4 projections indicate significant EBITDA growth despite macroeconomic headwinds"

## 📧 Lead capture

Los datos capturados se loguean en console (modo demo).

Para producción, integrar con:

- Webhook a Zapier/Make
- HubSpot API
- Salesforce
- Google Sheets
- O el CRM que use Berlitz


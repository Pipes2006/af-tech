# AF Tech — Soluciones Digitales

Sitio web oficial de **AF Tech**, enfocado en tres líneas de servicio:

1. **Generación de Imágenes con IA para Publicidad** (`servicio-ia.html`)
2. **Diseño de Páginas Web adaptado a cualquier negocio** (`servicio-desarrollo.html`)
3. **Soporte Técnico IT (Windows, Office y mantenimiento)** (`servicio-soporte.html`)

URL publicada (GitHub Pages): `https://pipes2006.github.io/af-tech/`

## Estructura del proyecto

- `index.html` — Página principal con identidad AF Tech y acceso a las tres líneas de servicio
- `servicio-ia.html` — Catálogo y planes de publicidad visual con Inteligencia Artificial
- `servicio-desarrollo.html` — Diseño web adaptable a cualquier sector o negocio
- `servicio-soporte.html` — Soporte técnico IT, mantenimiento y seguridad básica
- `proyectos.html` — Portafolio interactivo con filtros por categoría
- `nosotros.html` — Historia, identidad de marca y valores de AF Tech
- `contacto.html` — Formulario validado con selector de servicio conectado a WhatsApp (`+57 312 412 0017`)
- `components/navbar.html` y `components/footer.html` — Componentes reutilizables cargados de forma segura
- `css/styles.css` — Sistema de diseño moderno responsive en blanco, azul y gris
- `js/main.js` — Carga segura de componentes, filtros, animaciones y validación de formulario
- `images/brand/` — Logotipo oficial vectorial (`af-tech-logo.svg`, `favicon.svg`) y versión de alta resolución (`af-tech-logo.jpg`)
- `images/ai-ads/` — Muestras comerciales generadas con IA
- `.well-known/security.txt` y `robots.txt` — Archivos estándar de seguridad e indexación

## Medidas de seguridad aplicadas

- **Subresource Integrity (SRI)** y `crossorigin="anonymous"` en los activos externos de Bootstrap 5.3.3.
- **Content Security Policy (CSP)** sin `'unsafe-inline'` ni `'unsafe-eval'` en todas las páginas HTML.
- **Referrer-Policy** (`strict-origin-when-cross-origin`) y enlaces externos endurecidos con `rel="noopener noreferrer"`.
- **Carga segura de componentes** en `js/main.js` con lista blanca de rutas y saneamiento vía `DOMParser`.
- **Validación y protección anti-spam** en el formulario de contacto (límites de longitud, honeypot y enfriamiento entre envíos).

## Desarrollo local

Para previsualizar el sitio correctamente (necesario para `fetch()` de `navbar` y `footer`):

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.

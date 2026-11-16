# Invitación digital — Culto especial de bienvenida (La Luz Verdadera)

Un sobre animado que el visitante abre para descubrir una invitación cuadrada al culto especial de bienvenida para nuevos creyentes (sábado 28 de noviembre, 6:00 p. m.). Funciona en teléfonos y computadoras, sin iniciar sesión, sin base de datos y sin pagos.

## Personalizar el contenido

Abre `script.js` y edita el objeto `CONFIG` del principio:

- `churchName`, `envelopeTag`, `eyebrow`, `title`: textos del sobre y encabezado de la carta.
- `verse` y `reference`: versículo y cita.
- `event`: la fecha que destaca en la carta (`label`, `day`, `time`, `place`). Para el botón del calendario, cambia también `start` y `end` (formato `AAAA-MM-DDTHH:MM`, hora de República Dominicana).
- `pledgeStrong` y `pledgeText`: el texto de compromiso.
- `rsvp` y `rsvpDone`: texto del botón antes y después de tocarlo.
- `closing` y `signature`: despedida y firma.

## El botón «Sí, estaré ahí»

Al tocarlo, el botón cambia a «Tu lugar está apartado» y se descarga un archivo de calendario (.ics) con el culto y un recordatorio dos horas antes. No se guarda ni se envía ningún dato a nadie.

## Publicar gratis con Netlify

1. Entra en https://app.netlify.com/drop.
2. Arrastra la carpeta `carta-bienvenida` (no un ZIP) al área de publicación.
3. Netlify generará un enlace público terminado en `netlify.app`.
4. Comparte ese enlace por WhatsApp, redes sociales o código QR.
5. Después de publicar, cambia en `index.html` las direcciones de `og:url`, `og:image` y `twitter:image` por la dirección real, para que la vista previa salga bien al compartir.

## Archivos

- `index.html`: estructura y datos para compartir.
- `styles.css`: diseño; la carta es siempre cuadrada y se escala completa en cualquier pantalla.
- `script.js`: textos editables, animación y botón de calendario.
- `preview.jpg`: imagen cuadrada (1200×1200) que aparece al compartir el enlace.

# Carta digital de bienvenida — Iglesia La Luz Verdadera

Una experiencia web interactiva: el visitante abre un sobre animado y descubre una carta de bienvenida. Funciona en teléfonos y computadoras, sin iniciar sesión, sin base de datos y sin pagos.

## Personalizar el contenido

Abre `script.js` y modifica el objeto `CONFIG` que aparece al principio:

- `churchName`: nombre que aparece encima del sobre.
- `title`, `greeting`, `paragraphs`: título y mensaje de la carta.
- `verse` y `reference`: texto y referencia bíblica.
- `signature` y `address`: firma y dirección de la iglesia.
- `schedule`: horarios reales. Agrega elementos con este formato:

```js
schedule: [
  { day: "Domingo", activity: "Culto de adoración", time: "6:00 p. m." },
  { day: "Miércoles", activity: "Servicio de oración", time: "7:00 p. m." }
]
```

Si `schedule` está vacío, la sección de horarios no aparece. Revisa y confirma los horarios y datos de contacto antes de publicar.

## Publicar gratis con Netlify

1. Descomprime `carta-bienvenida.zip`.
2. Entra en https://app.netlify.com/drop.
3. Arrastra la carpeta `carta-bienvenida` (no el ZIP) al área de publicación.
4. Netlify generará un enlace público terminado en `netlify.app`.
5. Comparte ese enlace por WhatsApp, redes sociales o código QR.

## Archivos

- `index.html`: estructura y contenido semántico.
- `styles.css`: diseño, sobre, carta y animaciones adaptables.
- `script.js`: textos editables y comportamiento de abrir/cerrar.

No requiere instalación ni servidor propio. Las fuentes decorativas se cargan desde Google Fonts; si no hay conexión, se usan fuentes alternativas del dispositivo.

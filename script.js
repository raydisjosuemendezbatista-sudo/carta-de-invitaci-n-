/* =====================================================
   CONFIGURACIÓN — edita aquí todos los textos y la fecha
   ===================================================== */
const CONFIG = {
  churchName: "Iglesia de Dios Pentecostal La Luz Verdadera",
  envelopeTag: "Una invitación especial para ti",
  eyebrow: "INVITACIÓN ESPECIAL",
  title: "ESTÁS INVITADO",
  verse: "«…si alguno está en Cristo, nueva criatura es…»",
  reference: "2 Corintios 5:17 (RVR1960)",

  // La fecha y la hora que destacan en la carta
  event: {
    label: "Culto especial de bienvenida para nuevos creyentes",
    day: "Sábado 28 de noviembre",
    time: "6:00 p. m.",
    place: "Prolongación Avenida Luperón #75, Pueblo Nuevo, Barahona",
    // Para el botón «Apartar la fecha» (hora de República Dominicana)
    start: "2026-11-28T18:00",
    end: "2026-11-28T20:00",
    calendarTitle: "Culto especial de bienvenida – La Luz Verdadera",
    // Color de camiseta para ese día
    dress: "Ese día: camiseta blanca o negra"
  },

  // WhatsApp que recibe las confirmaciones (código de país + número, sin + ni espacios)
  whatsapp: "18493508676",
  whatsappMessage: "Hola, confirmo que sí estaré ahí en el culto de bienvenida del sábado 28 de noviembre.",

  // Texto de compromiso
  pledgeStrong: "Nos comprometemos a recibirte con amor.",
  pledgeText: "Aparta esta fecha y ven con el corazón dispuesto.",
  rsvp: "SÍ, ESTARÉ AHÍ",
  rsvpDone: "✓ TU LUGAR ESTÁ APARTADO",

  closing: "Con amor fraternal,",
  signature: "Iglesia La Luz Verdadera"
};

/* ===================== Lógica ===================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const scene = $("scene"), letter = $("letter"), clip = $("letterClip");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 20 : ms));
  let state = "closed", busy = false;
  const E = CONFIG.event;

  // Rellena la carta con la configuración (textContent: sin HTML inyectado)
  $("church").textContent = CONFIG.churchName;
  $("tag").textContent = CONFIG.envelopeTag;
  $("eyebrow").textContent = CONFIG.eyebrow;
  $("title").textContent = CONFIG.title;
  $("verse").textContent = CONFIG.verse;
  $("ref").textContent = CONFIG.reference;
  $("evLabel").textContent = E.label;
  $("evDay").textContent = E.day;
  $("evTime").textContent = E.time;
  $("evPlace").textContent = E.place;
  $("evDress").textContent = E.dress;
  $("pledgeStrong").textContent = CONFIG.pledgeStrong;
  $("pledgeText").textContent = CONFIG.pledgeText;
  $("rsvp").textContent = CONFIG.rsvp;
  $("closing").textContent = CONFIG.closing;
  $("sign").textContent = CONFIG.signature;

  // «Sí, estaré ahí»: compromiso + archivo de calendario (.ics) con recordatorio
  function toUTC(local) { // la hora local de República Dominicana es UTC-4 todo el año
    return new Date(local + ":00-04:00").toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  // Texto para .ics: escapa comas, punto y coma y saltos de línea
  const esc = (t) => String(t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  // Las líneas del .ics no pueden pasar de 75 bytes: se parten con un espacio al inicio de la siguiente
  function fold(line) {
    const enc = new TextEncoder(), parts = [];
    let cur = "", len = 0, limit = 75;
    for (const ch of line) {
      const n = enc.encode(ch).length;
      if (len + n > limit) { parts.push(cur); cur = ""; len = 0; limit = 74; }
      cur += ch; len += n;
    }
    parts.push(cur);
    return parts.join("\r\n ");
  }
  function downloadCalendar() {
    const desc = "Estás invitado al culto especial de bienvenida. " + CONFIG.pledgeText + " " + E.dress + ". " + CONFIG.churchName + ".";
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La Luz Verdadera//Invitacion//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:bienvenida-" + E.start.replace(/\D/g, "") + "@laluzverdadera",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
      "DTSTART:" + toUTC(E.start), "DTEND:" + toUTC(E.end),
      "SUMMARY:" + esc(E.calendarTitle),
      "LOCATION:" + esc(E.place + ", República Dominicana"),
      "DESCRIPTION:" + esc(desc),
      "STATUS:CONFIRMED", "TRANSP:OPAQUE", "SEQUENCE:0",
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:" + esc("Hoy a las " + E.time + ": " + E.calendarTitle), "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].map(fold);
    const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "culto-de-bienvenida.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function openWhatsApp() {
    const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  }
  $("rsvp").addEventListener("click", () => {
    const b = $("rsvp");
    const first = !b.classList.contains("done");
    b.classList.add("done"); b.textContent = CONFIG.rsvpDone;
    if (first) { try { downloadCalendar(); } catch (e) { /* si el dispositivo no lo permite, la confirmación igual se envía */ } }
    openWhatsApp(); // envía la confirmación al WhatsApp de la iglesia (también si tocan de nuevo)
  });

  // Calcula tamaños según la pantalla (escala inicial, subida y posición final)
  function measure() {
    // La hoja cabe DENTRO del sobre: 66% de su ancho (antes 88%, más grande que el sobre)
    const s0 = (scene.offsetWidth * 0.66) / letter.offsetWidth;
    const vtop = scene.getBoundingClientRect().top;
    const top = vtop + window.scrollY;
    const H = scene.offsetHeight, h = letter.offsetHeight * s0;
    // Sube lo suficiente para quedar TOTALMENTE fuera del bolsillo (sin salirse por arriba de la pantalla)
    const rise = Math.max(Math.round(0.12 * H - h), -Math.round(vtop + 0.06 * H - 10));
    // Centra la carta en la pantalla (deja espacio abajo para el botón de cerrar)
    const y = Math.max(16, Math.round((window.innerHeight - letter.offsetHeight - 60) / 2));
    scene.style.setProperty("--s0", s0.toFixed(3));
    scene.style.setProperty("--rise", rise + "px");
    scene.style.setProperty("--fy", Math.round(y - top - scene.offsetHeight * 0.06) + "px");
  }

  async function open() {
    if (busy || state !== "closed") return;
    busy = true; measure();
    clip.classList.add("show");
    scene.classList.add("seal-off");   await wait(600);  // 1. desaparece el sello
    scene.classList.add("flap-open");  await wait(950);  // 2. se abre la solapa
    scene.classList.add("rise");       await wait(1250); // 3. la hoja sube del sobre
    scene.classList.add("out");                          // 4. la hoja se despliega
    document.body.style.minHeight = letter.offsetHeight + 120 + "px";
    await wait(1550);
    clip.removeAttribute("aria-hidden");
    state = "open"; busy = false;
  }

  async function close() {
    if (busy || state !== "open") return;
    busy = true;
    clip.setAttribute("aria-hidden", "true");
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); await wait(500);
    measure();
    scene.classList.add("ret");                            // la hoja sigue por encima del sobre
    scene.classList.remove("out");       await wait(1500); // se encoge; el sobre reaparece detrás
    document.body.style.minHeight = "";
    scene.classList.remove("ret");                         // ahora sí queda detrás del bolsillo
    scene.classList.remove("rise");      await wait(1250); // baja y entra al sobre
    scene.classList.remove("flap-open"); await wait(950);  // se cierra la solapa
    clip.classList.remove("show");
    scene.classList.remove("seal-off");  await wait(500);  // vuelve el sello
    state = "closed"; busy = false;
  }

  $("open").addEventListener("click", open);
  $("again").addEventListener("click", close);
  window.addEventListener("resize", () => { if (state === "closed") measure(); });
  measure();
})();

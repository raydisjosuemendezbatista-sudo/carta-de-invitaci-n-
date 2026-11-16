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
    calendarTitle: "Culto especial de bienvenida – La Luz Verdadera"
  },

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
  $("pledgeStrong").textContent = CONFIG.pledgeStrong;
  $("pledgeText").textContent = CONFIG.pledgeText;
  $("rsvp").textContent = CONFIG.rsvp;
  $("closing").textContent = CONFIG.closing;
  $("sign").textContent = CONFIG.signature;

  // «Sí, estaré ahí»: compromiso + archivo de calendario (.ics) con recordatorio
  function toUTC(local) { // la hora local de República Dominicana es UTC-4 todo el año
    return new Date(local + ":00-04:00").toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  function downloadCalendar() {
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La Luz Verdadera//Invitacion//ES", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:bienvenida-" + E.start.replace(/\D/g, "") + "@laluzverdadera",
      "DTSTAMP:" + toUTC(new Date().toISOString().slice(0, 16)),
      "DTSTART:" + toUTC(E.start), "DTEND:" + toUTC(E.end),
      "SUMMARY:" + E.calendarTitle,
      "LOCATION:" + E.place + ", República Dominicana",
      "DESCRIPTION:Estás invitado. Aparta esta fecha y ven con el corazón dispuesto.",
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Hoy: " + E.calendarTitle, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "culto-de-bienvenida.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  $("rsvp").addEventListener("click", () => {
    const b = $("rsvp");
    if (b.classList.contains("done")) return;
    b.classList.add("done"); b.textContent = CONFIG.rsvpDone;
    try { downloadCalendar(); } catch (e) { /* si el dispositivo no lo permite, el compromiso igual queda hecho */ }
  });

  // Calcula tamaños según la pantalla (escala inicial, subida y posición final)
  function measure() {
    const s0 = (scene.offsetWidth * 0.88) / letter.offsetWidth;
    const top = scene.getBoundingClientRect().top + window.scrollY;
    // Centra la carta en la pantalla (deja espacio abajo para el botón de cerrar)
    const y = Math.max(16, Math.round((window.innerHeight - letter.offsetHeight - 60) / 2));
    scene.style.setProperty("--s0", s0.toFixed(3));
    scene.style.setProperty("--rise", -Math.round(scene.offsetHeight * 0.5) + "px");
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
    scene.classList.remove("out");       await wait(1550); // la hoja vuelve a su tamaño
    document.body.style.minHeight = "";
    scene.classList.remove("rise");      await wait(1250); // entra al sobre
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

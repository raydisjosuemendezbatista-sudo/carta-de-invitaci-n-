/* =====================================================
   CONFIGURACIÓN — edita aquí todos los textos y horarios
   ===================================================== */
const CONFIG = {
  churchName: "Iglesia de Dios Pentecostal La Luz Verdadera Inc. · Discípulos de Cristo",
  title: "BIENVENIDOS A LA FAMILIA DE CRISTO",
  greeting: "Queridos hermanos Arnold y Daneiri:",
  paragraphs: [
    "Nos alegra recibirlos y saber que se acercan a Jesucristo. No están solos: aquí tienen una familia dispuesta a caminar, orar y crecer con ustedes en la fe.",
    "Los invitamos a un culto preparado especialmente para darles la bienvenida."
  ],
  verse: "«De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas». ",
  reference: "2 Corintios 5:17 (RVR1960)",
  closing: "Con amor fraternal,",
  signature: "Discípulos de Cristo · Iglesia La Luz Verdadera",
  address: "Prolongación Avenida Luperón #75, Pueblo Nuevo, Barahona, República Dominicana.",
  scheduleTitle: "TE ESPERAMOS",
  schedule: [
    { day: "Sábado 28 de noviembre", activity: "Culto de bienvenida para Arnold y Daneiri", time: "6:00 p. m." }
  ]
};

/* ===================== Lógica ===================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const scene = $("scene"), letter = $("letter"), clip = $("letterClip");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 20 : ms));
  let state = "closed", busy = false;

  // Rellena la carta con la configuración (textContent: sin HTML inyectado)
  $("church").textContent = CONFIG.churchName;
  $("title").textContent = CONFIG.title;
  $("verse").textContent = CONFIG.verse;
  $("ref").textContent = CONFIG.reference;
  $("closing").textContent = CONFIG.closing;
  $("sign").textContent = CONFIG.signature;
  $("address").textContent = CONFIG.address;
  const body = $("body");
  const add = (cls, txt) => { const p = document.createElement("p"); p.className = cls; p.textContent = txt; body.appendChild(p); };
  add("greet", CONFIG.greeting);
  CONFIG.paragraphs.forEach((t) => add("para", t));
  const ul = $("schedule");
  document.querySelector(".schedule h2").textContent = CONFIG.scheduleTitle;
  if (!CONFIG.schedule.length) $("scheduleSection").hidden = true;
  CONFIG.schedule.forEach((s) => {
    const li = document.createElement("li");
    const b = document.createElement("b"); b.textContent = s.day;
    li.append(b, s.time ? s.activity + " — " + s.time : s.activity);
    ul.appendChild(li);
  });

  // Calcula tamaños según la pantalla (escala inicial, subida y posición final)
  function measure() {
    const s0 = (scene.offsetWidth * 0.88) / letter.offsetWidth;
    const top = scene.getBoundingClientRect().top + window.scrollY;
    scene.style.setProperty("--s0", s0.toFixed(3));
    scene.style.setProperty("--rise", -Math.round(scene.offsetHeight * 0.5) + "px");
    scene.style.setProperty("--fy", Math.round(24 - top - scene.offsetHeight * 0.06) + "px");
  }

  async function open() {
    if (busy || state !== "closed") return;
    busy = true; measure();
    clip.classList.add("show");
    scene.classList.add("seal-off");   await wait(600);  // 1. desaparece el sello
    scene.classList.add("flap-open");  await wait(950);  // 2. se abre la solapa
    scene.classList.add("rise");       await wait(1250); // 3. la hoja sube del sobre
    scene.classList.add("out");                          // 4. la hoja se despliega
    document.body.style.minHeight = letter.offsetHeight + 60 + "px";
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

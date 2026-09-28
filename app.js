/* ============================================================================
   VELOX — app.js
   ----------------------------------------------------------------------------
   Sommaire :
     1) Catégories (couleurs & icônes)
     2) VOS FICHIERS  ← c'est ici que vous ajoutez vos contenus
     3) Petits outils
     4) État global
     5) Rendus (spectre, catalogue, statistiques)
     6) Téléchargement (progression + compteur persistant)
     7) Panneau de détails, notifications
     8) Initialisation & interactions
     9) PWA — enregistrement du Service Worker
   ============================================================================ */

/* ============================================================================
   1) CATÉGORIES — la couleur de chaque type de contenu
   ============================================================================ */
const CATS = {
  video : { label: "Vidéos",  color: "#9d6bff", icon: "film"  },
  image : { label: "Images",  color: "#4da3ff", icon: "image" },
  pdf   : { label: "PDF",     color: "#ff4d5e", icon: "file"  },
  apk   : { label: "APK",     color: "#3ddc84", icon: "phone" },
  apkpro: { label: "APK Pro", color: "#f2b441", icon: "star"  },
};

/* ============================================================================
   2) VOS FICHIERS — C'EST ICI QUE VOUS AJOUTEZ VOS CONTENUS
   ----------------------------------------------------------------------------
   Pour chaque fichier, renseignez :
     id        : identifiant unique (ne le modifiez plus après création)
     type      : "video" | "image" | "pdf" | "apk" | "apkpro"
     title     : nom affiché dans le catalogue
     desc      : courte description (une ligne)
     sizeBytes : taille en octets — 1 Mo = 1048576 (ex : 32 Mo = 33554432)
     url       : emplacement du fichier :
                   • fichier local  -> "media/mon-application.apk"
                     (créez un dossier « media » à côté de index.html
                      et déposez-y vos fichiers)
                   • lien externe   -> "https://exemple.com/fichier.mp4"
     date      : date d'ajout au format "AAAA-MM-JJ"
     downloads : compteur de départ affiché (preuve sociale)
     tag       : (optionnel) petit badge libre, ex : "4K", "EXCLU"
   ============================================================================ */
const FILES = [
  { id:"vid-01", type:"video", title:"AMEGANVI — Montage vidéo cinématique",
    desc:"Formation complète de 44:39 : étalonnage, sound design et narration visuelle.",
    sizeBytes:771751936, url:"https://ia601805.us.archive.org/21/items/ameganvi-zihoue/AMEGANVI%20Zihoué.mp4", date:"2026-09-28", downloads:3182 },

  { id:"vid-02", type:"video", title:"Pack d'effets — 45 transitions 4K",
    desc:"Transitions 4K prêtes à l'emploi pour Premiere Pro et DaVinci Resolve.",
    sizeBytes:224395264, url:"media/pack-transitions-4k.mp4", date:"2025-11-15", downloads:1891 },

  { id:"vid-03", type:"video", title:"Documentaire — Les coulisses du studio",
    desc:"Vidéo exclusive 1080p sur la fabrication de nos packs premium.",
    sizeBytes:536870912, url:"media/documentaire-studio.mp4", date:"2025-10-30", downloads:927 },

  { id:"img-01", type:"image", title:"Fond d'écran — Sommets enneigés (4K)",
    desc:"Wallpaper 4K haute définition, optimisé pour les écrans OLED.",
    sizeBytes:8388608, url:"https://picsum.photos/seed/velox-neige/1920/1080.jpg",
    date:"2025-12-02", downloads:2044, tag:"4K" },

  { id:"img-02", type:"image", title:"Fond d'écran — Néons urbains (4K)",
    desc:"Ambiance nocturne cyan et magenta, parfait pour bureau et mobile.",
    sizeBytes:12582912, url:"https://picsum.photos/seed/velox-neon/1920/1080.jpg",
    date:"2025-11-20", downloads:1563 },

  { id:"img-03", type:"image", title:"Aperçu — Pack de 120 icônes vectorielles",
    desc:"Bibliothèque SVG libre de droits pour vos sites et applications.",
    sizeBytes:3145728, url:"https://picsum.photos/seed/velox-icons/1200/800.jpg",
    date:"2025-11-05", downloads:738 },

  { id:"pdf-01", type:"pdf", title:"Guide complet — Réussir sur Google Play",
    desc:"PDF de 84 pages : publication, ASO et monétisation de vos applications.",
    sizeBytes:25165824, url:"media/guide-google-play.pdf", date:"2025-11-25", downloads:4210 },

  { id:"pdf-02", type:"pdf", title:"Ebook — Design d'interfaces mobiles",
    desc:"Méthodes et bonnes pratiques, illustrées par 60 cas concrets.",
    sizeBytes:18874368, url:"media/ebook-design-mobile.pdf", date:"2025-10-18", downloads:2655 },

  { id:"apk-01", type:"apk", title:"StreamBox — Lecteur vidéo v4.2",
    desc:"Lecteur multimédia léger, tous formats, sans publicité.",
    sizeBytes:33554432, url:"media/streambox-4.2.apk", date:"2025-12-01", downloads:5387 },

  { id:"apk-02", type:"apk", title:"TaskFlow — Gestionnaire de tâches v2.9",
    desc:"Organisez vos journées : rappels, sous-tâches et statistiques hebdomadaires.",
    sizeBytes:19922944, url:"media/taskflow-2.9.apk", date:"2025-11-12", downloads:3106 },

  { id:"pro-01", type:"apkpro", title:"PhotoForge PRO — Éditeur avancé v6.1",
    desc:"Version complète débloquée : calques, retouche assistée et export 8K.",
    sizeBytes:100663296, url:"media/photoforge-pro-6.1.apk", date:"2025-12-04", downloads:8442 },

  { id:"pro-02", type:"apkpro", title:"MusicFX PRO — Studio mobile v3.5",
    desc:"Studio de production complet : 200 instruments, séquenceur et mixage.",
    sizeBytes:134217728, url:"media/musicfx-pro-3.5.apk", date:"2025-11-22", downloads:7129 },
];

/* ============================================================================
   3) PETITS OUTILS
   ============================================================================ */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const STORE_KEY = "velox_downloads_extra";

/* --- Icônes SVG internes (aucune dépendance externe) --- */
const ICONS = {
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  film:'<rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  phone:'<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  external:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  loader:'<circle cx="12" cy="12" r="9" stroke-dasharray="40 16"/>',
};
function icon(name, size = 18, cls = ""){
  const body = ICONS[name] || ICONS.info;
  return `<svg class="ic ${cls}" style="width:${size}px;height:${size}px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* --- Formats & utilitaires --- */
const nf = new Intl.NumberFormat("fr-FR");
const fmtNum = n => nf.format(n);

function fmtBytes(b){
  if(!b || b <= 0) return "—";
  const units = [["Go", 1073741824], ["Mo", 1048576], ["Ko", 1024]];
  for(const [name, val] of units){
    if(b >= val){
      const x = b / val;
      return (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2)).replace(".", ",") + " " + name;
    }
  }
  return b + " o";
}

function timeAgo(iso){
  const d = new Date(iso + "T12:00:00");
  if(isNaN(d.getTime())) return iso;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if(days <= 0)  return "aujourd'hui";
  if(days === 1) return "hier";
  if(days < 45)  return `il y a ${days} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

function norm(s){
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function hexToRgba(hex, a){
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function el(html){
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

const EXT_DEFAULT = { video:"mp4", image:"jpg", pdf:"pdf", apk:"apk", apkpro:"apk" };
function extOf(f){
  const m = (f.url || "").split("?")[0].match(/\.([a-z0-9]{1,5})$/i);
  return m ? m[1].toLowerCase() : EXT_DEFAULT[f.type];
}

function deriveFileName(f){
  let name = "";
  if(!/^https?:/i.test(f.url || "")){
    try{ name = decodeURIComponent(f.url.split("?")[0].split("/").pop() || ""); }catch(e){ name = f.url; }
  }
  if(!name){
    name = f.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "." + extOf(f);
  }
  return name;
}

/* ============================================================================
   4) ÉTAT GLOBAL
   ============================================================================ */
const state = { filter: null, query: "", sort: "recent" };
const downloading = new Set();
let currentFile = null;

/* Compteur de téléchargements persistant (localStorage) */
let extra = (() => {
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch(e){ return {}; }
})();
function saveExtra(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(extra)); }catch(e){} }
function getDl(f){ return (f.downloads || 0) + (extra[f.id] || 0); }

/* ============================================================================
   5) RENDUS
   ============================================================================ */
function renderSpectrum(){
  const counts = {}; Object.keys(CATS).forEach(k => counts[k] = 0);
  FILES.forEach(f => counts[f.type]++);

  $("#spectrum").innerHTML = Object.entries(CATS).map(([key, c]) => {
    const n = counts[key];
    return `
      <button class="spec-seg ${state.filter === key ? "active" : ""}" data-cat="${key}"
        style="--c:${c.color};--cBG:${hexToRgba(c.color, .09)};--cBD:${hexToRgba(c.color, .4)};--cSH:${hexToRgba(c.color, .24)};flex-grow:${Math.max(1, n)}">
        <span class="seg-name">${c.label}</span>
        <span class="seg-count">${n} fichier${n > 1 ? "s" : ""}</span>
      </button>`;
  }).join("");
}

function rowTemplate(f, i){
  const c = CATS[f.type];
  return `
  <article class="file-row" data-id="${f.id}"
    style="--c:${c.color};--cBG:${hexToRgba(c.color, .1)};--cBD:${hexToRgba(c.color, .4)}">
    <div class="row-idx">${String(i + 1).padStart(2, "0")}</div>
    <div class="row-icon">${icon(c.icon, 20)}</div>
    <div class="row-main">
      <div class="row-title-wrap">
        <button class="row-title-btn" data-action="details">${esc(f.title)}</button>
        ${f.type === "apkpro" ? '<span class="badge-pro">PRO</span>' : ""}
        ${f.tag ? `<span class="badge-tag">${esc(f.tag)}</span>` : ""}
      </div>
      <p class="row-desc">${esc(f.desc)}</p>
      <p class="meta">${c.label} · ${extOf(f).toUpperCase()} · ${timeAgo(f.date)}</p>
      <p class="meta-sm">${c.label} · ${fmtBytes(f.sizeBytes)} · ${fmtNum(getDl(f))} dl</p>
    </div>
    <div class="col"><span class="col-label">Taille</span><span class="col-val">${fmtBytes(f.sizeBytes)}</span></div>
    <div class="col"><span class="col-label">Téléch.</span><span class="col-val">${fmtNum(getDl(f))}</span></div>
    <div class="row-actions">
      <button class="icon-btn" data-action="details" aria-label="Voir les détails" title="Détails">${icon("eye", 17)}</button>
      <button class="dl-btn" data-action="download" data-dl="${f.id}">${icon("download", 15)}<span>Télécharger</span></button>
    </div>
    <div class="row-progress"></div>
  </article>`;
}

function getVisible(){
  const list = FILES.filter(f => {
    if(state.filter && f.type !== state.filter) return false;
    if(state.query){
      const hay = norm([f.title, f.desc, CATS[f.type].label, f.tag || "", extOf(f)].join(" "));
      if(!hay.includes(norm(state.query))) return false;
    }
    return true;
  });
  const s = state.sort;
  list.sort((a, b) =>
    s === "recent"  ? new Date(b.date) - new Date(a.date) :
    s === "popular" ? getDl(b) - getDl(a) :
    s === "size"    ? b.sizeBytes - a.sizeBytes :
                      a.title.localeCompare(b.title, "fr"));
  return list;
}

function renderList(){
  const list = getVisible();
  $("#fileList").innerHTML = list.map(rowTemplate).join("");
  $("#fileList").hidden = list.length === 0;
  $("#emptyState").hidden = list.length > 0;
  $("#resultCount").textContent = `${list.length} fichier${list.length > 1 ? "s" : ""}`;
}

function renderChip(){
  const chip = $("#activeFilter");
  if(!state.filter){ chip.hidden = true; chip.innerHTML = ""; return; }
  const c = CATS[state.filter];
  chip.hidden = false;
  chip.style.setProperty("--c", c.color);
  chip.style.setProperty("--cBG", hexToRgba(c.color, .1));
  chip.style.setProperty("--cBD", hexToRgba(c.color, .4));
  chip.innerHTML = `<span class="chip-dot"></span>${c.label}
    <button class="chip-x" aria-label="Retirer le filtre">${icon("x", 13)}</button>`;
}

function renderStats(animate){
  const dl   = FILES.reduce((s, f) => s + getDl(f), 0);
  const size = FILES.reduce((s, f) => s + (f.sizeBytes || 0), 0);
  if(animate){
    animateVal($("#statFiles"), FILES.length, fmtNum);
    animateVal($("#statDl"), dl, fmtNum);
    animateVal($("#statCats"), Object.keys(CATS).length, fmtNum);
    animateVal($("#statSize"), size, fmtBytes);
  } else {
    $("#statFiles").textContent = fmtNum(FILES.length);
    $("#statDl").textContent = fmtNum(dl);
    $("#statCats").textContent = fmtNum(Object.keys(CATS).length);
    $("#statSize").textContent = fmtBytes(size);
  }
}

function updateHeaderDl(bump){
  const total = FILES.reduce((s, f) => s + getDl(f), 0);
  const badge = $("#hdrDl");
  badge.textContent = fmtNum(total);
  if(bump){
    const wrap = $("#hdrDlBtn");
    wrap.classList.remove("bump"); void wrap.offsetWidth; wrap.classList.add("bump");
  }
}

/* Compteur animé (easing cubique) */
function animateVal(node, target, fmt, dur = 1200){
  if(REDUCED || !node){ if(node) node.textContent = fmt(target); return; }
  const t0 = performance.now();
  requestAnimationFrame(function tick(t){
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    node.textContent = fmt(Math.round(target * e));
    if(k < 1) requestAnimationFrame(tick);
  });
}

/* ============================================================================
   6) TÉLÉCHARGEMENT — progression, fichier réel, compteur persistant
   ============================================================================ */
function setLoading(btn, on){
  if(!btn) return;
  if(on){
    if(!btn.dataset.orig) btn.dataset.orig = btn.innerHTML;
    btn.classList.add("loading"); btn.disabled = true;
    btn.innerHTML = `${icon("loader", 15, "spin")}<span>En cours…</span>`;
  } else {
    btn.classList.remove("loading"); btn.disabled = false;
    if(btn.dataset.orig){ btn.innerHTML = btn.dataset.orig; delete btn.dataset.orig; }
  }
}

function animateProgress(bar){
  return new Promise(resolve => {
    if(!bar || REDUCED){
      if(bar) bar.style.width = "100%";
      return setTimeout(() => { if(bar) bar.style.width = "0"; resolve(); }, REDUCED ? 120 : 260);
    }
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + 7 + Math.random() * 15, 88);
      bar.style.width = p + "%";
      if(p >= 88){
        clearInterval(iv);
        setTimeout(() => {
          bar.style.width = "100%";
          setTimeout(() => {
            bar.style.transition = "none"; bar.style.width = "0";
            void bar.offsetWidth; bar.style.transition = "";
            resolve();
          }, 240);
        }, 140);
      }
    }, 95);
  });
}

function triggerRealDownload(f){
  const a = document.createElement("a");
  a.href = f.url;
  a.download = deriveFileName(f);
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function startDownload(id){
  const f = FILES.find(x => x.id === id);
  if(!f || downloading.has(id)) return;

  if(!f.url || f.url === "#"){
    toast("error", "Lien non configuré", `Renseignez le champ « url » de « ${f.title} » dans le tableau FILES de app.js.`);
    return;
  }

  downloading.add(id);
  $$(`[data-dl="${id}"]`).forEach(b => setLoading(b, true));

  const row = document.querySelector(`.file-row[data-id="${id}"]`);
  await animateProgress(row ? row.querySelector(".row-progress") : null);

  /* Téléchargement réel du fichier */
  triggerRealDownload(f);

  /* Compteur persistant + rafraîchissement de l'interface */
  extra[id] = (extra[id] || 0) + 1;
  saveExtra();
  renderList();
  renderStats(false);
  updateHeaderDl(true);
  $$(`[data-dlcount="${id}"]`).forEach(n => n.textContent = fmtNum(getDl(f)));
  $$(`[data-dl="${id}"]`).forEach(b => setLoading(b, false)); /* bouton du panneau */

  toast("success", "Téléchargement lancé", f.title);
  downloading.delete(id);
}

/* ============================================================================
   7) PANNEAU DE DÉTAILS & NOTIFICATIONS
   ============================================================================ */
const drawer  = $("#drawer");
const overlay = $("#drawerOverlay");

function drawerBodyTemplate(f){
  const c = CATS[f.type];

  let media = "";
  if(f.type === "image"){
    media = `<img class="preview-media" src="${esc(f.url)}" alt="${esc(f.title)}">`;
  } else if(f.type === "video"){
    media = `<video class="preview-media" controls preload="metadata" src="${esc(f.url)}"></video>`;
  } else {
    media = `
    <div class="file-card" style="--c:${c.color};--cBG:${hexToRgba(c.color, .08)};--cBD:${hexToRgba(c.color, .35)}">
      <div class="file-card-icon">${icon(c.icon, 30)}</div>
      <p class="file-card-name">${esc(deriveFileName(f))}</p>
      <p class="file-card-sub">${c.label} · ${fmtBytes(f.sizeBytes)}</p>
      <a class="btn btn-ghost" href="${esc(f.url)}" target="_blank" rel="noopener">${icon("external", 14)} Ouvrir dans un onglet</a>
    </div>`;
  }

  return `
    <p class="d-type" style="color:${c.color}"><span class="d-dot" style="background:${c.color}"></span>${c.label}</p>
    <h2 class="d-title">${esc(f.title)}</h2>
    <div class="d-badges row">
      ${f.type === "apkpro" ? '<span class="badge-pro">PRO</span>' : ""}
      ${f.tag ? `<span class="badge-tag">${esc(f.tag)}</span>` : ""}
    </div>
    <p class="d-desc">${esc(f.desc)}</p>
    <div class="meta-grid">
      <div class="mcell"><span class="mlabel">Taille</span><span class="mval">${fmtBytes(f.sizeBytes)}</span></div>
      <div class="mcell"><span class="mlabel">Format</span><span class="mval">${extOf(f).toUpperCase()}</span></div>
      <div class="mcell"><span class="mlabel">Ajouté</span><span class="mval">${timeAgo(f.date)}</span></div>
      <div class="mcell"><span class="mlabel">Téléchargements</span><span class="mval" data-dlcount="${f.id}">${fmtNum(getDl(f))}</span></div>
    </div>
    ${media}`;
}

function openDrawer(id){
  const f = FILES.find(x => x.id === id);
  if(!f) return;
  currentFile = f;
  const c = CATS[f.type];

  $("#drawerHeadLeft").innerHTML = `
    <span class="d-icon" style="--c:${c.color};--cBG:${hexToRgba(c.color, .1)};--cBD:${hexToRgba(c.color, .4)}">${icon(c.icon, 19)}</span>
    <span class="d-badges">
      ${f.type === "apkpro" ? '<span class="badge-pro">PRO</span>' : ""}
      ${f.tag ? `<span class="badge-tag">${esc(f.tag)}</span>` : ""}
    </span>`;

  const body = $("#drawerBody");
  body.innerHTML = drawerBodyTemplate(f);

  /* Aperçu image : repli propre si l'URL est indisponible */
  const img = body.querySelector("img.preview-media");
  if(img){
    img.addEventListener("error", () => {
      img.replaceWith(el(`<div class="preview-fallback">${icon("alert", 16)}<span>Aperçu indisponible — vérifiez l'URL du fichier.</span></div>`));
    }, { once: true });
  }

  $("#drawerFoot").innerHTML = `
    <button class="btn btn-ghost" data-action="copy">${icon("copy", 15)} Copier le lien</button>
    <button class="btn btn-solid" data-action="download" data-dl="${f.id}" style="--c:${c.color}">
      ${icon("download", 15)}<span>Télécharger · ${fmtBytes(f.sizeBytes)}</span>
    </button>`;

  drawer.classList.add("open");
  overlay.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  body.scrollTop = 0;
  $("#drawerClose").focus();
}

function closeDrawer(){
  const video = $("#drawerBody").querySelector("video");
  if(video) video.pause();
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentFile = null;
}

function copyLink(f){
  if(!f) return;
  let abs = f.url;
  try{ abs = new URL(f.url, location.href).href; }catch(e){}
  const done = () => toast("success", "Lien copié", abs);
  const fallback = () => {
    const t = document.createElement("textarea");
    t.value = abs;
    t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t); t.select();
    try{ document.execCommand("copy"); done(); }
    catch(e){ toast("error", "Copie impossible", "Copiez le lien manuellement depuis la barre d'adresse."); }
    t.remove();
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(abs).then(done).catch(fallback);
  } else fallback();
}

/* --- Notifications (toasts) --- */
function toast(type, title, msg){
  const colors = { success: "var(--green)", error: "var(--red)", info: "var(--blue)", gold: "var(--gold)" };
  const icons  = { success: "check", error: "alert", info: "info", gold: "star" };
  const box = $("#toasts");
  const t = document.createElement("div");
  t.className = "toast";
  t.style.setProperty("--tc", colors[type] || colors.info);
  t.innerHTML = `
    <span class="t-ic">${icon(icons[type] || "info", 16)}</span>
    <div><p class="t-title">${esc(title)}</p>${msg ? `<p class="t-msg">${esc(msg)}</p>` : ""}</div>
    <span class="t-life"></span>`;
  box.appendChild(t);
  while(box.children.length > 4) box.firstElementChild.remove();
  const kill = () => { t.classList.add("out"); setTimeout(() => t.remove(), 260); };
  const timer = setTimeout(kill, 4200);
  t.addEventListener("click", () => { clearTimeout(timer); kill(); });
}

/* ============================================================================
   8) INITIALISATION & INTERACTIONS
   ============================================================================ */
function scrollToCatalog(cb){
  $("#catalogue").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  if(cb) setTimeout(cb, 380);
}

function applyFilter(scroll){
  renderSpectrum();
  renderChip();
  renderList();
  if(scroll) scrollToCatalog();
}

function toggleFilter(cat){
  state.filter = state.filter === cat ? null : cat;
  applyFilter(true);
}
function forceFilter(cat){
  state.filter = cat;
  applyFilter(true);
}
function closeMenu(){
  $("#mobileMenu").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
}

function init(){

  /* --- Rendus initiaux --- */
  renderSpectrum();
  renderList();
  renderChip();
  renderStats(true);
  updateHeaderDl(false);

  /* --- Apparitions au défilement --- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: .1 });
  $$(".reveal").forEach(n => io.observe(n));

  /* --- Défilement : en-tête + bouton retour en haut --- */
  let ticking = false;
  window.addEventListener("scroll", () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      $("#siteHeader").classList.toggle("scrolled", y > 8);
      $("#backTop").classList.toggle("show", y > 600);
      ticking = false;
    });
  }, { passive: true });

  /* --- En-tête --- */
  $("#searchBtn").addEventListener("click", () =>
    scrollToCatalog(() => { const i = $("#searchInput"); i.focus(); i.select(); }));
  $("#hdrDlBtn").addEventListener("click", () => scrollToCatalog());
  $("#menuBtn").addEventListener("click", () => {
    const open = $("#mobileMenu").classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", String(open));
  });
  $("#mobileMenu").addEventListener("click", e => {
    if(e.target.closest("a")) closeMenu();
  });
  $$(".js-pro").forEach(b => b.addEventListener("click", () => { closeMenu(); forceFilter("apkpro"); }));

  /* --- Recherche --- */
  $("#searchInput").addEventListener("input", e => {
    state.query = e.target.value.trim();
    renderList();
  });

  /* --- Tri --- */
  $$(".sort-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".sort-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.sort = btn.dataset.sort;
    renderList();
  }));

  /* --- Spectre + puce de filtre --- */
  $("#spectrum").addEventListener("click", e => {
    const seg = e.target.closest(".spec-seg");
    if(seg) toggleFilter(seg.dataset.cat);
  });
  $("#activeFilter").addEventListener("click", e => {
    if(e.target.closest(".chip-x")){ state.filter = null; applyFilter(false); }
  });

  /* --- Catalogue (délégation) --- */
  $("#fileList").addEventListener("click", e => {
    const act = e.target.closest("[data-action]");
    if(act){
      const row = act.closest(".file-row");
      if(act.dataset.action === "download") startDownload(act.dataset.dl);
      else if(row) openDrawer(row.dataset.id);
      return;
    }
    const row = e.target.closest(".file-row");
    if(row) openDrawer(row.dataset.id);
  });

  /* --- État vide --- */
  $("#resetBtn").addEventListener("click", () => {
    state.query = ""; state.filter = null;
    $("#searchInput").value = "";
    applyFilter(false);
  });

  /* --- Panneau de détails --- */
  $("#drawerClose").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", e => {
    const act = e.target.closest("[data-action]");
    if(!act) return;
    if(act.dataset.action === "download") startDownload(act.dataset.dl);
    if(act.dataset.action === "copy") copyLink(currentFile);
  });

  /* --- Divers --- */
  $("#backTop").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));
  $("#fTop").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));

  /* --- Raccourcis clavier --- */
  document.addEventListener("keydown", e => {
    if(e.key === "Escape"){ closeDrawer(); closeMenu(); }
    if(e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){
      e.preventDefault();
      scrollToCatalog(() => { const i = $("#searchInput"); i.focus(); i.select(); });
    }
  });
}

init();

/* ============================================================================
   9) PWA — enregistrement du Service Worker
   Ignoré en local (file://) car un SW exige http/https ;
   actif automatiquement dès que le site est en ligne (GitHub Pages, Netlify…).
   ============================================================================ */
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      /* échec silencieux : l'application fonctionne quand même */
    });
  });
}

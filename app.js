/* ============================================================
   NewStyle Downloads — app.js
   Catalogue piloté par les données : rendu, recherche, filtres,
   tri, vues, presse-papiers et micro-interactions.
   ============================================================ */
(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. Données du catalogue
     Ajoutez simplement une entrée ici : cartes, compteurs,
     catégories et recherche se mettent à jour automatiquement.
     ---------------------------------------------------------- */
  const FILES = [
    { id: 1,  name: 'Formation Python — 12 leçons complètes', ext: 'MP4',  type: 'video',   category: 'videos',   size: 2576980378, date: '2026-01-12', downloads: 4821,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-python12',        desc: 'Parcours vidéo pas à pas : bases, projets et bonnes pratiques.' },
    { id: 2,  name: 'Conférence DevFest 2025 — session complète', ext: 'MKV', type: 'video', category: 'videos',   size: 933232640,  date: '2025-11-28', downloads: 2137,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-devfest', desc: 'Keynote et retours d’expérience de la communauté.' },
    { id: 3,  name: 'Clip officiel — « Nuit Blanche »', ext: 'MP4', type: 'video',           category: 'videos',   size: 224395264,  date: '2025-09-04', downloads: 8940,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-nuitblanche',     desc: 'Clip musical haute définition, 1080p60.' },
    { id: 4,  name: 'Pack wallpapers 4K — 60 visuels', ext: 'ZIP', type: 'image',            category: 'images',   size: 506467328,  date: '2026-01-03', downloads: 3512,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-wallpapers', desc: 'Sélection de fonds d’écran 4K triés sur le volet.' },
    { id: 5,  name: 'Photoshoot studio — fichiers bruts', ext: 'JPG', type: 'image',        category: 'images',   size: 337641472,  date: '2025-12-18', downloads: 1289,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-studio',          desc: 'Photos non retouchées, pleine résolution.' },
    { id: 6,  name: 'Icônes minimalistes — 320 SVG', ext: 'ZIP', type: 'image',             category: 'images',   size: 8808038,    date: '2025-08-22', downloads: 6603,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-icons', desc: 'Jeu d’icônes vectorielles, deux styles.' },
    { id: 7,  name: 'ÉditeurPhoto Pro v4.2', ext: 'APK', type: 'app',                       category: 'apps',     size: 100663296,  date: '2026-01-20', downloads: 7745,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-edipro', desc: 'Retouche photo complète, version modifiée.' },
    { id: 8,  name: 'Nova Launcher Mod v8.1', ext: 'APK', type: 'app',                      category: 'apps',     size: 23068672,   date: '2025-10-15', downloads: 5208,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-nova',            desc: 'Personnalisation avancée de l’écran d’accueil.' },
    { id: 9,  name: 'Piano — Apprendre v1.8', ext: 'APK', type: 'app',                      category: 'apps',     size: 47185920,   date: '2025-12-02', downloads: 1987,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-piano', desc: 'Cours interactifs et clavier intégré.' },
    { id: 10, name: 'Guide complet JavaScript 2026', ext: 'PDF', type: 'doc',               category: 'docs',     size: 12582912,   date: '2026-01-08', downloads: 9310,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-js2026',          desc: 'Référence moderne : ES2025, patterns, exercices.' },
    { id: 11, name: 'Cahiers de révision — Maths Terminale', ext: 'PDF', type: 'doc',       category: 'docs',     size: 25165824,   date: '2025-09-30', downloads: 4120,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-maths', desc: 'Fiches synthèses et annales corrigées.' },
    { id: 12, name: 'CV — 15 modèles professionnels', ext: 'PDF', type: 'doc',              category: 'docs',     size: 6501171,    date: '2025-11-11', downloads: 11021, host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-cv',    desc: 'Modèles modifiables, versions word et pages.' },
    { id: 13, name: 'Bundle design — ressources 2026', ext: 'RAR', type: 'archive',         category: 'archives', size: 1297635081, date: '2026-01-18', downloads: 3042,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-bundle26',        desc: 'Polices, maquettes et textures sélectionnées.' },
    { id: 14, name: 'Sauvegarde projet web — v3', ext: 'ZIP', type: 'archive',              category: 'archives', size: 360710144,  date: '2025-12-27', downloads: 976,   host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-backup', desc: 'Code source et base de données, prêt à restaurer.' },
    { id: 15, name: 'Album « Minuit » — édition FLAC', ext: 'FLAC', type: 'audio',          category: 'audio',    size: 399507456,  date: '2025-10-30', downloads: 2873,  host: 'MEGA',      link: 'https://mega.nz/file/nsd-minuit',          desc: 'Album complet en qualité sans perte.' },
    { id: 16, name: 'Podcasts Dev — Saison 3 complète', ext: 'MP3', type: 'audio',          category: 'audio',    size: 218103808,  date: '2026-01-05', downloads: 5560,  host: 'MediaFire', link: 'https://www.mediafire.com/file/nsd-podcasts', desc: 'Douze épisodes, balises ID3 complètes.' },
  ];

  const CATEGORIES = [
    { id: 'all',      label: 'Tout',         icon: 'layers'  },
    { id: 'videos',   label: 'Vidéos',       icon: 'video'   },
    { id: 'images',   label: 'Images',       icon: 'image'   },
    { id: 'apps',     label: 'Applications', icon: 'app'     },
    { id: 'docs',     label: 'Documents',    icon: 'doc'     },
    { id: 'archives', label: 'Archives',     icon: 'archive' },
    { id: 'audio',    label: 'Audio',        icon: 'audio'   },
  ];

  /* Couleurs fonctionnelles par type de fichier */
  const TYPE_COLORS = {
    video: '#ef6a7d', image: '#55d6a2', app: '#f6b73c',
    doc: '#6aa9ff', archive: '#b48ef0', audio: '#4fc9d9',
  };

  /* Bibliothèque d'icônes SVG (trait, héritant de currentColor) */
  const ICONS = {
    search:   '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/>',
    copy:     '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check:    '<path d="m5 13 4 4L19 7"/>',
    shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    bolt:     '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    cloud:    '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    video:    '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m10 9 5 3-5 3V9z"/>',
    image:    '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m4 17 4.5-4.5 3.5 3.5 3-3 5 5"/>',
    app:      '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 19h2"/>',
    doc:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    archive:  '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
    audio:    '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    layers:   '<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    reset:    '<path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  };

  const icon = name =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ----------------------------------------------------------
     2. Utilitaires
     ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  const esc = str => String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Recherche insensible à la casse et aux accents */
  const norm = str => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const debounce = (fn, delay = 180) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  };

  const hexToRgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  const formatSize = bytes => {
    if (bytes < 1024) return `${bytes} o`;
    const units = ['Ko', 'Mo', 'Go'];
    let i = -1, v = bytes;
    do { v /= 1024; i++; } while (v >= 1024 && i < units.length - 1);
    return `${v.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} ${units[i]}`;
  };

  const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDate = iso => dateFmt.format(new Date(iso));
  const fmtNum = n => n.toLocaleString('fr-FR');

  const SORTERS = {
    recent:     (a, b) => new Date(b.date) - new Date(a.date),
    name:       (a, b) => a.name.localeCompare(b.name, 'fr'),
    size:       (a, b) => b.size - a.size,
    downloads:  (a, b) => b.downloads - a.downloads,
  };

  /* ----------------------------------------------------------
     3. État global
     ---------------------------------------------------------- */
  const state = { query: '', category: 'all', sort: 'recent', view: 'grid' };
  try {
    const saved = localStorage.getItem('nsd-view');
    if (saved === 'grid' || saved === 'list') state.view = saved;
  } catch { /* stockage indisponible : on ignore */ }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     4. Références DOM
     ---------------------------------------------------------- */
  const els = {
    topbar:     document.getElementById('topbar'),
    nav:        document.getElementById('nav'),
    menuBtn:    document.getElementById('menuBtn'),
    searchForm: document.getElementById('searchForm'),
    search:     document.getElementById('searchInput'),
    resetBtn:   document.getElementById('resetBtn'),
    cats:       document.getElementById('cats'),
    count:      document.getElementById('count'),
    viewToggle: document.getElementById('viewToggle'),
    sortSelect: document.getElementById('sortSelect'),
    grid:       document.getElementById('grid'),
    empty:      document.getElementById('empty'),
    emptyReset: document.getElementById('emptyReset'),
    toast:      document.getElementById('toast'),
  };

  /* ----------------------------------------------------------
     5. Rendu
     ---------------------------------------------------------- */
  function buildCats() {
    els.cats.innerHTML = CATEGORIES.map(cat => {
      const count = cat.id === 'all'
        ? FILES.length
        : FILES.filter(f => f.category === cat.id).length;
      return `
        <button class="cat" type="button" data-cat="${cat.id}" aria-pressed="false">
          ${icon(cat.icon)}<span>${cat.label}</span><span class="cat__count">${count}</span>
        </button>`;
    }).join('');
  }

  function updateCats() {
    els.cats.querySelectorAll('.cat').forEach(btn => {
      const active = btn.dataset.cat === state.category;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function getFiltered() {
    const q = norm(state.query.trim());
    const list = FILES.filter(f => {
      if (state.category !== 'all' && f.category !== state.category) return false;
      if (!q) return true;
      const cat = CATEGORIES.find(c => c.id === f.category);
      return norm([f.name, f.desc, f.ext, f.host, cat ? cat.label : ''].join(' ')).includes(q);
    });
    return list.sort(SORTERS[state.sort]);
  }

  function cardHTML(f, i) {
    const color = TYPE_COLORS[f.type] || '#f6b73c';
    return `
      <article class="card" data-id="${f.id}"
               style="--type-c:${color}; --type-bg:${hexToRgba(color, .14)}; --d:${Math.min(i * 50, 350)}ms">
        <div class="card__head">
          <span class="card__icon">${icon(f.type)}</span>
          <span class="badges">
            <span class="badge badge--${f.host === 'MEGA' ? 'mega' : 'mediafire'}">${f.host}</span>
            <span class="badge">${f.ext}</span>
          </span>
        </div>
        <div class="card__main">
          <h3 class="card__name">${esc(f.name)}</h3>
          <p class="card__desc">${esc(f.desc)}</p>
          <ul class="card__meta">
            <li>${icon('archive')}${formatSize(f.size)}</li>
            <li>${icon('calendar')}${fmtDate(f.date)}</li>
            <li title="Téléchargements">${icon('download')}${fmtNum(f.downloads)}</li>
          </ul>
        </div>
        <div class="card__actions">
          <a class="btn btn--primary" href="${f.link}" target="_blank" rel="noopener noreferrer">
            ${icon('download')}<span>Télécharger</span>
          </a>
          <button class="btn btn--icon" type="button" data-copy="${f.id}"
                  title="Copier le lien" aria-label="Copier le lien — ${esc(f.name)}">
            ${icon('copy')}
          </button>
        </div>
      </article>`;
  }

  function renderFiles() {
    const list = getFiltered();
    const total = FILES.length;

    els.count.textContent = list.length === total
      ? `${total} fichiers disponibles`
      : `${list.length} fichier${list.length > 1 ? 's' : ''} trouvé${list.length > 1 ? 's' : ''}`;

    els.grid.innerHTML = list.map(cardHTML).join('');
    els.grid.classList.toggle('hidden', list.length === 0);
    els.empty.classList.toggle('hidden', list.length !== 0);
  }

  /* ----------------------------------------------------------
     6. Actions
     ---------------------------------------------------------- */
  let toastTimer;
  function showToast(msg) {
    els.toast.innerHTML = `${icon('check')}<span>${esc(msg)}</span>`;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  async function copyLink(url) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        /* Solution de repli pour les contextes non sécurisés */
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast('Lien copié dans le presse-papiers');
    } catch {
      showToast('Impossible de copier le lien');
    }
  }

  function resetFilters(scroll = false) {
    state.query = '';
    state.category = 'all';
    state.sort = 'recent';
    els.search.value = '';
    els.sortSelect.value = 'recent';
    updateCats();
    renderFiles();
    if (scroll) {
      const target = document.getElementById('fichiers');
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  }

  function setView(view) {
    state.view = view;
    try { localStorage.setItem('nsd-view', view); } catch { /* ignore */ }
    els.grid.classList.toggle('list-view', view === 'list');
    els.viewToggle.querySelectorAll('button[data-view]').forEach(btn =>
      btn.classList.toggle('is-active', btn.dataset.view === view));
  }

  /* ----------------------------------------------------------
     7. Écouteurs d'événements
     ---------------------------------------------------------- */
  function bindEvents() {
    /* Recherche : validation immédiate + saisie différée */
    els.searchForm.addEventListener('submit', e => {
      e.preventDefault();
      state.query = els.search.value;
      renderFiles();
      document.getElementById('fichiers')
        .scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    });

    els.search.addEventListener('input', debounce(() => {
      state.query = els.search.value;
      renderFiles();
    }));

    els.search.addEventListener('keydown', e => {
      if (e.key === 'Escape' && els.search.value) {
        els.search.value = '';
        state.query = '';
        renderFiles();
      }
    });

    /* Raccourci « / » pour focaliser la recherche */
    document.addEventListener('keydown', e => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey
          && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
        e.preventDefault();
        els.search.focus();
      }
    });

    /* Tri, catégories, vues, réinitialisation */
    els.sortSelect.addEventListener('change', () => {
      state.sort = els.sortSelect.value;
      renderFiles();
    });

    els.cats.addEventListener('click', e => {
      const btn = e.target.closest('.cat');
      if (!btn) return;
      state.category = btn.dataset.cat;
      updateCats();
      renderFiles();
    });

    els.viewToggle.addEventListener('click', e => {
      const btn = e.target.closest('button[data-view]');
      if (btn) setView(btn.dataset.view);
    });

    [els.resetBtn, els.emptyReset].forEach(btn =>
      btn && btn.addEventListener('click', () => resetFilters(true)));

    /* Copie de lien (délégation sur la grille) */
    els.grid.addEventListener('click', e => {
      const btn = e.target.closest('[data-copy]');
      if (!btn) return;
      const file = FILES.find(f => String(f.id) === btn.dataset.copy);
      if (file) copyLink(file.link);
    });

    /* Menu mobile */
    const closeMenu = () => {
      els.nav.classList.remove('open');
      els.menuBtn.setAttribute('aria-expanded', 'false');
      els.menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
    };

    els.menuBtn.addEventListener('click', () => {
      const open = els.nav.classList.toggle('open');
      els.menuBtn.setAttribute('aria-expanded', String(open));
      els.menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    els.nav.addEventListener('click', e => {
      if (e.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 780) closeMenu();
    }, 150));

    /* En-tête condensé au défilement */
    window.addEventListener('scroll', () => {
      els.topbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     8. Animations annexes
     ---------------------------------------------------------- */

  /* Compteurs animés du hero */
  function initStats() {
    const targets = {
      files: FILES.length,
      cats:  CATEGORIES.filter(c => c.id !== 'all').length,
      hosts: new Set(FILES.map(f => f.host)).size,
    };
    Object.entries(targets).forEach(([key, value]) => {
      const node = document.querySelector(`[data-stat="${key}"]`);
      if (!node) return;
      if (prefersReduced) { node.textContent = fmtNum(value); return; }
      const start = performance.now();
      const dur = 1100;
      const tick = now => {
        const t = Math.min((now - start) / dur, 1);
        node.textContent = fmtNum(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* Démo de téléchargement : parcourt le vrai catalogue */
  function initHeroDemo() {
    const card = $('#dlCard');
    if (!card) return;
    const nameEl = $('#dlName'), metaEl = $('#dlMeta'), badgeEl = $('#dlBadge'),
          pctEl = $('#dlPct'), speedEl = $('#dlSpeed'), barEl = $('#dlBar');

    let index = 0, progress = 0, speed = 24;

    const load = () => {
      const f = FILES[index++ % FILES.length];
      nameEl.textContent = f.name;
      metaEl.textContent = `${formatSize(f.size)} · ${f.host}`;
      card.classList.remove('done');
      badgeEl.textContent = 'en cours';
      barEl.style.width = '0%';
      progress = 0;
    };

    if (prefersReduced) {
      const f = FILES[0];
      nameEl.textContent = f.name;
      metaEl.textContent = `${formatSize(f.size)} · ${f.host}`;
      barEl.style.width = '100%';
      pctEl.textContent = '100 %';
      speedEl.textContent = '—';
      badgeEl.textContent = 'terminé';
      card.classList.add('done');
      return;
    }

    load();

    setInterval(() => {
      if (progress >= 100) return;
      speed = Math.min(42, Math.max(8, speed + (Math.random() - .5) * 9));
      progress = Math.min(100, progress + 100 / 46 + (Math.random() - .5) * 1.8);
      barEl.style.width = `${progress}%`;
      pctEl.textContent = `${Math.floor(progress)} %`;
      speedEl.textContent =
        `${speed.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Mo/s`;
      if (progress >= 100) {
        card.classList.add('done');
        badgeEl.textContent = 'terminé';
        pctEl.textContent = '100 %';
        setTimeout(load, 1700);
      }
    }, 160);
  }

  /* Lien de navigation actif selon la section visible */
  function initScrollSpy() {
    const links = document.querySelectorAll('.nav__link');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active',
          l.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
  }

  /* Apparition des blocs au défilement */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ----------------------------------------------------------
     9. Initialisation
     ---------------------------------------------------------- */
  buildCats();
  updateCats();
  renderFiles();
  setView(state.view);
  bindEvents();
  initStats();
  initHeroDemo();
  initScrollSpy();
  initReveal();
})();

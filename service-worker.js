/* ============================================================================
   VELOX — service-worker.js
   Stratégie :
     • Coquille de l'application (HTML/CSS/JS/icônes) : mise en cache au
       premier passage, consultable hors ligne.
     • Page HTML : réseau d'abord (fraîcheur), cache en secours.
     • Ressources (CSS/JS/SVG) : cache d'abord, mise à jour en arrière-plan.
     • Dossier /media/ et liens externes : JAMAIS mis en cache
       (vos APK et vidéos sont trop lourds pour le stockage du navigateur).
   ============================================================================ */

const CACHE = "velox-v1";
const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./offline.html",
];

/* Installation : préchargement de la coquille */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

/* Activation : suppression des anciens caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

async function saveInCache(request, response){
  if(!response || response.ok === false) return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if(request.method !== "GET") return;

  const url = new URL(request.url);
  if(url.origin !== location.origin) return;      /* liens externes : on passe */
  if(url.pathname.includes("/media/")) return;    /* gros fichiers : réseau seul */

  /* 1) Navigation : réseau d'abord, cache en secours, page hors ligne en dernier recours */
  if(request.mode === "navigate"){
    event.respondWith(
      fetch(request)
        .then(response => { saveInCache(request, response.clone()); return response; })
        .catch(async () =>
          (await caches.match(request)) ||
          (await caches.match("./index.html")) ||
          (await caches.match("./offline.html")) ||
          Response.error()
        )
    );
    return;
  }

  /* 2) Ressources du site : réponse immédiate depuis le cache,
        rafraîchissement en arrière-plan pour la prochaine visite */
  event.respondWith(
    caches.match(request).then(cached => {
      const fresh = fetch(request)
        .then(response => { saveInCache(request, response.clone()); return response; })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
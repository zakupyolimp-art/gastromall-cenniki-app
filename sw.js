// Stara apka (github.io) przeniesiona - ten service worker tylko się wyrejestrowuje
// i przeładowuje otwarte okna, żeby trafiły na przekierowanie do nowego adresu z logowaniem.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(self.registration.unregister()
    .then(function () { return self.clients.matchAll({ type: 'window' }); })
    .then(function (cs) { cs.forEach(function (c) { c.navigate(c.url); }); }));
});

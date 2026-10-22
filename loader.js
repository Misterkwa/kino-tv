// Ładowacz modułu TizenBrew: pobiera właściwy skrypt i uruchamia go na stronie.
// Ostatnia pobrana wersja jest trzymana w localStorage, więc start jest natychmiastowy,
// a nowa wersja wchodzi sama (jedno szybkie przeładowanie strony po aktualizacji).

(function () {
    'use strict';

    // tylko główne okno cinejoy.pk (TizenBrew wstrzykuje też w ramki i we własne menu)
    if (window.top !== window || window.__kinoLoader || !/(^|\.)cinejoy\.pk$/.test(location.hostname)) return;
    window.__kinoLoader = true;

    var SRC = 'https://tv.sgolabek.pl/code/kino-app.js';
    var CACHE_KEY = 'kino_app_code';

    // Pilot: ładowacz startuje przed skryptami strony, więc jego nasłuch jest pierwszy w kolejce
    // i przekazuje klawisze aplikacji, nawet jeśli ta wczyta się później niż strona.
    window.__kinoKeyTrap = true;
    window.addEventListener('keydown', function (e) { if (window.__kinoKey) window.__kinoKey(e); }, true);

    // Wyłączenie reklam musi zadziałać od razu, zanim strona wczyta swoje skrypty.
    try { localStorage.setItem('addies', 'false'); } catch (e) { /* bez localStorage */ }

    var ran = false;
    function run(code) {
        if (ran || !code) return;
        ran = true;
        try { (0, eval)(code); } catch (e) { console.error('kino-tv: błąd skryptu', e); }
    }

    var cached = null;
    try { cached = localStorage.getItem(CACHE_KEY); } catch (e) { /* bez localStorage */ }
    run(cached);

    fetch(SRC + '?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)); })
        .then(function (code) {
            if (code === cached) return;
            try { localStorage.setItem(CACHE_KEY, code); } catch (e) { /* brak miejsca */ }
            if (!ran) run(code);
            else location.reload(); // była stara wersja: przeładowanie uruchomi nową
        })
        .catch(function (e) { console.error('kino-tv: nie udało się pobrać skryptu', e); });
})();

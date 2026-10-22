// Ładowacz modułu TizenBrew: pobiera właściwy skrypt i uruchamia go na stronie.
// Ostatnia pobrana wersja jest trzymana w localStorage, więc start jest natychmiastowy,
// a nowa wersja wchodzi sama (jedno szybkie przeładowanie strony po aktualizacji).

(function () {
    'use strict';

    if (window.top !== window || window.__kinoLoader) return;
    window.__kinoLoader = true;

    var SRC = 'https://gist.githubusercontent.com/Misterkwa/e4f67df3586544c5601d05eb412d1f9f/raw/cinejoy-tv.js';
    var CACHE_KEY = 'nfx_tv_code';

    // Wyłączenie reklam musi zadziałać od razu, zanim strona wczyta swoje skrypty.
    try {
        var settings = JSON.parse(localStorage.getItem('nfx_tv_settings') || '{}');
        if (settings.noAds !== false) localStorage.setItem('addies', 'false');
    } catch (e) { /* bez localStorage */ }

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

/* main.js — intro "tap untuk buka", kawalan muzik, nama ditaip
   Perlu load SELEPAS petals.js */
(function () {
  var bgm = document.getElementById('bgm');
  var mbtn = document.getElementById('mbtn');
  var intro = document.getElementById('intro');

  // Mod siang / malam (default: siang, pilihan disimpan)
  var root = document.documentElement;
  var tbtn = document.getElementById('tbtn');
  function applyTheme(t, save) {
    root.setAttribute('data-theme', t);
    tbtn.textContent = t === 'light' ? '🌙' : '☀️';
    tbtn.setAttribute('aria-label', t === 'light' ? 'Tukar ke mod malam' : 'Tukar ke mod siang');
    Petals.setTheme(t);
    if (save) { try { localStorage.setItem('aina-theme-v4', t); } catch (e) {} }
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  tbtn.addEventListener('click', function () {
    root.classList.add('tt');
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    setTimeout(function () { root.classList.remove('tt'); }, 500);
  });

  function setMusicLabel(on) {
    mbtn.textContent = on ? '♪ Muzik: on' : '♪ Muzik: off';
  }

  // Fail audio tiada / tak boleh dimuat
  bgm.addEventListener('error', function () {
    mbtn.textContent = '♪ Tiada audio';
    mbtn.disabled = true;
  });

  // Butang on/off muzik
  mbtn.addEventListener('click', function () {
    if (bgm.paused) {
      bgm.play().then(function () { setMusicLabel(true); }).catch(function () {});
    } else {
      bgm.pause();
      setMusicLabel(false);
    }
  });

  // Version 3: butang "Mula semula" — refresh page, kembali ke skrin "tap untuk buka"
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  document.getElementById('rbtn').addEventListener('click', function () {
    bgm.pause();
    window.scrollTo(0, 0);
    location.reload();
  });

  // Nama ditaip huruf demi huruf
  function typeName() {
    var el = document.getElementById('name');
    var text = 'Aina Maisarah';
    var i = 0;
    el.classList.add('typing');
    var iv = setInterval(function () {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(iv);
        setTimeout(function () { el.classList.remove('typing'); }, 1500);
      }
    }, 150);
  }

  // Tap skrin intro: buka website, mula petals + lagu
  intro.addEventListener('click', function () {
    intro.classList.add('gone');
    document.body.classList.add('on');
    Petals.start();

    var p = bgm.play(); // dibenarkan kerana ini tindakan tap pengguna
    if (p && p.then) {
      p.then(function () { setMusicLabel(true); })
       .catch(function () { setMusicLabel(false); });
    }
    setTimeout(typeName, 600);
  });
})();

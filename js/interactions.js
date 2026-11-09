/* interactions.js — tap kotak gambar, butang utama (hati + ros mekar + mesej)
   Perlu load SELEPAS petals.js */
(function () {
  // Kotak gambar: tap untuk glow / tegak
  document.querySelectorAll('.ph').forEach(function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('lit');
    });
  });

  // Mesej yang keluar bila butang ditekan (ubah ikut suka)
  var messages = [
    'Are you just Maisarah or my only Sarah?',
    'Waking up knowing you are one of the best part of my day',
    'I tengok you hardworking, I incredibly proud of you Sarah.',
    'Terima kasih sebab wujud dalam dunia ni you.',
    'Sarah a day can keep the doctor away',
    'Satu kelopak ros, satu doa kesejahteraan untuk awak. Sejuta kelopak ros, infinite doa kesejahteraan buat awak.'
  ];
  var n = 0;

  var love = document.getElementById('love');
  love.addEventListener('click', function () {
    var r = love.getBoundingClientRect();
    Petals.burst(r.left + r.width / 2, r.top + r.height / 2);
    document.getElementById('bloom').classList.add('show');
    document.getElementById('msg').textContent = messages[n++ % messages.length];
  });

  /* ===== Version 2 ===== */
  var $ = function (s) { return document.querySelector(s); };

  // Wish cards: drag guna mouse (jari swipe native), sentuh = naik ke atas
  var row = $('#wishRow'), dragging = false, sx = 0, sl = 0;
  row.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    dragging = true; sx = e.clientX; sl = row.scrollLeft;
    row.classList.add('drag');
    row.setPointerCapture(e.pointerId);
  });
  row.addEventListener('pointermove', function (e) {
    if (dragging) row.scrollLeft = sl - (e.clientX - sx);
  });
  function endDrag() { dragging = false; row.classList.remove('drag'); }
  row.addEventListener('pointerup', endDrag);
  row.addEventListener('pointercancel', endDrag);

  document.querySelectorAll('.wc').forEach(function (c) {
    c.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') c.classList.add('up');
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      c.addEventListener(ev, function () {
        setTimeout(function () { c.classList.remove('up'); }, 700);
      });
    });
  });

  // Timeline: auto scroll ke atas, dan boleh di-scroll sendiri atas / bawah
  // (jari di phone, wheel atau drag di komputer). Auto scroll berhenti sekejap bila disentuh.
  var view = $('#tlView'), track = $('#tlTrack');
  var first = track.firstElementChild;
  for (var c = 0; c < 2; c++) {            // 3 set sama supaya boleh loop ke dua-dua arah
    var cl = first.cloneNode(true);
    cl.setAttribute('aria-hidden', 'true');
    track.appendChild(cl);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting); });
    }, { root: view, rootMargin: '-42% 0px -42% 0px' });
    track.querySelectorAll('li').forEach(function (li) { io.observe(li); });
  }

  var reduceTl = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pos = 0, lastT = 0, pauseUntil = 0, hovering = false, resync = false, ready = false;
  var vd = false, vy = 0, vs = 0;

  function hold() { pauseUntil = performance.now() + 2500; resync = true; }
  ['pointerdown', 'pointerup', 'touchstart', 'touchmove', 'touchend', 'wheel', 'keydown'].forEach(function (ev) {
    view.addEventListener(ev, hold, { passive: true });
  });
  view.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'mouse') { hovering = true; resync = true; }
  });
  view.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse') { hovering = false; pauseUntil = performance.now() + 800; }
  });

  // Drag guna mouse (komputer)
  view.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    vd = true; vy = e.clientY; vs = view.scrollTop;
    view.setPointerCapture(e.pointerId);
  });
  view.addEventListener('pointermove', function (e) {
    if (vd) view.scrollTop = vs - (e.clientY - vy);
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) {
    view.addEventListener(ev, function () { vd = false; });
  });

  // Loop tanpa sempadan: lompat tepat satu set bila terlalu jauh ke atas / bawah
  view.addEventListener('scroll', function () {
    var H = first.offsetHeight, s = view.scrollTop;
    if (!H) return;
    if (s >= 1.5 * H) { view.scrollTop = s - H; if (vd) vs -= H; }
    else if (s < 0.5 * H) { view.scrollTop = s + H; if (vd) vs += H; }
  });

  function step(t) {
    var H = first.offsetHeight, dt = Math.min(t - lastT, 50);
    lastT = t;
    if (H) {
      if (!ready) { pos = H; view.scrollTop = H; ready = true; }
      else if (!reduceTl && !hovering && t > pauseUntil) {
        if (resync) { pos = view.scrollTop; resync = false; }
        pos += dt * 0.025;
        if (pos >= 1.5 * H) pos -= H;
        view.scrollTop = pos;
      }
    }
    requestAnimationFrame(step);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ready = false; });
  requestAnimationFrame(step);

  // Countdown ke 30 Oktober seterusnya (sekarang: 2027)
  var cdD = $('#cdDays'), cdL = $('#cdLabel'), cdS = $('#cdSub');
  function pad(n) { return n < 10 ? '0' + n : n; }
  function tick() {
    var now = new Date(), y = now.getFullYear(), t = new Date(y, 9, 30);
    if (now >= new Date(y, 9, 31)) t = new Date(y + 1, 9, 30);
    var d = t - now;
    if (d <= 0) { cdD.textContent = '🎂'; cdL.textContent = 'Hari ni birthday awak!'; cdS.textContent = ''; return; }
    var s = Math.floor(d / 1000);
    cdD.textContent = Math.floor(s / 86400);
    cdL.textContent = 'hari ke 30 Okt ' + t.getFullYear();
    cdS.textContent = pad(Math.floor(s % 86400 / 3600)) + ' jam ' + pad(Math.floor(s % 3600 / 60)) + ' min ' + pad(s % 60) + ' saat';
  }
  tick();
  setInterval(tick, 1000);
})();

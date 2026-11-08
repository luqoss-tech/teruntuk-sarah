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
    'Awak memang layak dapat semua bunga di dunia ini.',
    'Terima kasih sebab wujud dalam hidup saya, Aina.',
    'Setiap kelopak ros ni, satu doa untuk kebahagiaan awak.'
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

  // Timeline: gandakan senarai untuk loop, nod di tengah kotak menyala
  var view = $('#tlView'), track = $('#tlTrack');
  var clone = track.firstElementChild.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting); });
    }, { root: view, rootMargin: '-42% 0px -42% 0px' });
    track.querySelectorAll('li').forEach(function (li) { io.observe(li); });
  }
  view.addEventListener('pointerdown', function () { view.classList.add('hold'); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    view.addEventListener(ev, function () { view.classList.remove('hold'); });
  });

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
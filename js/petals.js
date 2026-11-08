/* petals.js — kelopak ros jatuh + letupan hati (canvas #fx)
   Expose: Petals.start() dan Petals.burst(x, y) */
(function () {
  var cv = document.getElementById('fx');
  var cx = cv.getContext('2d');
  var W, H;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cols = ['#ff4d8d', '#ffb3d1', '#ffd6e7', '#8b1e3f', '#c2185b'];
  var petals = [], hearts = [], running = false;

  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener('resize', size);
  size();

  function makePetal(top) {
    return {
      x: Math.random() * W,
      y: top ? -20 : Math.random() * H,
      r: 6 + Math.random() * 8,
      vy: .5 + Math.random() * .9,
      sw: Math.random() * 6.28,
      sp: .01 + Math.random() * .02,
      rot: Math.random() * 6.28,
      vr: (Math.random() - .5) * .03,
      c: cols[Math.random() * cols.length | 0]
    };
  }

  function loop() {
    cx.clearRect(0, 0, W, H);

    petals.forEach(function (p) {
      p.y += p.vy; p.sw += p.sp; p.x += Math.sin(p.sw) * .8; p.rot += p.vr;
      if (p.y > H + 20) Object.assign(p, makePetal(true));
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.fillStyle = p.c;
      cx.globalAlpha = .8;
      cx.beginPath();
      cx.ellipse(0, 0, p.r, p.r * .6, 0, 0, 6.28);
      cx.fill();
      cx.restore();
    });

    for (var i = hearts.length - 1; i >= 0; i--) {
      var h = hearts[i];
      h.x += h.vx; h.y += h.vy; h.vy += .25; h.vx *= .99; h.life -= .012;
      if (h.life <= 0) { hearts.splice(i, 1); continue; }
      cx.globalAlpha = h.life;
      cx.fillStyle = h.c;
      cx.font = h.sz + 'px serif';
      cx.fillText('♥', h.x, h.y);
    }

    cx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    for (var i = 0; i < (reduce ? 10 : 30); i++) petals.push(makePetal(false));
    loop();
  }

  function burst(x, y) {
    for (var i = 0; i < 50; i++) {
      var a = Math.random() * 6.28, s = 3 + Math.random() * 7;
      hearts.push({
        x: x, y: y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4,
        life: 1, sz: 12 + Math.random() * 16,
        c: cols[Math.random() * 3 | 0]
      });
    }
  }

  window.Petals = { start: start, burst: burst };
})();
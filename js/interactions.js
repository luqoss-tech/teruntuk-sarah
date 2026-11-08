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
})();
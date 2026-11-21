document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var form = document.querySelector("form.contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var name = form.querySelector("#nume") ? form.querySelector("#nume").value : "";
      var subject = encodeURIComponent("Cerere curs MEDTACT — " + name);
      var body = [];
      form.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (el.name && el.value) body.push(el.name + ": " + el.value);
      });
      var mailto = "mailto:tuguidaniasi@gmail.com?subject=" + subject + "&body=" + encodeURIComponent(body.join("\n"));
      window.location.href = mailto;
      if (status) status.textContent = "Se deschide aplicația de email cu datele completate.";
    });
  }
});

/* Metronom RCP: 110 bătăi pe minut, cu sunet scurt la fiecare compresie */
(function () {
  var box = document.getElementById("metronom");
  var btn = document.getElementById("metronom-btn");
  if (!box || !btn) return;
  var BPM = 110, timer = null, ctx = null;
  box.style.setProperty("--beat", Math.round(60000 / BPM) + "ms");
  function tick() {
    if (!ctx) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.09);
  }
  btn.addEventListener("click", function () {
    var on = !box.classList.contains("is-on");
    box.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Oprește metronomul" : "Pornește metronomul";
    if (on) {
      try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); ctx.resume(); } catch (e) { ctx = null; }
      tick(); timer = setInterval(tick, 60000 / BPM);
    } else { clearInterval(timer); }
  });
})();

/* Cifrele cresc o singură dată, când ajung în ecran */
(function () {
  var nums = document.querySelectorAll("[data-count]");
  if (!nums.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      var el = en.target, end = +el.getAttribute("data-count"), t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 900, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = "0"; requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io.observe(n); });
})();

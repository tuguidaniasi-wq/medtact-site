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

/* Antet care se strânge la derulare */
(function () {
  var h = document.querySelector(".site-header");
  if (!h) return;
  function on() { h.classList.toggle("scrolled", window.scrollY > 24); }
  on(); window.addEventListener("scroll", on, { passive: true });
})();

/* Apariție la derulare, o singură dată pe element */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sel = ".section-head, .box, .card, .course-card, .gallery figure, .stats, .verify-box, .fm, .portrait";
  var els = document.querySelectorAll(sel);
  if (!els.length) return;
  document.documentElement.classList.add("js-reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in"); io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) {
    if (el.closest(".hero")) return;
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(sibs, 4) * 70 + "ms";
    el.classList.add("reveal"); io.observe(el);
  });
})();

/* Primele minute: pași cu taste săgeți și bară de progres */
(function () {
  var root = document.querySelector("[data-steps]");
  if (!root) return;
  var tabs = root.querySelectorAll('[role="tab"]'), bar = root.querySelector(".fm-progress i");
  function show(i) {
    tabs.forEach(function (t, k) {
      var sel = k === i;
      t.setAttribute("aria-selected", sel ? "true" : "false");
      t.tabIndex = sel ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !sel;
    });
    if (bar) bar.style.width = ((i + 1) / tabs.length * 100) + "%";
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { show(i); });
    t.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
      if (n === null) return;
      n = (n + tabs.length) % tabs.length; show(n); tabs[n].focus(); e.preventDefault();
    });
  });
})();

/* Galerie: fotografia se mărește la apăsare */
(function () {
  var dlg = document.querySelector(".lightbox");
  var figs = document.querySelectorAll(".gallery figure");
  if (!dlg || !figs.length || typeof dlg.showModal !== "function") return;
  var img = dlg.querySelector("img"), cap = dlg.querySelector("p");
  figs.forEach(function (f) {
    f.tabIndex = 0;
    function open() {
      var i = f.querySelector("img");
      img.src = i.src; img.alt = i.alt;
      cap.textContent = f.querySelector("figcaption") ? f.querySelector("figcaption").textContent : "";
      dlg.showModal();
    }
    f.addEventListener("click", open);
    f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  dlg.querySelector(".lightbox-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();

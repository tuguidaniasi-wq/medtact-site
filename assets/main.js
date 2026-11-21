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

document.addEventListener("DOMContentLoaded", () => {
  // Load Header
  fetch("/assets/templates/header.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("header-container");
      if (container) container.innerHTML = html;
    });

  // Load Footer
  fetch("/assets/templates/footer.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("footer-container");
      if (container) container.innerHTML = html;
    });
});

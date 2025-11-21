// header-footer.js
async function injectTemplate(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(path);
    const html = await res.text();
    el.innerHTML = html;
  } catch (e) {
    console.error("Failed to load template:", path, e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectTemplate("#site-header", "/assets/templates/header.html");
  injectTemplate("#site-footer", "/assets/templates/footer.html");
});

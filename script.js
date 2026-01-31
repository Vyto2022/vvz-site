/* VVZ Studio — tiny helpers (no frameworks) */
(function () {
  // Footer year
  const y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  // UA for server-side lead logs
  const ua = document.getElementById("ua");
  if (ua) ua.value = navigator.userAgent;

  // Sticky CTA visibility (mobile)
  const sticky = document.querySelector(".sticky-cta");
  const contact = document.getElementById("contact");
  const hero = document.querySelector(".hero-card");

  if (!sticky || !contact) return;

  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

  const update = () => {
    if (!isMobile()) {
      sticky.classList.remove("is-visible");
      return;
    }

    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const contactTop = contact.getBoundingClientRect().top;

    // Show after hero, hide when user is already at contact
    const show = heroBottom < 0 && contactTop > 120;
    sticky.classList.toggle("is-visible", show);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

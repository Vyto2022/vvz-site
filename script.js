
(() => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"], input[type="submit"]');
    const oldTxt = btn ? (btn.value ?? btn.textContent) : null;
    if (btn) { btn.disabled = true; (btn.value !== undefined) ? (btn.value = "Sending...") : (btn.textContent = "Sending..."); }

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        window.location.href = new URL("thanks.html", window.location.href).toString();
        return;
      }

      let msg = "Form error. Try again.";
      try {
        const data = await res.json();
        if (data?.errors?.[0]?.message) msg = data.errors[0].message;
      } catch {}
      alert(msg);

    } catch (err) {
      alert("Network error. Try again.");
    } finally {
      if (btn) { btn.disabled = false; (btn.value !== undefined) ? (btn.value = oldTxt) : (btn.textContent = oldTxt); }
    }
  });
})();
// Sticky CTA: show on scroll (mobile), hide when in contact section
(() => {
  const sticky = document.getElementById("stickyCta");
  const contact = document.getElementById("contact");
  if (!sticky || !contact) return;

  const showAfter = 260; // px scrolled before showing
  const setVisible = (v) => {
    sticky.classList.toggle("is-visible", v);
    sticky.setAttribute("aria-hidden", v ? "false" : "true");
  };

  // Show after scroll threshold
  const onScroll = () => {
    const shouldShow = window.scrollY > showAfter;
    setVisible(shouldShow);
  };

  // Hide when Contact section is visible
  const io = new IntersectionObserver(
    (entries) => {
      const inContact = entries.some((e) => e.isIntersecting);
      sticky.classList.toggle("is-visible", !inContact && window.scrollY > showAfter);
    },
    { threshold: 0.15 }
  );
  io.observe(contact);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
// Quick message: prefill form + focus message
(() => {
  const btn = document.getElementById("quickMsgBtn");
  const contact = document.getElementById("contact");
  if (!btn || !contact) return;

  const project = document.getElementById("project");
  const message = document.getElementById("message");

  btn.addEventListener("click", (e) => {
    // Let the hash navigation happen, but also prefill
    // Small delay to ensure the section is in view on some browsers
    setTimeout(() => {
      // Default to Pro (you can change)
      if (project) project.value = "Pro";

      if (message) {
        const template =
           `Niche :
            Ville :
            Offre principale :
            Objectif (appels / leads / réservations) :
            Site actuel (optionnel) :
            Notes :`;

        if (!message.value || message.value.trim().length < 5) {
          message.value = template;
        }
        message.focus();
        message.setSelectionRange(message.value.length, message.value.length);
      }
    }, 120);
  });
})();

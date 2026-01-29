
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

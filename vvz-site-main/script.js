(function () {
  const burger = document.querySelector('[data-burger]');
  const mobile = document.querySelector('[data-mobile]');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const isOpen = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Lightweight mailto builder for the contact form (no backend needed).
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const to = form.getAttribute('data-mailto') || '';
      const name = form.querySelector('[name="name"]')?.value?.trim() || '';
      const phone = form.querySelector('[name="phone"]')?.value?.trim() || '';
      const city = form.querySelector('[name="city"]')?.value?.trim() || '';
      const msg = form.querySelector('[name="message"]')?.value?.trim() || '';

      const subject = form.getAttribute('data-subject') || 'New lead';
      const bodyLines = [
        'Name: ' + name,
        'Phone: ' + phone,
        'City: ' + city,
        '',
        msg
      ];
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      window.location.href = mailto;
    });
  }
})();

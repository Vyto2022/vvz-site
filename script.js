/**
 * VVZ Studio — static site helper (works on localhost + GitHub Pages).
 *
 * Default: Formspree (reliable for static hosting).
 * Optional: Google Sheets via Google Apps Script Web App.
 */
const CONFIG = {
  submitMode: 'googlesheets', // 'formspree' | 'googlesheets'
  formspreeEndpoint: 'https://formspree.io/f/xjgwkwgo',
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbyQY6ipT74ZUNR2XW2bEUyTiH1j27rXnxKRxIaaowgFBsYbqkGKLzJ967XGIofLK_n-/exec', // https://script.google.com/macros/s/XXXXX/exec
  thankYouPage: 'thanks.html',
};

function $(sel, root=document){ return root.querySelector(sel); }

function initHashOffset(){
  if (!location.hash) return;
  const el = document.getElementById(location.hash.slice(1));
  if (!el) return;
  setTimeout(() => el.scrollIntoView({behavior:'smooth', block:'start'}), 80);
}

function initForm(){
  const form = $('#quoteForm');
  if (!form) return;

  // keep action coherent
  if (CONFIG.submitMode === 'formspree') form.setAttribute('action', CONFIG.formspreeEndpoint);
  if (CONFIG.submitMode === 'googlesheets' && CONFIG.googleScriptUrl) form.setAttribute('action', CONFIG.googleScriptUrl);

  const btn = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#formStatus');

  function setStatus(text, cls){
    if (!status) return;
    status.className = 'status ' + (cls || '');
    status.textContent = text || '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    if (btn) { btn.disabled = true; btn.style.opacity = '0.85'; }

    const fd = new FormData(form);

    try{
      if (CONFIG.submitMode === 'googlesheets'){
        if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.includes("PASTE_")) throw new Error("Google Sheets is enabled. Paste your Apps Script Web App URL into script.js → CONFIG.googleScriptUrl (ends with /exec). See README.");
        await fetch(CONFIG.googleScriptUrl, { method:'POST', body: fd, mode:'no-cors' });
        setStatus('Sent. Redirecting…', 'ok');
        setTimeout(() => location.href = CONFIG.thankYouPage, 450);
        return;
      }

      const res = await fetch(CONFIG.formspreeEndpoint, {
        method:'POST',
        body: fd,
        headers:{'Accept':'application/json'}
      });

      if (!res.ok){
        let msg = 'Send failed. Please try again or message via Telegram.';
        try{
          const j = await res.json();
          if (j?.errors?.[0]?.message) msg = j.errors[0].message;
        }catch(_){}
        throw new Error(msg);
      }

      setStatus('Sent. Redirecting…', 'ok');
      setTimeout(() => location.href = CONFIG.thankYouPage, 450);
    }catch(err){
      console.error(err);
      setStatus(String(err.message || err), 'err');
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHashOffset();
  initForm();
});

document.addEventListener("DOMContentLoaded", function () {
  // ===== ОПРЕДЕЛЯЕМ ЯЗЫК СТРАНИЦЫ =====
  // Читаем атрибут lang у тега <html>. Если его нет, по умолчанию ставим 'en'
  const currentLang = document.documentElement.lang || 'en';

  // Словарь фраз интерфейса для бота
  const botPhrases = {
    ru: {
      greeting: "Привет! Я умный помощник VVZ Studio 🤖\nЗадай мне вопрос про создание сайта, цены или сроки, и я постараюсь ответить!",
      fallback: "Хм, не нашел точного ответа 😅\nОставьте заявку в форме ниже, и мы с радостью проконсультируем вас лично!"
    },
    fr: {
      greeting: "Salut ! Je suis l'assistant intelligent de VVZ Studio 🤖\nPosez-moi des questions sur la création de site, les prix ou les délais !",
      fallback: "Hmm, je n'ai pas trouvé de réponse exacte 😅\nLaissez une demande dans le formulaire ci-dessous et nous vous conseillerons personnellement !"
    },
    en: {
      greeting: "Hi! I'm the VVZ Studio smart assistant 🤖\nAsk me about pricing, timelines, SEO, or integrations.",
      fallback: "Hmm, I couldn't find an exact answer 😅\nPlease leave a request in the form below, and we'll be happy to advise you personally!"
    }
  };

  // Выбираем фразы под текущий язык (если язык не найден, берем английский)
  const phrases = botPhrases[currentLang] || botPhrases['en'];

  // ===== Элементы =====
  const list = document.querySelector(".faq__list"); 
  const up = document.getElementById("faqUp");
  const down = document.getElementById("faqDown");
  const chat = document.getElementById("faqbotChat");
  const form = document.getElementById("faqbotForm");
  const input = document.getElementById("faqbotInput");
  const chips = document.querySelectorAll(".faqbot__chip");

  if (!list || !chat || !form || !input) return;

  // ===== Сбор базы знаний из HTML (работает на любом языке, так как берет текст из самого HTML) =====
  const detailEls = Array.from(list.querySelectorAll("details.faq__item"));
  const faqItems = detailEls.map((d) => ({
    q: (d.querySelector("summary")?.textContent || "").trim(),
    a: (d.querySelector(".faq__answer")?.textContent || "").trim(),
  }));

  // ===== Скрытая база знаний (мультиязычная) =====
  const knowledgeBase = [
    {
      // Ключевые слова на всех трех языках (чтобы бот понимал, о чем речь)
      keys: "цена стоимость прайс сколько стоит бюджет price prix tarif cout",
      a: {
        ru: "Стоимость зависит от объёма: секции, дизайн, языки (RU/FR/EN). Скажи нишу и цель лендинга — дам точную вилку.",
        fr: "Le prix dépend du volume : sections, design, langues (RU/FR/EN). Dites-moi votre niche et le but, je vous donnerai une fourchette exacte.",
        en: "The cost depends on the scope: sections, design, languages. Tell me your niche and goal, and I'll give you an exact range."
      }
    },
    {
      keys: "сроки время сколько дней разработка time jours temps delay",
      a: {
        ru: "По срокам обычно 3–7 рабочих дней для лендинга.",
        fr: "Le délai habituel est de 3 à 7 jours ouvrables pour une landing page.",
        en: "The usual timeframe is 3–7 business days for a landing page."
      }
    },
    {
      keys: "мобильный адаптив smartphone mobile",
      a: {
        ru: "Мы делаем Mobile-First: лендинг будет идеально работать на смартфонах.",
        fr: "Nous créons en 'Mobile-First' : la page fonctionnera parfaitement sur les smartphones.",
        en: "We build Mobile-First: the landing page will work perfectly on smartphones."
      }
    },
    {
      keys: "seo гугл продвижение google référencement",
      a: {
        ru: "Мы закладываем базовое SEO: структура заголовков, мета-теги, скорость загрузки.",
        fr: "Nous incluons le SEO de base : structure des balises, balises méta, vitesse de chargement.",
        en: "We include basic SEO: header structure, meta tags, and fast loading speed."
      }
    }
  ];

  // ===== Утилиты для текста =====
  const norm = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^\p{L}\p{N}\s]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const tokenSet = (s) => new Set(norm(s).split(" ").filter(Boolean));

  function overlapScore(query, text) {
    const q = tokenSet(query);
    const t = tokenSet(text);
    if (!q.size || !t.size) return 0;
    let hit = 0;
    for (const w of q) if (t.has(w)) hit++;
    return hit / q.size;
  }

  // ===== Поиск по FAQ =====
  function findFaqAnswer(userText) {
    let best = { idx: -1, score: 0 };
    faqItems.forEach((it, idx) => {
      const s = overlapScore(userText, it.q);
      if (s > best.score) best = { idx, score: s };
    });
    if (best.score >= 0.28)
      return { ...faqItems[best.idx], idx: best.idx, score: best.score };
    return null;
  }

  // ===== Поиск по скрытой базе =====
  function findKbAnswer(userText) {
    let best = { a: "", score: 0 };
    knowledgeBase.forEach((it) => {
      const s = overlapScore(userText, it.keys);
      // Если находим совпадение, берем ответ на нужном языке
      if (s > best.score) best = { a: it.a[currentLang] || it.a['en'], score: s };
    });
    return best.score >= 0.2 ? best.a : "";
  }

  // ===== Интерфейс чата =====
  function addMsg(role, text) {
    const wrap = document.createElement("div");
    wrap.className = `faqbot__msg faqbot__msg--${role}`;
    const bubble = document.createElement("div");
    bubble.className = "faqbot__bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    chat.appendChild(wrap);
    chat.scrollTop = chat.scrollHeight;
  }

  // БОТ ЗДОРОВАЕТСЯ НА НУЖНОМ ЯЗЫКЕ!
  addMsg("bot", phrases.greeting);

  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-q") || "";
      if (!q) return;
      input.value = q;
      input.focus();
    });
  });

  function scrollStep(direction) {
    const item = list.querySelector(".faq__item");
    const delta = item ? item.getBoundingClientRect().height + 10 : 120;
    list.scrollBy({ top: direction * delta, left: 0, behavior: "smooth" });
  }

  if (up) up.addEventListener("click", () => scrollStep(-1));
  if (down) down.addEventListener("click", () => scrollStep(1));

  function updateActive() {
    const rectList = list.getBoundingClientRect();
    const targetY = rectList.top + rectList.height * 0.38;

    let bestEl = null;
    let bestDist = Infinity;

    detailEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const dist = Math.abs(mid - targetY);
      if (dist < bestDist) {
        bestDist = dist;
        bestEl = el;
      }
    });

    detailEls.forEach((el) => el.classList.remove("is-active"));
    if (bestEl) bestEl.classList.add("is-active");
  }

  list.addEventListener("scroll", () => requestAnimationFrame(updateActive));
  setTimeout(updateActive, 100);

  // ===== Обработка отправки формы =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const userText = input.value.trim();
    if (!userText) return;

    addMsg("user", userText);
    input.value = "";

    const hit = findFaqAnswer(userText);
    if (hit) {
      addMsg("bot", hit.a);
      const target = detailEls[hit.idx];
      if (target) {
        target.open = true;
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
        updateActive();
      }
      return;
    }

    const kb = findKbAnswer(userText);
    if (kb) {
      addMsg("bot", kb);
      return;
    }

    // БОТ ОТВЕЧАЕТ ОБЩЕЙ ФРАЗОЙ НА НУЖНОМ ЯЗЫКЕ!
    addMsg("bot", phrases.fallback);
  });
});

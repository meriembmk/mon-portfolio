document.body.classList.add("js-loaded");

/* ═══════════════════════════
   main.js — Portfolio Meriem
   ═══════════════════════════ */
(function () {
  'use strict';

  /* ── Custom cursor ── */
  const cur  = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx+'px'; cur.style.top = my+'px'; }
  });
  if (ring) {
    (function tick() {
      rx += (mx-rx)*.14; ry += (my-ry)*.14;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(tick);
    })();
  }
  document.querySelectorAll('a,button,input,textarea,[data-h]').forEach(el => {
    el.addEventListener('mouseenter', () => { cur?.classList.add('hov'); ring?.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { cur?.classList.remove('hov'); ring?.classList.remove('hov'); });
  });

  /* ── Scroll reveal ── */
  new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } }),
    { threshold: .12, rootMargin: '0px 0px -40px 0px' }
  ).observe.bind(
    new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } }),
      { threshold: .12, rootMargin: '0px 0px -40px 0px' }
    )
  );
  const revealObs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); } }),
    { threshold: .1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Nav: active link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Nav: scroll background ── */
  const nav = document.querySelector('.nav');
  if (nav) window.addEventListener('scroll', () => {
    nav.style.background = scrollY > 20 ? 'rgba(10,9,16,.92)' : 'rgba(10,9,16,.65)';
  }, { passive: true });

  /* ── Mobile menu ── */
  const burger = document.querySelector('.nav__burger');
  const links  = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      const [s1,,s3] = burger.querySelectorAll('span');
      const mid = burger.querySelectorAll('span')[1];
      s1.style.transform  = open ? 'translateY(6.5px) rotate(45deg)' : '';
      mid.style.opacity   = open ? '0' : '';
      s3.style.transform  = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ── Project filter ── */
  const fbts   = document.querySelectorAll('.filter-btn');
  const pcards = document.querySelectorAll('.proj-card');
  if (fbts.length) {
    fbts.forEach(btn => btn.addEventListener('click', () => {
      fbts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      pcards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f));
    }));
  }

  /* ── Contact form ── */
  const form = document.querySelector('.contact__form form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok  = form.querySelector('.form__success');
      const btn = form.querySelector('.form__submit');
      btn.textContent = 'Envoyé ✓'; btn.disabled = true;
      ok?.classList.add('vis');
      setTimeout(() => {
        form.reset(); btn.textContent = 'Envoyer le message'; btn.disabled = false; ok?.classList.remove('vis');
      }, 4000);
    });
  }

  /* ── Cert modal ── */
  const overlay     = document.getElementById('certModal');
  const modalImg    = document.getElementById('modalImg');
  const modalTitle  = document.getElementById('modalTitle');
  const modalDl     = document.getElementById('modalDownload');
  const modalClose  = document.getElementById('modalClose');

  function openModal(src, title) {
    modalImg.src        = src;
    modalImg.alt        = title;
    modalTitle.textContent = title;
    modalDl.href        = src;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Click on a cert card → open modal (only if photo is set and loaded)
  document.querySelectorAll('.cert-card').forEach(card => {
    card.style.cursor = 'none';
    card.addEventListener('click', () => {
      const src   = card.dataset.photo;
      const title = card.dataset.title || '';
      if (!src) return;
      // Test if image actually exists before opening
      const test = new Image();
      test.onload  = () => openModal(src, title);
      test.onerror = () => {}; // silently skip if file missing
      test.src = src;
    });
  });

  // Load image into thumb preview if it exists
  document.querySelectorAll('.cert-card').forEach(card => {
    const src   = card.dataset.photo;
    const thumb = card.querySelector('.cert-card__thumb');
    if (!src || !thumb) return;
    const test = new Image();
    test.onload = () => {
      // Replace emoji fallback with real image + overlay
      thumb.classList.remove('cert-card__thumb--empty');
      thumb.innerHTML = `
        <img src="${src}" alt="${card.dataset.title || ''}">
        <div class="cert-card__thumb-overlay">Agrandir</div>
      `;
    };
    test.src = src;
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay)    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

})();

// Stage photo gallery modal
(function() {
  const overlay    = document.getElementById('photoModal');
  const modalImg   = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDl    = document.getElementById('modalDownload');
  const modalClose = document.getElementById('modalClose');

  function openModal(src, caption) {
    modalImg.src = src;
    modalImg.alt = caption;
    modalTitle.textContent = caption;
    modalDl.href = src;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.stage-photo').forEach(el => {
    el.addEventListener('click', () => {
      const src     = el.dataset.src;
      const caption = el.dataset.caption || '';
      if (!src) return;
      openModal(src, caption);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay)    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

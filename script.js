/* =============================================
   SAND BEACH — script.js
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR ---- */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- SCROLL ANIMATION ---- */
  const animEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(el.parentNode.querySelectorAll('[data-animate]'));
        const idx = siblings.indexOf(el);
        setTimeout(() => el.classList.add('visible'), idx * 120);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  animEls.forEach(el => observer.observe(el));

  /* ---- COUNT-UP ANIMATION ---- */
  const countEls = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  /* ---- RESTAURANT MENU TABS ---- */
  const rmtBtns     = document.querySelectorAll('.rmt-btn');
  const rmtContents = document.querySelectorAll('.rmt-content');

  rmtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.rtab;
      rmtBtns.forEach(b => b.classList.remove('active'));
      rmtContents.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('rmt-' + target);
      if (panel) {
        panel.classList.add('active');
        panel.style.animation = 'none';
        panel.offsetHeight;
        panel.style.animation = 'fadeIn 0.4s ease forwards';
      }
    });
  });

  /* ---- RESTAURANT PARTICLES ---- */
  const restParticles = document.getElementById('restParticles');
  if (restParticles) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 4 + 1;
      p.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:rgba(${Math.random() > 0.5 ? '0,180,216' : '201,168,76'},${Math.random() * 0.5 + 0.1});
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation: restParticleFloat ${Math.random() * 10 + 8}s ease-in-out infinite alternate;
        animation-delay:${Math.random() * 5}s;
      `;
      restParticles.appendChild(p);
    }
    const ps = document.createElement('style');
    ps.textContent = `
      @keyframes restParticleFloat {
        0%   { transform: translate(0,0) scale(1); opacity:0.3; }
        50%  { opacity:1; }
        100% { transform: translate(${Math.random()*60-30}px,${Math.random()*-80-20}px) scale(1.4); opacity:0.1; }
      }
    `;
    document.head.appendChild(ps);
  }

  /* ---- GALLERY FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight;
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ---- GALLERY LIGHTBOX ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxIcon = document.getElementById('lightboxIcon');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const icon  = item.querySelector('.gal-icon').textContent;
      const title = item.querySelector('.gal-overlay p').textContent;
      lightboxIcon.textContent  = icon;
      lightboxTitle.textContent = title;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ---- REVIEWS SLIDER ---- */
  const track   = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  const dotsContainer = document.getElementById('sliderDots');

  const cards = track.querySelectorAll('.review-card');
  let current = 0;
  let perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const total = Math.ceil(cards.length / perView);

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'انتقل إلى الشريحة ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = (idx + total) % total;
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(${current * perView * cardWidth}px)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function updatePerView() {
    perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    goTo(0);
    buildDots();
  }

  buildDots();
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  window.addEventListener('resize', updatePerView);

  // Auto-advance
  let autoSlide = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo(current + 1), 5000);
  });

  /* Touch swipe for slider */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });

  /* ---- GUEST COUNTER ---- */
  const guestInput = document.getElementById('guests');
  const guestMinus = document.getElementById('guestMinus');
  const guestPlus  = document.getElementById('guestPlus');

  guestMinus.addEventListener('click', () => {
    const val = parseInt(guestInput.value, 10);
    if (val > 1) guestInput.value = val - 1;
  });
  guestPlus.addEventListener('click', () => {
    const val = parseInt(guestInput.value, 10);
    if (val < 300) guestInput.value = val + 1;
  });

  /* ---- SET MIN DATE ---- */
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ---- BOOKING FORM ---- */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');
  const newBookingBtn = document.getElementById('newBooking');

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    ['nameError','phoneError','emailError','typeError','dateError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  function validateForm() {
    clearErrors();
    let valid = true;
    const name  = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const type  = document.getElementById('bookingType').value;
    const date  = document.getElementById('bookingDate').value;

    if (!name || name.length < 2) {
      showError('nameError', 'يرجى إدخال الاسم الكامل');
      valid = false;
    }
    if (!phone || !/^[\d\s\+\-]{7,}$/.test(phone)) {
      showError('phoneError', 'يرجى إدخال رقم هاتف صحيح');
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('emailError', 'يرجى إدخال بريد إلكتروني صحيح');
      valid = false;
    }
    if (!type) {
      showError('typeError', 'يرجى اختيار نوع الحجز');
      valid = false;
    }
    if (!date) {
      showError('dateError', 'يرجى اختيار تاريخ الحجز');
      valid = false;
    }
    return valid;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      const submitBtn = bookingForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>جارٍ الإرسال...</span>';

      setTimeout(() => {
        bookingForm.style.display = 'none';
        formSuccess.classList.add('visible');
      }, 1200);
    });
  }

  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', () => {
      formSuccess.classList.remove('visible');
      bookingForm.style.display = 'block';
      bookingForm.reset();
      const submitBtn = bookingForm.querySelector('[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>تأكيد الحجز</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      clearErrors();
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- ACTIVE NAV LINK on SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- PARALLAX on HERO ---- */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const waves = document.querySelectorAll('.wave');
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.3}px)`;
    waves.forEach((w, i) => {
      w.style.transform = `rotate(${y * 0.02 * (i + 1)}deg)`;
    });
  }, { passive: true });

  /* ---- SCROLL INDICATOR CLICK ---- */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---- INJECT KEYFRAMES for gallery filter animation ---- */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
    .nav-link.active-link {
      color: var(--turq-light) !important;
      background: rgba(0,180,216,0.1) !important;
    }
  `;
  document.head.appendChild(styleSheet);

});

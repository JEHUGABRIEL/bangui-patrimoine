// ===== Page Loader =====
window.addEventListener('load', function() {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(function() { loader.style.display = 'none'; }, 350);
});

// ===== Hero Carousel =====
(function() {
  var heroCarousel = document.getElementById('heroCarousel');
  if (!heroCarousel) return;

  var heroIdx  = 0;
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroTitles = [
    'Un pied en France,<br>votre maison à Bangui',
    'Sécurisez votre terrain,<br>construisez votre héritage',
    'Votre patrimoine géré<br>de Paris à Bangui'
  ];
  var heroSubs = [
    'Bangui Patrimoine accompagne la diaspora centrafricaine dans l\'acquisition de terrain, la construction et la gestion de patrimoine immobilier en RCA — depuis la France, en toute sérénité.',
    'Vérification des titres fonciers, sécurisation juridique et suivi de chantier hebdomadaire. Votre investissement est entre de bonnes mains.',
    'Du conseil en investissement à la planification successorale, nous gérons votre patrimoine immobilier centrafricain avec rigueur et transparence.'
  ];

  var heroTimer;

  window.goHero = function(n) {
    heroSlides[heroIdx].classList.remove('active');
    heroIdx = (n + heroSlides.length) % heroSlides.length;
    heroSlides[heroIdx].classList.add('active');
    document.getElementById('heroTitle').innerHTML = heroTitles[heroIdx];
    document.getElementById('heroSub').textContent  = heroSubs[heroIdx];
  };

  function startHeroTimer() {
    heroTimer = setInterval(function() { window.goHero(heroIdx + 1); }, 6000);
  }
  startHeroTimer();
  heroCarousel.addEventListener('mouseenter', function() { clearInterval(heroTimer); });
  heroCarousel.addEventListener('mouseleave', startHeroTimer);

  // Parallax léger
  function updateParallax() {
    var rect = heroCarousel.getBoundingClientRect();
    var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    progress = Math.max(0, Math.min(1, progress));
    var offset = (progress - 0.5) * 24;
    heroSlides.forEach(function(s) {
      s.style.backgroundPositionY = 'calc(50% - ' + offset + 'px)';
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() { updateParallax(); ticking = false; });
      ticking = true;
    }
  });
  updateParallax();
})();

// ===== Mobile Menu =====
(function() {
  var toggle  = document.getElementById('menuToggle');
  var nav     = document.getElementById('navMenu');
  var overlay = document.getElementById('menuOverlay');
  if (!toggle) return;

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('active');
    toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });
})();

// ===== Testimonials Carousel =====
(function() {
  var track = document.getElementById('temoTrack');
  if (!track) return;

  var idx   = 0;
  var total = 4;
  var timer;

  function pct() {
    if (window.innerWidth >= 1024) return 33.333;
    if (window.innerWidth >= 640)  return 50;
    return 100;
  }

  function move() {
    track.style.transform = 'translateX(-' + (idx * pct()) + '%)';
  }

  window.goTemo = function(n) {
    idx = (n + total) % total;
    move();
  };

  var rTimer;
  window.addEventListener('resize', function() {
    clearTimeout(rTimer);
    rTimer = setTimeout(move, 200);
  });

  function startTimer() { timer = setInterval(function() { window.goTemo(idx + 1); }, 5000); }
  startTimer();
  track.addEventListener('mouseenter', function() { clearInterval(timer); });
  track.addEventListener('mouseleave', startTimer);

  // Swipe tactile
  var startX = null;
  track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function(e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? window.goTemo(idx + 1) : window.goTemo(idx - 1); }
    startX = null;
  });
})();

// ===== Scroll Reveal =====
(function() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(el) { io.observe(el); });

  window.observeReveal = function(nodes) {
    nodes.forEach(function(n) { io.observe(n); });
  };
})();

// ===== Contact Form =====
window.submitContactForm = function() {
  var prenom  = document.getElementById('cfPrenom').value.trim();
  var nom     = document.getElementById('cfNom').value.trim();
  var email   = document.getElementById('cfEmail').value.trim();
  var projet  = document.getElementById('cfProjet').value;
  var tel     = document.getElementById('cfTel').value.trim();
  var message = document.getElementById('cfMessage').value.trim();

  if (!prenom || !nom || !email || !projet) {
    alert('Merci de remplir les champs obligatoires (Prénom, Nom, Email, Type de projet).');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Merci de renseigner une adresse email valide.');
    return;
  }

  var btn = document.getElementById('cfSubmit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';

  // Simulation d'envoi (à remplacer par un vrai backend ou EmailJS)
  setTimeout(function() {
    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('contactSuccess').classList.remove('hidden');

    // Si EmailJS est configuré, décommenter :
    // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
    //   from_name: prenom + ' ' + nom,
    //   from_email: email,
    //   phone: tel,
    //   project_type: projet,
    //   message: message
    // });
  }, 1200);
};

// ===== Active nav link on scroll =====
(function() {
  var sections = document.querySelectorAll('div[id], section[id]');
  var navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function(s) {
      if (s.offsetTop <= scrollY && (s.offsetTop + s.offsetHeight) > scrollY) {
        navLinks.forEach(function(a) {
          a.classList.remove('text-gold');
          if (a.getAttribute('href') === '#' + s.id) {
            a.classList.add('text-gold');
          }
        });
      }
    });
  });
})();

// --- Carrousel/Galerie de certifications (index) ---
document.addEventListener('DOMContentLoaded', function () {
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if (track && prev && next) {
    const slides = Array.from(track.children);
    let current = 0;
    const slideWidth = () => slides[0]?.offsetWidth || 220;
    function scrollToCurrent(behavior = 'smooth') {
      track.scrollTo({ left: current * slideWidth(), behavior });
    }
    // Initial scroll
    scrollToCurrent('auto');
    prev.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      scrollToCurrent();
    });
    next.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      scrollToCurrent();
    });
    // Responsive: update on resize
    window.addEventListener('resize', () => scrollToCurrent('auto'));
    // Adapt overflow for mobile
    function updateTrackOverflow() {
      if (window.innerWidth < 700) {
        track.style.overflowX = 'auto';
      } else {
        track.style.overflowX = 'hidden';
      }
    }
    updateTrackOverflow();
    window.addEventListener('resize', updateTrackOverflow);
    // Swipe support (mobile)
    let startX = null;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      if (startX !== null) {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) prev.click();
        else if (dx < -40) next.click();
        startX = null;
      }
    });
    // Agrandissement au clic (overlay déjà existant)
    slides.forEach(img => {
      img.addEventListener('click', () => {
        const overlay = document.getElementById('certifOverlay');
        const overlayImg = document.getElementById('overlayImg');
        if (overlay && overlayImg) {
          overlayImg.src = img.src;
          overlayImg.alt = img.alt;
          overlay.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
});

// --- Fermeture overlay certif carrousel (index) ---
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('certifOverlay');
  const overlayImg = document.getElementById('overlayImg');
  const closeOverlay = document.getElementById('closeOverlay');
  if (overlay && overlayImg && closeOverlay) {
    closeOverlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      overlayImg.src = '';
      document.body.style.overflow = '';
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        overlayImg.src = '';
        document.body.style.overflow = '';
      }
    });
    // Accessibilité : tabIndex pour l'image agrandie
    overlayImg.tabIndex = 0;
  }
});

// --- Transition slide/fade entre les pages ---
document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.getElementById('mainContent');
  if (mainContent) {
    mainContent.classList.add('page-transition');
    document.querySelectorAll('nav a, .nav-list a, .nav-wireframes-link').forEach(link => {
      // Ouvre dans la même fenêtre uniquement
      if (link.target !== '_blank' && link.href && !link.href.startsWith('mailto:')) {
        // Désactive la transition pour les liens d'ancre interne (sommaire)
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) return;
        link.addEventListener('click', function (e) {
          // Ignore si déjà sur la page
          if (link.getAttribute('aria-current') === 'page' || link.classList.contains('active')) return;
          e.preventDefault();
          mainContent.classList.add('page-transition-leave');
          setTimeout(() => {
            window.location.href = link.href;
          }, 420);
        });
      }
    });
  }
});

// --- Menu sommaire mobile moderne pour wireframes.html ---
document.addEventListener('DOMContentLoaded', function () {
  const menuToggleSummary = document.getElementById('menuToggleWireframesSummary');
  const summaryList = document.getElementById('summaryList');
  if (menuToggleSummary && summaryList) {
    // Affiche le bouton sur mobile
    function updateSummaryMenuDisplay() {
      if (window.innerWidth <= 700) {
        menuToggleSummary.style.display = 'flex';
        summaryList.classList.remove('open');
        menuToggleSummary.setAttribute('aria-expanded', 'false');
      } else {
        menuToggleSummary.style.display = 'none';
        summaryList.classList.remove('open');
        menuToggleSummary.setAttribute('aria-expanded', 'false');
        summaryList.style.display = '';
      }
    }
    updateSummaryMenuDisplay();
    window.addEventListener('resize', updateSummaryMenuDisplay);
    menuToggleSummary.addEventListener('click', function () {
      const isOpen = summaryList.classList.contains('open');
      summaryList.classList.toggle('open');
      menuToggleSummary.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        summaryList.focus();
      }
    });
    // Fermer le menu si on clique ailleurs (mobile UX)
    document.addEventListener('click', function (e) {
      if (!menuToggleSummary.contains(e.target) && !summaryList.contains(e.target) && window.innerWidth <= 700) {
        summaryList.classList.remove('open');
        menuToggleSummary.setAttribute('aria-expanded', 'false');
      }
    });
    // Accessibilité : fermer avec Echap
    summaryList.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        summaryList.classList.remove('open');
        menuToggleSummary.setAttribute('aria-expanded', 'false');
        menuToggleSummary.focus();
      }
    });
  }
});

// --- Sélecteur de thème multiple (compatible multi-pages) ---
document.addEventListener("DOMContentLoaded", () => {
  // Cherche un select dont l'id commence par 'themeSelector' (id unique par page)
  const themeSelector = document.querySelector('select[id^="themeSelector"]');
  if (!themeSelector) return;
  const body = document.body;
  const THEMES = ['light', 'dark', 'green', 'blue'];
  // Ajoute l'option Automatique si absente
  if (!themeSelector.querySelector('option[value="auto"]')) {
    const autoOpt = document.createElement('option');
    autoOpt.value = 'auto';
    autoOpt.textContent = 'Automatique';
    themeSelector.insertBefore(autoOpt, themeSelector.firstChild);
  }
  // Applique le thème système ou utilisateur
  function applyTheme(theme) {
    THEMES.forEach(t => body.classList.remove(t+'-mode'));
    if (theme === 'auto') {
      // Détecte le thème système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('dark-mode');
        body.style.color = '#f4f4f4';
      } else {
        body.classList.add('light-mode');
        body.style.color = '';
      }
    } else if (THEMES.includes(theme)) {
      body.classList.add(theme+'-mode');
      if (theme === 'dark' || theme === 'blue') {
        body.style.color = '#f4f4f4';
      } else {
        body.style.color = '';
      }
    }
  }
  // Applique le thème au chargement
  let savedTheme = localStorage.getItem('theme');
  if (!savedTheme) savedTheme = 'auto';
  themeSelector.value = savedTheme;
  applyTheme(savedTheme);
  // Réagit au changement système si en mode auto
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (themeSelector.value === 'auto') applyTheme('auto');
  });
  themeSelector.addEventListener('change', (e) => {
    const theme = e.target.value;
    if (theme === 'auto') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
    applyTheme(theme);
  });
});

// --- Affichage grand plan de la photo de profil (index) ---
document.addEventListener("DOMContentLoaded", () => {
  const profileImg = document.getElementById('profileImage');
  const overlay = document.getElementById('profileOverlay');
  const overlayImg = document.getElementById('overlayProfileImg');
  const closeOverlay = document.getElementById('closeProfileOverlay');
  if (profileImg && overlay && overlayImg && closeOverlay) {
    function openProfileOverlay() {
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      overlayImg.focus();
    }
    profileImg.addEventListener('click', openProfileOverlay);
    profileImg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openProfileOverlay();
    });
    closeOverlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      profileImg.focus();
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        profileImg.focus();
      }
    });
  }
});

// --- Filtrage dynamique des projets (fusionné et unifié) ---
document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("filterProjects");
  if (filter) {
    filter.addEventListener("change", () => {
      const selected = filter.value;
      document.querySelectorAll(".project-card, article[data-type]").forEach(card => {
        const type = card.getAttribute("data-type");
        card.style.display = (selected === "all" || type === selected) ? "block" : "none";
      });
    });
    // Affichage initial : tous
    filter.dispatchEvent(new Event("change"));
  }
});

// --- Affichage dynamique des certificats en grand plan ---
document.addEventListener("DOMContentLoaded", () => {
  const certifImgs = document.querySelectorAll('.certif-img');
  const overlay = document.getElementById('certifOverlay');
  const overlayImg = document.getElementById('overlayImg');
  const closeOverlay = document.getElementById('closeOverlay');
  if (certifImgs && overlay && overlayImg && closeOverlay) {
    const header = document.querySelector('.header');
    certifImgs.forEach(img => {
      img.addEventListener('click', () => {
        overlayImg.src = img.src;
        overlayImg.alt = img.alt;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (header) header.style.visibility = 'hidden';
        setTimeout(() => {
          overlayImg.focus();
          overlayImg.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 50);
      });
    });
    function closeCertifOverlay() {
      overlay.style.display = 'none';
      overlayImg.src = '';
      document.body.style.overflow = '';
      if (header) header.style.visibility = '';
    }
    closeOverlay.addEventListener('click', closeCertifOverlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCertifOverlay();
    });
    // Accessibilité : tabIndex pour l'image agrandie
    overlayImg.tabIndex = 0;
  }
});

// --- Effet dactylographié sur le message de bienvenue ---
document.addEventListener("DOMContentLoaded", () => {
  const welcomeText = document.getElementById("welcomeText");
  if (welcomeText) {
    const fullText = welcomeText.textContent;
    welcomeText.textContent = "";
    let i = 0;
    function typeWriter() {
      if (i < fullText.length) {
        welcomeText.textContent += fullText.charAt(i);
        i++;
        setTimeout(typeWriter, 18 + Math.random() * 30);
      }
    }
    setTimeout(typeWriter, 400);
  }
});

// --- Menu mobile toggle et dark mode manuel unifiés --- 
document.addEventListener("DOMContentLoaded", () => {
  // 📱 Menu mobile toggle
  const menuToggle = document.getElementById("menuToggle");
  const navList = document.getElementById("navList");
  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      navList.classList.toggle("hidden");
    });
  }

  // 🌒 Mode sombre manuel (optionnel, conservé pour fallback)
  const darkToggle = document.getElementById("darkToggle");
  const body = document.body;
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      body.classList.toggle('dark-mode');
      // Optionally, save preference
      if (window.localStorage) {
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
      }
    });
    // Load preference
    if (window.localStorage && localStorage.getItem('darkMode') === 'true') {
      body.classList.add('dark-mode');
    }
  }

  // 🔎 Surlignage lien actif
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.style.textDecoration = "underline";
      link.style.color = "#0077cc";
    }
  });
});

// Initialisation AOS (animations)
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-quad'
  });
  
  // Gestion du thème
  const toggleBtn = document.getElementById('themeToggleBtn');
  const bulbIcon = document.getElementById('bulbIcon');
  const htmlTag = document.documentElement;
  
  // Vérifie le thème sauvegardé ou préféré
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Applique le thème
  function applyTheme(theme) {
    htmlTag.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    bulbIcon.classList.toggle('lightbulb-on', theme === 'dark');
  }
  
  applyTheme(savedTheme);
  
  // Bouton toggle
  toggleBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-bs-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
  
  // Scroll fluide
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Mise à jour de l'URL sans rechargement
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });
  
  // Filtrage de la galerie
  const filterButtons = document.querySelectorAll('.btn-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Active le bouton
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filtre les items
      const filter = this.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.setAttribute('aria-hidden', 'false');
        } else {
          item.style.display = 'none';
          item.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });
  
  // Chargement paresseux des images
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback pour les anciens navigateurs
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          lazyLoadObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      lazyLoadObserver.observe(img);
    });
  }
});

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ici vous ajouteriez votre logique d'envoi (AJAX, etc.)
    alert('Merci pour votre message! Nous vous contacterons bientôt.');
    this.reset();
  });
}

// Animation des statistiques améliorée
let statsAnimated = false;

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000; // 2 secondes
  const increment = target / (duration / 16); // 60 FPS
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

function triggerStatsAnimation() {
  if (!statsAnimated) {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      animateCounter(counter);
    });
    statsAnimated = true;
  }
}

// Observer pour déclencher l'animation quand les stats deviennent visibles
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      triggerStatsAnimation();
    }
  });
}, { threshold: 0.5 });

// Observer les statistiques au chargement
document.addEventListener('DOMContentLoaded', function() {
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});
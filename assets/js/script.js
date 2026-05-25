/**
 * Double Eight for Business Solutions
 * Main JavaScript Engine — script.js
 *
 * Features:
 *  1. 3D Page Loader with exit animation
 *  2. Custom magnetic cursor with click ripple
 *  3. Scroll progress bar
 *  4. Navbar scroll behavior
 *  5. 3D scroll-reveal animations (IntersectionObserver)
 *  6. Animated number counters
 *  7. Typed text effect (hero)
 *  8. Parallax orbs
 *  9. Magnetic button effect
 * 10. Portfolio filter
 * 11. Contact form AJAX submission with validation
 * 12. Newsletter form AJAX submission
 * 13. Back-to-top button
 * 14. Cookie banner
 * 15. Mobile navigation
 * 16. Service details dynamic content
 * 17. Click ripple on every click
 * 18. 3D card tilt on hover
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. PAGE LOADER
══════════════════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  function hideLoader() {
    loader.classList.add('hide');
    const underline = document.querySelector('.underline-anim');
    if (underline) underline.classList.add('visible');
  }

  // Force hide after 2.5s no matter what
  setTimeout(hideLoader, 2500);
  if (document.readyState === 'complete') setTimeout(hideLoader, 1800);
})();

/* ══════════════════════════════════════════════════════════
   2. CUSTOM CURSOR + CLICK RIPPLE
══════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const interactives = 'a, button, .btn, .service-card, .portfolio-card, .blog-card, .filter-btn, input, textarea, select';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      dot.classList.add('hover');
      ring.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    }
  });

  // Click state + ripple
  document.addEventListener('mousedown', (e) => {
    dot.classList.add('click');
    ring.classList.add('click');
    createRipple(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('click');
    ring.classList.remove('click');
  });

  function createRipple(x, y) {
    const size = Math.random() * 80 + 60;
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
    `;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
})();

/* ══════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR
══════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   4. NAVBAR SCROLL BEHAVIOR
══════════════════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   5. SCROLL-REVEAL ANIMATIONS (3D ENTRY)
══════════════════════════════════════════ */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.entry-3d, .entry-3d-left, .entry-3d-right, .entry-flip, .entry-zoom, .fade-up, .fade-in, .stagger-children'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  targets.forEach(el => observer.observe(el));
  setTimeout(() => targets.forEach(el => el.classList.add('visible')), 2500); // force visible
})();

/* ══════════════════════════════════════════════════════════
   6. ANIMATED COUNTERS
══════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const suffix  = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   7. TYPED TEXT EFFECT
══════════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = ['SEO strategy', 'creative branding', 'media campaigns', 'data analytics', 'customer experience'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
    }
    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 2000); // Start after loader
})();

/* ══════════════════════════════════════════════════════════
   8. PARALLAX ORBS
══════════════════════════════════════════ */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    orbs.forEach((orb, i) => {
      const factor = i === 0 ? 1 : -0.6;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   9. 3D CARD TILT ON HOVER
══════════════════════════════════════════ */
(function init3DTilt() {
  const cards = document.querySelectorAll('.service-card, .portfolio-card, .value-card, .service-full-card, .blog-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) *  8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   10. PORTFOLIO FILTER
══════════════════════════════════════════ */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items       = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   11. CONTACT FORM — AJAX SUBMISSION
══════════════════════════════════════════ */
(function initContactForm() {
  const form         = document.getElementById('contact-form');
  if (!form) return;

  const successAlert = document.querySelector('.alert-success');
  const errorAlert   = document.querySelector('.alert-error');
  const submitBtn    = form.querySelector('[type="submit"]');

  function showAlert(el, message) {
    if (!el) return;
    el.querySelector('span').textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 6000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = (document.getElementById('name')?.value || '').trim();
    const email   = (document.getElementById('email')?.value || '').trim();
    const phone   = (document.getElementById('phone')?.value || '').trim();
    const service = (document.getElementById('service')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (!name || !email || !service || !message) {
      showAlert(errorAlert, 'Please fill in all required fields.');
      return;
    }

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled  = true;

    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message })
      });
      const data = await res.json();

      if (data.success) {
        form.reset();
        showAlert(successAlert, 'Your message has been sent successfully!');
      } else {
        showAlert(errorAlert, 'Something went wrong. Please try again.');
      }
    } catch (err) {
      showAlert(errorAlert, 'Network error. Please check your connection.');
    }

    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled  = false;
  });
})();

/* ══════════════════════════════════════════════════════════
   12. NEWSLETTER FORM — AJAX SUBMISSION
══════════════════════════════════════════ */
(function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input  = form.querySelector('input[type="email"]');
    const btn    = form.querySelector('button');
    const origTxt = btn.textContent;

    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#e74c3c';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }

    btn.textContent = '...';
    btn.disabled    = true;

    try {
      const fd = new FormData();
      fd.append('email', input.value);
      const res  = await fetch('php/newsletter.php', { method: 'POST', body: fd });
      const data = await res.json();
      btn.textContent = data.success ? '✓ Done!' : 'Error';
      if (data.success) input.value = '';
    } catch {
      btn.textContent = 'Error';
    } finally {
      setTimeout(() => {
        btn.textContent = origTxt;
        btn.disabled    = false;
      }, 3000);
    }
  });
})();

/* ══════════════════════════════════════════════════════════
   13. BACK TO TOP
══════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════════════════
   14. COOKIE BANNER
══════════════════════════════════════════ */
(function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (localStorage.getItem('de_cookies_accepted')) return;

  setTimeout(() => { banner.classList.add('show'); document.body.classList.add('cookie-visible'); }, 2500);

  function hideBanner() {
    banner.classList.remove('show');
    document.body.classList.remove('cookie-visible');
  }
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('de_cookies_accepted', '1');
    hideBanner();
  });

  document.getElementById('cookie-reject')?.addEventListener('click', () => {
    banner.classList.remove('show');
  });
})();

/* ══════════════════════════════════════════════════════════
   15. MOBILE NAVIGATION
══════════════════════════════════════════ */
(function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  const closeBtn  = document.querySelector('.nav-mobile-close');
  if (!hamburger || !mobileNav) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-mobile-overlay';
  document.body.appendChild(overlay);

  function openNav() {
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
})();

/* ══════════════════════════════════════════════════════════
   16. SERVICE DETAILS — DYNAMIC CONTENT
══════════════════════════════════════════ */
(function initServiceDetails() {
  const container = document.getElementById('service-dynamic-content');
  if (!container) return;

  const params  = new URLSearchParams(window.location.search);
  const service = params.get('service') || 'seo';

  const services = {
    seo: {
      title: 'SEO & Digital Strategy',
      subtitle: 'Dominate search results in Qatar and beyond with data-driven SEO.',
      tag: 'Core Service',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
      intro: 'Search engine optimization in the Qatari market requires a uniquely nuanced approach. With a bilingual audience that consumes content in both Arabic and English, and a rapidly evolving digital landscape shaped by Vision 2030, businesses need an SEO partner who understands both the technical fundamentals and the cultural context.',
      body: `<p>At Double Eight, our SEO practice is built on three pillars: technical excellence, content authority, and strategic link acquisition. We begin every engagement with a comprehensive technical audit that examines site architecture, Core Web Vitals, crawlability, and indexation. We then develop a keyword strategy that maps to the actual search behavior of your target audience in Qatar and the broader GCC region.</p>
             <p>Our content team produces high-quality, authoritative content in both Arabic and English, ensuring that your brand speaks authentically to every segment of your audience. We understand that direct translation is never enough — cultural adaptation is essential for true resonance.</p>`,
      features: [
        { title: 'Technical SEO Audit', desc: 'Comprehensive analysis of site health, Core Web Vitals, and crawl efficiency.' },
        { title: 'Bilingual Keyword Strategy', desc: 'Arabic and English keyword research aligned with Qatari search intent.' },
        { title: 'Content Authority Building', desc: 'Long-form, expert content that earns rankings and builds brand trust.' },
        { title: 'Local SEO', desc: 'Google Business Profile optimization and local citation building for Qatar.' },
        { title: 'Link Acquisition', desc: 'White-hat link building from authoritative regional and global sources.' },
        { title: 'Performance Reporting', desc: 'Monthly dashboards tracking rankings, traffic, and revenue attribution.' },
      ]
    },
    branding: {
      title: 'Creative & Branding',
      subtitle: 'Craft a brand identity that commands attention and builds lasting loyalty.',
      tag: 'Creative Services',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      intro: 'Your brand is the sum total of every interaction a customer has with your business. It is your most valuable intangible asset, and in the competitive Qatari market, a weak brand identity is a significant commercial liability.',
      body: `<p>Our branding practice combines strategic rigor with creative brilliance. We begin with deep brand discovery workshops that uncover your business's core purpose, competitive positioning, and audience insights. This strategic foundation informs every creative decision that follows.</p>
             <p>From logo design and visual identity systems to brand voice guidelines and messaging frameworks, we build comprehensive brand ecosystems that ensure consistency across every touchpoint — from your website and social media to your physical offices and marketing materials.</p>`,
      features: [
        { title: 'Brand Strategy', desc: 'Purpose, positioning, and competitive differentiation frameworks.' },
        { title: 'Visual Identity', desc: 'Logo, color palette, typography, and iconography systems.' },
        { title: 'Brand Guidelines', desc: 'Comprehensive governance documents for consistent brand application.' },
        { title: 'Brand Voice', desc: 'Tone of voice and messaging frameworks in Arabic and English.' },
        { title: 'Corporate Rebranding', desc: 'Strategic repositioning and identity evolution for established brands.' },
        { title: 'Brand Activation', desc: 'Launch campaigns and rollout strategies for new brand identities.' },
      ]
    },
    media: {
      title: 'Media & Advertising',
      subtitle: 'Precision-targeted campaigns that maximize ROI across every channel.',
      tag: 'Media Services',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
      intro: 'In an era of fragmented media consumption, reaching your target audience requires both sophisticated data intelligence and compelling creative execution. Our media practice delivers both.',
      body: `<p>We plan and execute integrated media campaigns that span paid search, social media advertising, programmatic display, video, and traditional out-of-home channels. Our approach is always data-first: we use audience intelligence tools to identify exactly where your customers are, what they are interested in, and when they are most receptive to your message.</p>
             <p>Our creative team produces campaign assets that are not just visually striking, but strategically designed to drive specific actions — whether that is a website visit, a lead form submission, or a direct purchase.</p>`,
      features: [
        { title: 'Integrated Media Planning', desc: 'Cross-channel strategy aligned with business objectives and audience behavior.' },
        { title: 'Google Ads', desc: 'Search, Shopping, Display, and YouTube campaign management.' },
        { title: 'Meta Advertising', desc: 'Facebook and Instagram campaigns with advanced audience targeting.' },
        { title: 'Programmatic Display', desc: 'Automated buying across premium publisher networks.' },
        { title: 'Creative Production', desc: 'Campaign assets including video, static, and dynamic creative formats.' },
        { title: 'Performance Optimization', desc: 'Continuous A/B testing and bid optimization for maximum ROI.' },
      ]
    },
    cx: {
      title: 'Customer Experience',
      subtitle: 'Design seamless digital journeys that build loyalty and drive advocacy.',
      tag: 'CX Services',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      intro: 'Customer experience is the new competitive battleground. In Qatar, where consumer expectations are shaped by world-class hospitality standards, digital experiences must match the quality of physical ones.',
      body: `<p>Our CX practice takes a holistic view of the customer journey, from the first moment of brand awareness through to long-term loyalty and advocacy. We use a combination of qualitative research, quantitative data analysis, and design thinking methodologies to identify friction points and opportunities for delight.</p>
             <p>We design and build digital experiences — websites, mobile applications, and self-service portals — that are intuitive, accessible, and genuinely enjoyable to use. Our UX designers work closely with our technology partners to ensure that beautiful design is matched by flawless technical execution.</p>`,
      features: [
        { title: 'Customer Journey Mapping', desc: 'End-to-end visualization of the customer experience across all touchpoints.' },
        { title: 'UX Research', desc: 'User interviews, usability testing, and behavioral analytics.' },
        { title: 'UI/UX Design', desc: 'Wireframing, prototyping, and high-fidelity interface design.' },
        { title: 'CX Strategy', desc: 'Roadmaps for improving NPS, CSAT, and customer retention metrics.' },
        { title: 'Digital Transformation', desc: 'End-to-end digitization of customer-facing processes and services.' },
        { title: 'Accessibility', desc: 'WCAG-compliant design ensuring inclusivity for all users.' },
      ]
    },
    data: {
      title: 'Data & Analytics',
      subtitle: 'Transform raw data into the competitive intelligence that drives decisions.',
      tag: 'Analytics Services',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      intro: 'Data is the most valuable resource in modern business, but only when it is collected correctly, analyzed intelligently, and acted upon decisively. Most businesses in Qatar are sitting on vast untapped data assets.',
      body: `<p>Our analytics practice begins with a thorough audit of your current data infrastructure. We assess what data you are collecting, how it is being stored, and how it is being used to inform decisions. In most cases, we find significant gaps — tracking errors, attribution problems, and missed opportunities for insight.</p>
             <p>We then build or rebuild your analytics infrastructure using industry-leading tools including Google Analytics 4, Google Tag Manager, BigQuery, and Looker Studio. We create custom dashboards that give your leadership team a real-time view of the metrics that matter most to your business.</p>`,
      features: [
        { title: 'Analytics Audit', desc: 'Comprehensive review of existing tracking, data quality, and attribution.' },
        { title: 'GA4 Implementation', desc: 'Full Google Analytics 4 setup with custom event tracking and goals.' },
        { title: 'Business Intelligence', desc: 'Custom dashboards and reporting in Looker Studio or Power BI.' },
        { title: 'Predictive Analytics', desc: 'Machine learning models for customer churn, LTV, and demand forecasting.' },
        { title: 'CRO', desc: 'Conversion rate optimization through A/B testing and funnel analysis.' },
        { title: 'Data Strategy', desc: 'First-party data collection frameworks and privacy-compliant architectures.' },
      ]
    }
  };

  const s = services[service] || services.seo;
  document.title = `${s.title} | Double Eight Business Solutions`;

  const featuresHTML = s.features.map(f => `
    <div class="service-detail-feature entry-3d">
      <h4>${f.title}</h4>
      <p>${f.desc}</p>
    </div>
  `).join('');

  container.innerHTML = `
    <header class="page-hero">
      <div class="container">
        <div class="page-hero-content entry-3d">
          <div class="breadcrumb">
            <a href="index.html">Home</a>
            <span class="breadcrumb-sep">›</span>
            <a href="services.html">Services</a>
            <span class="breadcrumb-sep">›</span>
            <span>${s.title}</span>
          </div>
          <div class="section-label">${s.tag}</div>
          <h1 class="page-hero-title">${s.title}</h1>
          <p class="page-hero-subtitle">${s.subtitle}</p>
        </div>
      </div>
    </header>

    <section class="section-padding">
      <div class="container">
        <div class="service-detail-layout">
          <div class="service-detail-content">
            <p class="entry-3d" style="font-size:1.05rem;color:rgba(255,255,255,0.75);line-height:1.9;margin-bottom:2rem;">${s.intro}</p>
            <div class="entry-3d delay-2">${s.body}</div>

            <h2 class="entry-3d delay-3" style="font-family:var(--font-head);font-size:1.8rem;font-weight:700;margin-top:3rem;margin-bottom:2rem;">What's Included</h2>
            <div class="service-detail-features stagger-children">
              ${featuresHTML}
            </div>
          </div>

          <div class="service-detail-sidebar">
            <div class="sidebar-widget entry-3d-right">
              <h4>Our Services</h4>
              <div class="sidebar-service-links">
                <a href="service-details.html?service=seo" class="${service === 'seo' ? 'active' : ''}">SEO & Strategy <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                <a href="service-details.html?service=branding" class="${service === 'branding' ? 'active' : ''}">Creative & Branding <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                <a href="service-details.html?service=media" class="${service === 'media' ? 'active' : ''}">Media & Advertising <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                <a href="service-details.html?service=cx" class="${service === 'cx' ? 'active' : ''}">Customer Experience <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                <a href="service-details.html?service=data" class="${service === 'data' ? 'active' : ''}">Data & Analytics <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>

            <div class="sidebar-cta entry-3d-right delay-2">
              <h4>Ready to get started?</h4>
              <p>Talk to our team about how we can help you achieve your business goals.</p>
              <a href="contact.html" class="btn btn-primary" style="width:100%;justify-content:center;">
                Start a Project
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-banner">
      <div class="container">
        <div class="entry-zoom">
          <h2 class="cta-banner-title">Ready to elevate your <em>business</em>?</h2>
          <p class="cta-banner-subtitle">Schedule a free consultation with our ${s.title} specialists today.</p>
          <div class="cta-banner-actions">
            <a href="contact.html" class="btn btn-primary">Book Consultation</a>
            <a href="services.html" class="btn btn-outline">View All Services</a>
          </div>
        </div>
      </div>
    </section>
  `;

  // Re-initialize scroll reveal for dynamically injected content
  const newTargets = container.querySelectorAll(
    '.entry-3d, .entry-3d-left, .entry-3d-right, .entry-zoom, .stagger-children'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  newTargets.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   17. CTA BANNER PARTICLES
══════════════════════════════════════════ */
(function initCtaParticles() {
  const banners = document.querySelectorAll('.cta-banner');
  banners.forEach(banner => {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'cta-particle';
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      banner.appendChild(p);
    }
  });
})();

/* ══════════════════════════════════════════════════════════
   18. SMOOTH ANCHOR LINKS
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

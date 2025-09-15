/* Main JS for FinEdge site
   - slider
   - counters
   - reveal on scroll
   - accordion
   - waitlist form validation + storage + modal
*/

document.addEventListener('DOMContentLoaded', () => {
  // NAV TOGGLE (mobile)
    const navToggle = document.querySelector('.nav-toggle');
    navToggle && navToggle.addEventListener('click', () => {
        document.querySelector('.nav')?.classList.toggle('open');
    });

  // SIMPLE SLIDER
    const slides = Array.from(document.querySelectorAll('.slider .slide'));
    let idx = 0;
    const showSlide = i => {
        slides.forEach((s, j) => s.classList.toggle('active', j === i));
    };
    if (slides.length) {
        showSlide(0);
        document.getElementById('next')?.addEventListener('click', () => {
            idx = (idx + 1) % slides.length; showSlide(idx);
    });
        document.getElementById('prev')?.addEventListener('click', () => {
            idx = (idx - 1 + slides.length) % slides.length; showSlide(idx);
    });
    // autoplay
        setInterval(() => { idx = (idx + 1) % slides.length; showSlide(idx); }, 4200);
    }

  // COUNTERS (animated)
    const counters = document.querySelectorAll('.stat-number');
    const runCounters = () => {
        counters.forEach(node => {
            const target = parseFloat(node.dataset.target) || 0;
            if (node.dataset.run) return; // run once
            node.dataset.run = '1';
            if (target % 1 !== 0) { // decimal like rating
                let current = 0;
                const step = target / 40;
                const iv = setInterval(() => {
                    current = +(current + step).toFixed(1);
                    node.textContent = current >= target ? target : current;
                    if (current >= target) clearInterval(iv);
                }, 30);
            } else {
                let current = 0;
                const step = Math.max(1, Math.floor(target / 80));
                const iv = setInterval(() => {
                    current += step;
                    node.textContent = current >= target ? target : current;
                    if (current >= target) clearInterval(iv);
                }, 18);
            }
        });
    };

  // SCROLL REVEAL for card-reveal
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.card-reveal, .card-reveal, .stat-number');
        const windowH = window.innerHeight;
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowH - 80) {
                el.classList.add('revealed');
            }
        });

        // counters trigger
        const statNodes = document.querySelectorAll('.stat-number');
        statNodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            if (rect.top < windowH - 60 && !node.dataset.run) runCounters();
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Accordion
    document.querySelectorAll('.acc-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const open = btn.nextElementSibling;
            const isShown = open.style.display === 'block';
      // close all
            document.querySelectorAll('.acc-a').forEach(a => a.style.display = 'none');
            document.querySelectorAll('.acc-q').forEach(q => q.classList.remove('open'));
            if (!isShown) {
                open.style.display = 'block';
                btn.classList.add('open');
            }
        });
    });

    // FORM HANDLING: waitlist form on contact page and modal trigger
    const form = document.getElementById('waitlistForm');
    const modal = document.getElementById('modal');
    const showModal = () => modal && modal.classList.remove('hidden');
    const hideModal = () => modal && modal.classList.add('hidden');
    document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', hideModal));

    if (form) {
        const storageKey = 'finedge_waitlist';
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const role = document.getElementById('role').value || '';
            const message = document.getElementById('message').value.trim();

            if (!fullname || !email) {
                alert('Please provide your name and email.');
                return;
            }
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
                alert('Enter a valid email address.');
                return;
            }

      // simple save to localStorage (simulate API)
            const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
            stored.push({ fullname, email, role, message, ts: new Date().toISOString() });
            localStorage.setItem(storageKey, JSON.stringify(stored));

      // nice success modal + clear form
            showModal();
            form.reset();

      // bump stats if on homepage (if embedded)
            const statNode = document.querySelector('.stat-number[data-target]');
            if (statNode) {
        // try to increment waitlist number visually
                const current = parseInt(statNode.textContent.replace(/[^0-9]/g, '')) || parseInt(statNode.dataset.target) || 0;
                statNode.textContent = current + 1;
            }
        });

            document.getElementById('clearBtn')?.addEventListener('click', () => form.reset());
    }

  // modal from non-contact forms (eg index hero)
        const ctaButtons = document.querySelectorAll('a[href="contact.html"], .btn-primary[href="contact.html"]');
        ctaButtons.forEach(b => b.addEventListener('click', (e) => {
    // allow navigation, but if user is on same page, show modal
            if (location.pathname.endsWith('contact.html')) {
                e.preventDefault();
                showModal();
            }
        }));

  // demo: close modal when click outside
        modal && modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });

  // Simple reveal of elements with .card-reveal
        setTimeout(() => document.querySelectorAll('.card-reveal').forEach(el => el.classList.add('revealed')), 600);
});

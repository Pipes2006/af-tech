'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const ASSET_VERSION = '2026.3';
    const ALLOWED_COMPONENTS = new Set([
        'components/navbar.html',
        'components/footer.html'
    ]);

    const WHATSAPP_COUNTRY_CODE = '57';
    const WHATSAPP_LOCAL_NUMBER = '3124120017';
    const MAX_NAME_LEN = 80;
    const MAX_EMAIL_LEN = 120;
    const MAX_MSG_LEN = 1000;

    const currentYear = String(new Date().getFullYear());

    const updateYear = (root) => {
        root.querySelectorAll('.footer-year').forEach((el) => {
            el.textContent = currentYear;
        });
    };

    const setActiveNavItem = (root) => {
        const rawPage = window.location.pathname.split('/').pop();
        const currentPage = rawPage && rawPage.endsWith('.html') ? rawPage : 'index.html';

        root.querySelectorAll('.navbar-nav a.nav-link, .navbar-nav a.dropdown-item').forEach((link) => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const toggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.classList.add('active');
                }
            }
        });
    };

    const initNavbarScrollEffect = () => {
        const navbar = document.querySelector('.af-navbar');
        if (!navbar) return;
        const onScroll = () => {
            navbar.classList.toggle('is-scrolled', window.scrollY > 16);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    const loadComponent = async (selector, path) => {
        const container = document.querySelector(selector);
        if (!container || !ALLOWED_COMPONENTS.has(path)) return;

        try {
            const response = await fetch(`${path}?v=${ASSET_VERSION}`, {
                credentials: 'same-origin',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Strip any unexpected executable tags as defense-in-depth
            doc.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove());

            container.replaceChildren(...Array.from(doc.body.childNodes));
            updateYear(container);
            setActiveNavItem(container);
            initNavbarScrollEffect();
        } catch (error) {
            console.error(`No se pudo cargar ${path}:`, error);
        }
    };

    const sanitizeText = (value, maxLength) => {
        return String(value || '')
            .replace(/[\u0000-\u001F\u007F]/g, ' ')
            .trim()
            .slice(0, maxLength);
    };

    const prefillServiceFromQuery = () => {
        const serviceSelect = document.querySelector('#service');
        if (!serviceSelect) return;

        const params = new URLSearchParams(window.location.search);
        const requested = params.get('servicio');
        const map = {
            'ia': 'Generación de Imágenes con IA para Publicidad',
            'web': 'Diseño de Página Web para Negocio',
            'soporte': 'Soporte Técnico (Windows / Office / Mantenimiento)',
            'paquete': 'Paquete Integral (Web + IA Publicitaria)'
        };

        if (requested && map[requested]) {
            serviceSelect.value = map[requested];
        }
    };

    const initWhatsappContactForm = () => {
        const form = document.querySelector('#contact-form');
        if (!form) return;

        prefillServiceFromQuery();

        const feedbackBox = document.querySelector('#form-feedback');
        let lastSubmitAt = 0;

        const showFeedback = (message, isError) => {
            if (!feedbackBox) return;
            feedbackBox.textContent = message;
            feedbackBox.className = isError
                ? 'alert alert-danger mt-3 mb-0'
                : 'alert alert-primary mt-3 mb-0';
            feedbackBox.classList.remove('d-none');
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Basic client-side anti-spam cooldown (3 seconds)
            const now = Date.now();
            if (now - lastSubmitAt < 3000) {
                showFeedback('Espera unos segundos antes de volver a enviar.', true);
                return;
            }

            // Honeypot check against automated bots
            const honeypot = document.querySelector('#website-field')?.value.trim();
            if (honeypot) {
                return;
            }

            const name = sanitizeText(document.querySelector('#name')?.value, MAX_NAME_LEN);
            const email = sanitizeText(document.querySelector('#email')?.value, MAX_EMAIL_LEN);
            const business = sanitizeText(document.querySelector('#business')?.value, 80);
            const service = sanitizeText(document.querySelector('#service')?.value, 100);
            const message = sanitizeText(document.querySelector('#message')?.value, MAX_MSG_LEN);

            if (name.length < 2 || message.length < 8) {
                showFeedback('Por favor ingresa tu nombre y describe brevemente tu solicitud (mínimo 8 caracteres).', true);
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                showFeedback('Por favor verifica que el correo electrónico sea válido.', true);
                return;
            }

            lastSubmitAt = now;

            const lines = [
                'Hola AF Tech, deseo solicitar información:',
                `• Nombre: ${name}`,
                `• Servicio: ${service || 'Consulta general'}`,
                business ? `• Negocio / Rubro: ${business}` : null,
                `• Correo: ${email || 'No proporcionado'}`,
                '',
                'Detalle de la solicitud:',
                message
            ].filter((line) => line !== null);

            const whatsappNumber = `${WHATSAPP_COUNTRY_CODE}${WHATSAPP_LOCAL_NUMBER}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

            showFeedback('Abriendo WhatsApp con tu mensaje listo para enviar...', false);
            const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            if (!win) {
                window.location.href = whatsappUrl;
            }
        });
    };

    const initPortfolioFilter = () => {
        const buttons = document.querySelectorAll('[data-filter]');
        const items = document.querySelectorAll('[data-category]');
        if (!buttons.length || !items.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                buttons.forEach((b) => {
                    b.classList.toggle('active', b === btn);
                    b.setAttribute('aria-pressed', String(b === btn));
                });

                items.forEach((item) => {
                    const cat = item.getAttribute('data-category');
                    const show = filter === 'all' || cat === filter;
                    item.classList.toggle('d-none', !show);
                });
            });
        });
    };

    const initScrollReveal = () => {
        const targets = document.querySelectorAll('.af-reveal');
        if (!targets.length || !('IntersectionObserver' in window)) return;

        document.documentElement.classList.add('af-anim');

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        targets.forEach((el) => observer.observe(el));
    };

    updateYear(document);
    loadComponent('#navbar-placeholder', 'components/navbar.html');
    loadComponent('#footer-placeholder', 'components/footer.html');
    initWhatsappContactForm();
    initPortfolioFilter();
    initScrollReveal();
});

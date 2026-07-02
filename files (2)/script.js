/* ============================================================
   ODONTO PERFORMANCE — script.js
   JavaScript puro: menu mobile, header on scroll, contadores,
   scroll reveal e envio do formulário de CTA.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Header com sombra ao rolar ---------- */
  var header = document.getElementById('header');
  function onScrollHeader() {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback para navegadores sem suporte
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contadores animados (prova social no Hero) ---------- */
  var counters = document.querySelectorAll('.proof-number');

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var isDecimal = target % 1 !== 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = target * eased;
      el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Formulário de CTA (validação simples + redirecionamento ao WhatsApp) ---------- */
  var ctaForm = document.getElementById('ctaForm');
  var WHATSAPP_NUMBER = '5585999999999'; // Número da clínica com DDI + DDD, sem espaços ou símbolos

  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = document.getElementById('nome').value.trim();
      var whatsapp = document.getElementById('whatsapp').value.trim();

      if (nome.length < 2 || whatsapp.length < 8) {
        alert('Por favor, preencha seu nome e um WhatsApp válido.');
        return;
      }

      var mensagem = 'Olá! Meu nome é ' + nome + ' e meu WhatsApp é ' + whatsapp +
        '. Quero receber meu diagnóstico gratuito para minha clínica odontológica.';
      var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(mensagem);

      var btn = ctaForm.querySelector('.cta-form__btn');
      var originalText = btn.innerHTML;
      btn.innerHTML = 'Redirecionando para o WhatsApp ✓';
      btn.disabled = true;

      window.open(whatsappUrl, '_blank', 'noopener');

      setTimeout(function () {
        ctaForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    });
  }

  /* ---------- Ano dinâmico no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();

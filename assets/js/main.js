/* ===================================================
   蜀利元智能润滑器 - 全局交互脚本
   =================================================== */

// ---- 导航滚动效果 ----
(function () {
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.querySelector('.scroll-progress');
  if (!navbar) return;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 导航栏阴影
    if (scrollTop > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 滚动进度条
    if (scrollProgress) {
      const progress = Math.round((scrollTop / docHeight) * 100);
      scrollProgress.style.width = progress + '%';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---- 汉堡菜单 ----
(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    if (isOpen) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // 点击菜单项关闭
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ---- 滚动淡入动画 ----
(function () {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
})();

// ---- 数字滚动动画 ----
function animateNumber(el, target, duration = 1800, suffix = '') {
  const startTime = performance.now();
  const startVal = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * easeOut);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

(function () {
  const statNums = document.querySelectorAll('[data-count]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateNumber(el, target, 1600, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

// ---- 联系表单 ----
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = document.querySelector('.form-success');

  function validateField(input) {
    const val = input.value.trim();
    const errorEl = input.parentElement.querySelector('.form-error');
    let valid = true;

    if (input.required && !val) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = (window.__ && window.__('form.error_required')) || '此项为必填';
      valid = false;
    } else if (input.type === 'tel' && val && !/^1[3-9]\d{9}$/.test(val)) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = (window.__ && window.__('form.error_phone')) || '请输入有效的手机号码';
      valid = false;
    } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = (window.__ && window.__('form.error_email')) || '请输入有效的邮箱地址';
      valid = false;
    } else {
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }

    return valid;
  }

  // 实时验证
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('.form-input[required], .form-textarea[required]');
    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) return;

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = (window.__ && window.__('form.submitting')) || '提交中...';

    try {
      // 模拟API调用（后续接数据库时替换）
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      form.style.display = 'none';
      if (successEl) successEl.classList.add('show');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = (window.__ && window.__('form.submit_text')) || '提交咨询';
      alert((window.__ && window.__('form.system_error')) || '系统繁忙，请稍后重试或拨打电话联系我们');
    }
  });
})();

// ---- 解决方案页面Tab切换 ----
(function () {
  const navBtns = document.querySelectorAll('.solution-nav-btn');
  if (!navBtns.length) return;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // 此处可扩展为筛选解决方案卡片
    });
  });
})();

// ---- 当前页面导航高亮 ----
(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

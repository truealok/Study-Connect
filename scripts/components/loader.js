export async function loadComponent(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container || !container.dataset.source) return;

  try {
    const response = await fetch(container.dataset.source);
    const html = await response.text();
    container.innerHTML = html;

    // Initialize after component is injected
    if (container.dataset.source.includes('navbar')) {
      initializeNavbar();
    }
    if (container.dataset.source.includes('modal')) {
      initializeAuthModal();
    }
  } catch (error) {
    console.warn(`Failed to load component: ${container.dataset.source}`, error);
  }
}

function initializeNavbar() {
  const mobileMenuButton = document.querySelector('[data-id="mobile-menu-button"]');
  const mobileMenu = document.querySelector('[data-id="mobile-menu"]');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuButton.querySelector('i');
      if (icon) {
        icon.setAttribute(
          'data-lucide',
          mobileMenu.classList.contains('hidden') ? 'menu' : 'x'
        );
        lucide.createIcons();
      }
    });
  }

  // Auth modal triggers in navbar
  const triggers = ['nav-login', 'nav-signup', 'mobile-nav-login', 'mobile-nav-signup'];
  triggers.forEach(id => {
    document.querySelector(`[data-id="${id}"]`)?.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal();
    });
  });
}

function initializeAuthModal() {
  const authModal = document.getElementById('auth-modal');
  const closeBtn = authModal?.querySelector('[data-id="close-auth-modal"]');
  const modalContent = authModal?.querySelector('[data-id="auth-modal-content"]');

  if (!authModal) return;

  // Close button
  closeBtn?.addEventListener('click', hideAuthModal);

  // Click outside modal content
  authModal.addEventListener('click', (e) => {
    if (!modalContent.contains(e.target)) hideAuthModal();
  });

  // CTA buttons outside modal (from page content)
  const pageTriggers = ['find-mentor-btn', 'become-mentor-btn', 'cta-get-started'];
  pageTriggers.forEach(id => {
    document.getElementById(id)?.addEventListener('click', showAuthModal);
  });
}

function showAuthModal() {
  const authModal = document.getElementById('auth-modal');
  if (!authModal) return;
  authModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
  const authModal = document.getElementById('auth-modal');
  if (!authModal) return;
  authModal.classList.add('hidden');
  document.body.style.overflow = '';
}

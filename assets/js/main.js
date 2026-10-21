/**
 * Amna Arts - B2B Landing Page Interactive Features
 * Pure Vanilla JavaScript for high performance & reliability
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProfitCalculator();
  initRegistrationForm();
  initCollectionFilter();
  initModals();
  initSmoothScroll();
});

/* ==========================================================================
   1. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');
    document.body.classList.add('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
    document.body.classList.remove('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. Reseller Profit Estimator (Interactive B2B Value Calculator)
   ========================================================================== */
function initProfitCalculator() {
  const volumeSlider = document.getElementById('suitVolumeSlider');
  const volumeDisplay = document.getElementById('suitVolumeDisplay');
  const avgCostDisplay = document.getElementById('avgCostDisplay');
  const retailPriceDisplay = document.getElementById('retailPriceDisplay');
  const marginPerSuitDisplay = document.getElementById('marginPerSuitDisplay');
  const monthlyProfitDisplay = document.getElementById('monthlyProfitDisplay');
  const tierBadge = document.getElementById('resellerTierBadge');

  if (!volumeSlider) return;

  const calculate = () => {
    const weeklySuits = parseInt(volumeSlider.value, 10);
    volumeDisplay.textContent = `${weeklySuits} Suits / Week`;

    // Tier pricing: larger volume = better factory wholesale price from Amna Arts
    let wholesalePrice = 4200; // Average wholesale for 3-pc fancy embroidered
    let suggestedRetail = 6800; // Market retail price for boutique customer
    let tierName = "Starter Boutique";
    let tierColor = "bg-amber-100 text-amber-900 border-amber-300";

    if (weeklySuits >= 60) {
      wholesalePrice = 3600; // Master volume discount
      tierName = "Master Distributor (Azam Market VIP)";
      tierColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
    } else if (weeklySuits >= 25) {
      wholesalePrice = 3850;
      tierName = "Wholesale Partner";
      tierColor = "bg-rose-100 text-rose-900 border-rose-300";
    }

    const marginPerSuit = suggestedRetail - wholesalePrice;
    const monthlySuits = weeklySuits * 4;
    const totalMonthlyProfit = monthlySuits * marginPerSuit;

    avgCostDisplay.textContent = `PKR ${wholesalePrice.toLocaleString()}`;
    retailPriceDisplay.textContent = `PKR ${suggestedRetail.toLocaleString()}`;
    marginPerSuitDisplay.textContent = `+PKR ${marginPerSuit.toLocaleString()} / suit`;
    monthlyProfitDisplay.textContent = `PKR ${totalMonthlyProfit.toLocaleString()}`;

    if (tierBadge) {
      tierBadge.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tierColor}`;
      tierBadge.textContent = tierName;
    }
  };

  volumeSlider.addEventListener('input', calculate);
  calculate(); // run initial
}

/* ==========================================================================
   3. Reseller Registration Form Validation & WhatsApp Handshake
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('resellerRegistrationForm');
  const successModal = document.getElementById('registrationSuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const whatsappRedirectBtn = document.getElementById('whatsappRedirectBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Fields
    const businessName = document.getElementById('regBusinessName');
    const ownerName = document.getElementById('regOwnerName');
    const phone = document.getElementById('regPhone');
    const city = document.getElementById('regCity');
    const businessType = document.getElementById('regBusinessType');
    const volumeExpectation = document.getElementById('regVolume');

    // Error labels
    const businessError = document.getElementById('errBusinessName');
    const ownerError = document.getElementById('errOwnerName');
    const phoneError = document.getElementById('errPhone');
    const cityError = document.getElementById('errCity');

    // Reset errors
    [businessError, ownerError, phoneError, cityError].forEach(el => {
      if (el) el.classList.add('hidden');
    });
    [businessName, ownerName, phone, city].forEach(el => {
      if (el) el.classList.remove('border-red-500');
    });

    // Validate Business Name
    if (!businessName.value.trim() || businessName.value.trim().length < 3) {
      businessError.textContent = "Please enter a valid shop, boutique, or brand name (min 3 characters).";
      businessError.classList.remove('hidden');
      businessName.classList.add('border-red-500');
      isValid = false;
    }

    // Validate Owner Name
    if (!ownerName.value.trim() || ownerName.value.trim().length < 2) {
      ownerError.textContent = "Please enter your full contact name.";
      ownerError.classList.remove('hidden');
      ownerName.classList.add('border-red-500');
      isValid = false;
    }

    // Validate Pakistani Phone (0300... or +92300...)
    const cleanPhone = phone.value.replace(/[\s\-\(\)]/g, '');
    const pakPhoneRegex = /^((\+92)|(0092)|(92)|(0))?3[0-9]{9}$/;
    if (!pakPhoneRegex.test(cleanPhone)) {
      phoneError.textContent = "Please enter a valid Pakistani WhatsApp number (e.g. 0300 1234567 or +92 300 1234567).";
      phoneError.classList.remove('hidden');
      phone.classList.add('border-red-500');
      isValid = false;
    }

    // Validate City
    if (!city.value.trim()) {
      cityError.textContent = "Please specify your market city / district.";
      cityError.classList.remove('hidden');
      city.classList.add('border-red-500');
      isValid = false;
    }

    if (!isValid) {
      const firstInvalid = form.querySelector('.border-red-500');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Generate B2B Merchant Registration ID
    const regId = 'AA-AZAM-' + Math.floor(100000 + Math.random() * 900000);
    const regSummaryEl = document.getElementById('modalRegSummary');
    if (regSummaryEl) {
      regSummaryEl.innerHTML = `
        <div class="bg-amber-50/80 border border-amber-200 rounded-lg p-3.5 text-xs text-stone-700 space-y-1.5">
          <p><strong class="text-stone-900">Merchant Reference:</strong> <span class="font-mono text-rose-800 font-bold">${regId}</span></p>
          <p><strong class="text-stone-900">Boutique:</strong> ${businessName.value.trim()} (${city.value.trim()})</p>
          <p><strong class="text-stone-900">WhatsApp:</strong> ${phone.value.trim()}</p>
          <p><strong class="text-stone-900">Channel:</strong> ${businessType ? businessType.value : 'Reseller'}</p>
        </div>
      `;
    }

    // WhatsApp Direct URL creation
    const message = encodeURIComponent(
      `*Salam Amna Arts Azam Market Lahore!*\n\n` +
      `I have submitted my B2B Reseller Application.\n` +
      `*Merchant ID:* ${regId}\n` +
      `*Boutique / Shop:* ${businessName.value.trim()}\n` +
      `*Contact:* ${ownerName.value.trim()}\n` +
      `*City:* ${city.value.trim()}\n` +
      `*Business Model:* ${businessType ? businessType.value : 'Boutique'}\n` +
      `*Expected Volume:* ${volumeExpectation ? volumeExpectation.value : '20-50 suits'}\n\n` +
      `Please activate my Wholesale Portal Login and send the latest PDF Catalog & Thaan Rate List.`
    );
    const waUrl = `https://wa.me/924237380486?text=${message}`;

    if (whatsappRedirectBtn) {
      whatsappRedirectBtn.href = waUrl;
      whatsappRedirectBtn.setAttribute('target', '_blank');
    }

    // Show confirmation modal
    if (successModal) {
      successModal.classList.remove('hidden');
      successModal.classList.add('flex');
    }

    form.reset();
  });

  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }
}

/* ==========================================================================
   4. Collection Category Filtering
   ========================================================================== */
function initCollectionFilter() {
  const filterBtns = document.querySelectorAll('.collection-tab-btn');
  const suitCards = document.querySelectorAll('.collection-suit-card');

  if (!filterBtns.length || !suitCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update active tab visual
      filterBtns.forEach(b => {
        b.classList.remove('bg-rose-900', 'text-amber-300', 'shadow-md');
        b.classList.add('bg-white', 'text-stone-700', 'hover:bg-stone-100');
      });

      btn.classList.remove('bg-white', 'text-stone-700', 'hover:bg-stone-100');
      btn.classList.add('bg-rose-900', 'text-amber-300', 'shadow-md');

      // Filter cards
      suitCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Modals Management (Catalog Quick View & B2B Portal Login)
   ========================================================================== */
function initModals() {
  // Portal Login Modal
  const openLoginBtns = document.querySelectorAll('.open-login-modal-btn');
  const loginModal = document.getElementById('loginModal');
  const closeLoginBtn = document.getElementById('closeLoginModalBtn');
  const loginForm = document.getElementById('b2bLoginForm');
  const loginNotice = document.getElementById('loginNotice');

  openLoginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) {
        loginModal.classList.remove('hidden');
        loginModal.classList.add('flex');
      }
    });
  });

  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener('click', () => {
      loginModal.classList.add('hidden');
      loginModal.classList.remove('flex');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById('loginPhone');
      const pinInput = document.getElementById('loginPin');

      if (!phoneInput.value.trim() || !pinInput.value.trim()) {
        loginNotice.textContent = "Please enter your registered Reseller WhatsApp number and 4-digit PIN.";
        loginNotice.className = "text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200 mt-2 block";
        return;
      }

      loginNotice.innerHTML = `
        <div class="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200 mt-2">
          <svg class="w-4 h-4 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          Authenticating with Azam Market Central Server... Welcome back! Redirecting to catalog...
        </div>
      `;

      setTimeout(() => {
        loginModal.classList.add('hidden');
        loginModal.classList.remove('flex');
        window.location.hash = "#collections";
      }, 1500);
    });
  }

  // Catalog Quick View Modal
  const quickViewBtns = document.querySelectorAll('.open-quick-view-btn');
  const quickViewModal = document.getElementById('quickViewModal');
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || "Royal Festive 3-Piece";
      const fabric = btn.getAttribute('data-fabric') || "Pure Chiffon with Heavy Tilla Work";
      const rate = btn.getAttribute('data-rate') || "PKR 4,250 / Suit";
      const moq = btn.getAttribute('data-moq') || "1 Set (6 Suits / Assorted Colors)";
      const code = btn.getAttribute('data-code') || "AA-FESTIVE-2026-08";

      const modalTitle = document.getElementById('qvModalTitle');
      const modalFabric = document.getElementById('qvModalFabric');
      const modalRate = document.getElementById('qvModalRate');
      const modalMoq = document.getElementById('qvModalMoq');
      const modalCode = document.getElementById('qvModalCode');
      const qvWaBtn = document.getElementById('qvWhatsAppInquiryBtn');

      if (modalTitle) modalTitle.textContent = title;
      if (modalFabric) modalFabric.textContent = fabric;
      if (modalRate) modalRate.textContent = rate;
      if (modalMoq) modalMoq.textContent = moq;
      if (modalCode) modalCode.textContent = code;

      if (qvWaBtn) {
        const text = encodeURIComponent(`*Inquiry for ${title} (${code})*\nWholesale Rate: ${rate}\nMOQ: ${moq}\nPlease confirm current available stock in Azam Market warehouse.`);
        qvWaBtn.href = `https://wa.me/924237380486?text=${text}`;
      }

      if (quickViewModal) {
        quickViewModal.classList.remove('hidden');
        quickViewModal.classList.add('flex');
      }
    });
  });

  if (closeQuickViewBtn && quickViewModal) {
    closeQuickViewBtn.addEventListener('click', () => {
      quickViewModal.classList.add('hidden');
      quickViewModal.classList.remove('flex');
    });
  }

  // Close modals on clicking backdrop
  [loginModal, quickViewModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  });
}

/* ==========================================================================
   6. Smooth Scrolling for Internal Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

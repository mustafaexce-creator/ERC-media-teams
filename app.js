// ===================================
// ERC Media Team - Registration Form
// Application Logic
// ===================================

(function() {
  'use strict';

  // Egyptian Governorates
  const GOVERNORATES = [
    'القاهرة','الجيزة','الإسكندرية','الدقهلية','البحر الأحمر','البحيرة',
    'الفيوم','الغربية','الإسماعيلية','المنوفية','المنيا','القليوبية',
    'الوادي الجديد','السويس','أسوان','أسيوط','بني سويف','بورسعيد',
    'دمياط','الشرقية','جنوب سيناء','كفر الشيخ','مطروح','الأقصر',
    'قنا','شمال سيناء','سوهاج'
  ];

  // State
  let currentStep = 1;
  const totalSteps = 4;
  let selectedTeam = null;

  // DOM Elements
  const form = document.getElementById('volunteer-form');
  const formCard = document.querySelector('.form-card');
  const sections = document.querySelectorAll('.form-section');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepLines = document.querySelectorAll('.step-line');
  const btnNext = document.getElementById('btn-next');
  const btnPrev = document.getElementById('btn-prev');
  const btnSubmit = document.getElementById('btn-submit');
  const successPage = document.getElementById('success-page');

  // Initialize
  function init() {
    populateGovernorates();
    setupTeamCards();
    setupRadioOptions();
    setupYesNoOptions();
    setupNavigation();
    setupFormValidation();
    updateProgress();
  }

  // Populate governorates dropdown
  function populateGovernorates() {
    const select = document.getElementById('governorate');
    if (!select) return;
    GOVERNORATES.forEach(gov => {
      const option = document.createElement('option');
      option.value = gov;
      option.textContent = gov;
      select.appendChild(option);
    });
  }

  // Team card selection
  function setupTeamCards() {
    const cards = document.querySelectorAll('.team-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
        selectedTeam = radio.value;
        showConditionalFields(selectedTeam);
        clearFieldError(card.closest('.field-group'));
      });
    });
  }

  // Radio option styling
  function setupRadioOptions() {
    document.querySelectorAll('.radio-option').forEach(option => {
      option.addEventListener('click', () => {
        const group = option.closest('.radio-group');
        group.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        clearFieldError(option.closest('.field-group'));
      });
    });
  }

  // Yes/No toggle
  function setupYesNoOptions() {
    document.querySelectorAll('.yes-no-option').forEach(option => {
      option.addEventListener('click', () => {
        const group = option.closest('.yes-no-group');
        group.querySelectorAll('.yes-no-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        clearFieldError(option.closest('.field-group'));
      });
    });
  }

  // Show conditional fields based on team selection
  function showConditionalFields(team) {
    const allConditional = document.querySelectorAll('.conditional-fields');
    allConditional.forEach(el => {
      el.classList.add('hidden');
      // Disable required on hidden fields
      el.querySelectorAll('[required]').forEach(input => {
        input.dataset.wasRequired = 'true';
        input.removeAttribute('required');
      });
    });

    const targetSection = document.getElementById('fields-' + team);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      // Re-enable required on visible fields
      targetSection.querySelectorAll('[data-was-required]').forEach(input => {
        input.setAttribute('required', '');
      });
    }
  }

  // Navigation
  function setupNavigation() {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        updateProgress();
        showStep(currentStep);
        scrollToForm();
      }
    });

    btnPrev.addEventListener('click', () => {
      currentStep--;
      updateProgress();
      showStep(currentStep);
      scrollToForm();
    });

    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        submitForm();
      }
    });
  }

  // Show step
  function showStep(step) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById('step-' + step);
    if (target) target.classList.add('active');

    // Update nav buttons
    btnPrev.classList.toggle('hidden', step === 1);
    
    if (step === totalSteps) {
      btnNext.classList.add('hidden');
      btnSubmit.classList.remove('hidden');
    } else {
      btnNext.classList.remove('hidden');
      btnSubmit.classList.add('hidden');
    }
  }

  // Update progress bar
  function updateProgress() {
    stepIndicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      indicator.classList.remove('active', 'completed');
      
      if (stepNum === currentStep) {
        indicator.classList.add('active');
        // Update circle content to number
        indicator.querySelector('.step-circle').innerHTML = stepNum;
      } else if (stepNum < currentStep) {
        indicator.classList.add('completed');
        indicator.querySelector('.step-circle').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      } else {
        indicator.querySelector('.step-circle').innerHTML = stepNum;
      }
    });

    stepLines.forEach((line, index) => {
      if (index + 1 < currentStep) {
        line.classList.add('completed');
      } else {
        line.classList.remove('completed');
      }
    });
  }

  // Scroll to form
  function scrollToForm() {
    const formTop = document.querySelector('.progress-bar-wrapper');
    if (formTop) {
      formTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Validation
  function setupFormValidation() {
    // Real-time validation on input
    document.querySelectorAll('.input-base').forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          showFieldError(input.closest('.field-group'), 'هذا الحقل مطلوب');
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
          showFieldError(input.closest('.field-group'), 'يرجى إدخال بريد إلكتروني صحيح');
        } else if (input.type === 'url' && input.value && !isValidURL(input.value)) {
          showFieldError(input.closest('.field-group'), 'يرجى إدخال رابط صحيح');
        } else {
          clearFieldError(input.closest('.field-group'));
        }
      });

      input.addEventListener('input', () => {
        if (input.closest('.field-group').querySelector('.field-error.visible')) {
          clearFieldError(input.closest('.field-group'));
        }
      });
    });
  }

  function validateStep(step) {
    const section = document.getElementById('step-' + step);
    if (!section) return true;

    let isValid = true;
    
    // Validate text inputs, textareas, selects
    section.querySelectorAll('.input-base[required]').forEach(input => {
      if (!input.value.trim()) {
        showFieldError(input.closest('.field-group'), 'هذا الحقل مطلوب');
        isValid = false;
      } else if (input.type === 'email' && !isValidEmail(input.value)) {
        showFieldError(input.closest('.field-group'), 'يرجى إدخال بريد إلكتروني صحيح');
        isValid = false;
      } else if (input.type === 'url' && !isValidURL(input.value)) {
        showFieldError(input.closest('.field-group'), 'يرجى إدخال رابط صحيح');
        isValid = false;
      } else if (input.type === 'number') {
        const val = parseInt(input.value);
        if (isNaN(val) || val < 15 || val > 80) {
          showFieldError(input.closest('.field-group'), 'يرجى إدخال سن صحيح (15-80)');
          isValid = false;
        }
      }
    });

    // Validate radio groups
    section.querySelectorAll('.radio-group[data-required]').forEach(group => {
      const checked = group.querySelector('input[type="radio"]:checked');
      if (!checked) {
        showFieldError(group.closest('.field-group'), 'يرجى اختيار أحد الخيارات');
        isValid = false;
      }
    });

    // Validate team selection (step 3)
    if (step === 3) {
      const teamSelected = document.querySelector('input[name="team"]:checked');
      if (!teamSelected) {
        const teamFieldGroup = document.querySelector('.team-grid').closest('.field-group');
        showFieldError(teamFieldGroup, 'يرجى اختيار الفريق الذي ترغب في الانضمام إليه');
        isValid = false;
      }
    }

    // Validate yes/no groups
    section.querySelectorAll('.yes-no-group[data-required]').forEach(group => {
      const checked = group.querySelector('input[type="radio"]:checked');
      if (!checked) {
        showFieldError(group.closest('.field-group'), 'يرجى اختيار أحد الخيارات');
        isValid = false;
      }
    });

    // Validate conditional fields (step 4)
    if (step === 4 && selectedTeam) {
      const conditionalSection = document.getElementById('fields-' + selectedTeam);
      if (conditionalSection && !conditionalSection.classList.contains('hidden')) {
        conditionalSection.querySelectorAll('.input-base[required]').forEach(input => {
          if (!input.value.trim()) {
            showFieldError(input.closest('.field-group'), 'هذا الحقل مطلوب');
            isValid = false;
          } else if (input.type === 'url' && !isValidURL(input.value)) {
            showFieldError(input.closest('.field-group'), 'يرجى إدخال رابط صحيح');
            isValid = false;
          }
        });

        conditionalSection.querySelectorAll('.radio-group[data-required]').forEach(group => {
          const checked = group.querySelector('input[type="radio"]:checked');
          if (!checked) {
            showFieldError(group.closest('.field-group'), 'يرجى اختيار أحد الخيارات');
            isValid = false;
          }
        });

        conditionalSection.querySelectorAll('.yes-no-group[data-required]').forEach(group => {
          const checked = group.querySelector('input[type="radio"]:checked');
          if (!checked) {
            showFieldError(group.closest('.field-group'), 'يرجى اختيار أحد الخيارات');
            isValid = false;
          }
        });
      }
    }

    if (!isValid) {
      // Shake the form card
      formCard.classList.add('shake');
      setTimeout(() => formCard.classList.remove('shake'), 400);
      
      // Scroll to first error
      const firstError = section.querySelector('.field-error.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  function showFieldError(fieldGroup, message) {
    if (!fieldGroup) return;
    const errorEl = fieldGroup.querySelector('.field-error');
    const input = fieldGroup.querySelector('.input-base');
    if (errorEl) {
      errorEl.querySelector('span').textContent = message;
      errorEl.classList.add('visible');
    }
    if (input) {
      input.classList.add('error');
    }
  }

  function clearFieldError(fieldGroup) {
    if (!fieldGroup) return;
    const errorEl = fieldGroup.querySelector('.field-error');
    const input = fieldGroup.querySelector('.input-base');
    if (errorEl) errorEl.classList.remove('visible');
    if (input) input.classList.remove('error');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return /^https?:\/\/.+/.test(url);
    }
  }

  // Submit
  function submitForm() {
    btnSubmit.classList.add('btn-loading');
    btnSubmit.disabled = true;
    btnSubmit.querySelector('span').textContent = 'جارٍ الإرسال...';

    // Simulate submission delay
    setTimeout(() => {
      formCard.classList.add('hidden');
      document.querySelector('.form-nav').classList.add('hidden');
      document.querySelector('.progress-bar-wrapper').classList.add('hidden');
      successPage.classList.add('active');
      scrollToForm();

      // Confetti-like effect
      createCelebration();
    }, 1500);
  }

  // Celebration effect
  function createCelebration() {
    const colors = ['#B91C3C', '#D4634A', '#16803C', '#F59E0B', '#2563EB'];
    const container = document.querySelector('.form-container');
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        top: 0;
        left: ${Math.random() * 100}%;
        opacity: 1;
        pointer-events: none;
        z-index: 10;
      `;
      container.appendChild(particle);
      
      const duration = Math.random() * 1500 + 1000;
      const xDrift = (Math.random() - 0.5) * 200;
      
      particle.animate([
        { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${Math.random() * 300 + 200}px) translateX(${xDrift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      }).onfinish = () => particle.remove();
    }
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

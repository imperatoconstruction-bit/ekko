const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

const SUPABASE_URL_PUBLIC = 'https://iwdfabkbzzbqhzxaspfo.supabase.co';
const SUPABASE_ANON_PUBLIC = 'sb_publishable_YVqgGI6xSh0fBWU0O6pVpQ_6vToI3jv';

const earlyAccessForm = document.querySelector('form[name="ekko-waitlist"]');
if (earlyAccessForm && window.supabase) {
  const client = window.supabase.createClient(SUPABASE_URL_PUBLIC, SUPABASE_ANON_PUBLIC);

  earlyAccessForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = earlyAccessForm.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : 'Submit';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Joining...';
    }

    const payload = {
      name: earlyAccessForm.querySelector('input[name="name"]')?.value.trim(),
      email: earlyAccessForm.querySelector('input[name="email"]')?.value.trim().toLowerCase(),
      location: earlyAccessForm.querySelector('input[name="location"]')?.value.trim() || null,
      interest: earlyAccessForm.querySelector('select[name="interest"]')?.value || null
    };

    const { error } = await client.from('early_access').insert(payload);

    if (error) {
      const duplicate = error.code === '23505';
      earlyAccessForm.innerHTML = `<div class="form-success"><strong>${duplicate ? 'You are already on the early access list.' : 'Something went wrong.'}</strong><br/>${duplicate ? 'We already have this email saved for EKKO updates.' : 'Please try again in a moment.'}</div>`;
      return;
    }

    earlyAccessForm.innerHTML = `<div class="form-success"><strong>${payload.name || 'Friend'}, you're on the early access list.</strong><br/>We saved your info for EKKO launch updates, community announcements, and next steps.</div>`;
  });
}

(() => {
  'use strict';
  const S = window.MedCoreSecurity;

  function setError(id, message = '') {
    const input = document.getElementById(id);
    const error = document.getElementById(`e-${id}`);
    if (input) input.style.borderColor = message ? 'var(--error)' : '';
    if (error) error.textContent = message;
  }

  function validateContactForm() {
    const validations = [
      ['cfFirst', 'First name', 'name'],
      ['cfLast', 'Last name', 'name'],
      ['cfEmail', 'Email', 'email'],
      ['cfSubject', 'Subject', 'subject'],
      ['cfMessage', 'Message', 'message']
    ];
    let ok = true;
    for (const [id, label, pattern] of validations) {
      const value = document.getElementById(id)?.value.trim() || '';
      if (!value) {
        setError(id, `${label} is required.`);
        ok = false;
      } else if (!S.isValid(value, pattern)) {
        setError(id, `Enter a valid ${label.toLowerCase()}.`);
        ok = false;
      } else {
        setError(id);
      }
    }
    const org = document.getElementById('cfOrg')?.value.trim() || '';
    const phone = document.getElementById('cfPhone')?.value.trim() || '';
    if (org && !S.isValid(org, 'organisation')) ok = false;
    if (phone && !S.isValid(phone, 'phone')) ok = false;
    return ok;
  }

  function submitContact() {
    if (!validateContactForm()) return;
    const email = document.getElementById('cfEmail').value.trim();
    const first = document.getElementById('cfFirst').value.trim();
    const last = document.getElementById('cfLast').value.trim();
    const org = document.getElementById('cfOrg').value.trim();
    const subj = document.getElementById('cfSubject').value.trim();
    const msg = document.getElementById('cfMessage').value.trim();
    const phone = document.getElementById('cfPhone').value.trim();
    const body = `Name: ${first} ${last}\nOrganisation: ${org || 'N/A'}\nPhone: ${phone || 'N/A'}\nSubject: ${subj}\n\nMessage:\n${msg}`;
    window.location.href = `mailto:info@medcoresolutions.com?subject=${encodeURIComponent(`Website Enquiry: ${subj} – ${first} ${last}`)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      document.getElementById('contactForm').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
      S.setText(document.getElementById('fsEmail'), email);
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const now = new Date();
    document.getElementById(`row-${days[now.getDay()]}`)?.classList.add('today');
    const mins = now.getHours() * 60 + now.getMinutes();
    const day = now.getDay();
    let isOpen = false;
    if (day >= 1 && day <= 4) isOpen = mins >= 480 && mins < 1050;
    else if (day === 5) isOpen = mins >= 480 && mins < 1020;
    else if (day === 6) isOpen = mins >= 540 && mins < 780;
    const statusEl = document.getElementById('openStatus');
    statusEl.textContent = isOpen ? 'Open Now' : 'Closed Now';
    statusEl.style.background = isOpen ? 'rgba(26,158,110,0.1)' : 'rgba(217,79,79,0.1)';
    statusEl.style.color = isOpen ? '#1A9E6E' : '#D94F4F';
    document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('click', () => item.classList.toggle('open')));
    document.getElementById('contactSubmit')?.addEventListener('click', submitContact);
  });
})();

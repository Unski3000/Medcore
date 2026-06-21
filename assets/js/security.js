(() => {
  'use strict';

  // GitHub Pages cannot set X-Frame-Options/CSP frame-ancestors headers.
  // This frame-busting fallback prevents the page from being operated inside a hostile frame.
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  window.MedCoreSecurity = Object.freeze({
    patterns: Object.freeze({
      name: /^[A-Za-z][A-Za-z\s.'-]{1,79}$/,
      organisation: /^[A-Za-z0-9][A-Za-z0-9\s&.,'()\/-]{1,119}$/,
      email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      phone: /^\+?[0-9\s().-]{7,20}$/,
      subject: /^[A-Za-z0-9][A-Za-z0-9\s&.,'()\/-]{1,99}$/,
      message: /^[\s\S]{10,2000}$/,
      productCode: /^[A-Za-z0-9][A-Za-z0-9._-]{1,39}$/,
      url: /^(https:\/\/)[A-Za-z0-9.-]+(?:\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/,
      quantity: /^[1-9][0-9]{0,5}$/,
      price: /^(?:0|[1-9][0-9]{0,8})(?:\.[0-9]{1,2})?$/
    }),
    isValid(value, patternName) {
      const pattern = this.patterns[patternName];
      return Boolean(pattern && pattern.test(String(value || '').trim()));
    },
    setText(node, value) {
      node.textContent = String(value ?? '');
      return node;
    },
    clear(node) {
      while (node.firstChild) node.removeChild(node.firstChild);
      return node;
    },
    el(tag, options = {}, children = []) {
      const node = document.createElement(tag);
      if (options.className) node.className = options.className;
      if (options.id) node.id = options.id;
      if (options.type) node.type = options.type;
      if (options.href) node.href = options.href;
      if (options.src) node.src = options.src;
      if (options.alt) node.alt = options.alt;
      if (options.value !== undefined) node.value = options.value;
      if (options.placeholder) node.placeholder = options.placeholder;
      if (options.ariaLabel) node.setAttribute('aria-label', options.ariaLabel);
      if (options.target) node.target = options.target;
      if (options.rel) node.rel = options.rel;
      if (options.loading) node.loading = options.loading;
      if (options.min !== undefined) node.min = options.min;
      if (options.max !== undefined) node.max = options.max;
      if (options.step !== undefined) node.step = options.step;
      if (options.disabled !== undefined) node.disabled = options.disabled;
      if (options.checked !== undefined) node.checked = options.checked;
      if (options.text !== undefined) node.textContent = String(options.text);
      for (const child of children) node.append(child);
      return node;
    }
  });
})();

// Only allow same-origin relative paths to prevent open redirects.
export const safeRedirect = (path, fallback = '/') =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : fallback;

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidMobile = (phone) => /^[6-9]\d{9}$/.test(phone);

// Mirrors backend RegisterRequest password rules.
export const isStrongPassword = (pw) => pw.length >= 8 && pw.length <= 64 && /[A-Za-z]/.test(pw) && /\d/.test(pw);

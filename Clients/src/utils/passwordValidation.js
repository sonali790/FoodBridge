// Shared password strength rules used across signup + reset-password flows.

export const PASSWORD_RULES = [
  { key: 'upper', label: 'At least one uppercase letter (A–Z)', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lower', label: 'At least one lowercase letter (a–z)', test: (pw) => /[a-z]/.test(pw) },
  { key: 'number', label: 'At least one number (0–9)', test: (pw) => /\d/.test(pw) },
  { key: 'special', label: 'At least one special character (!@#$%^&*, etc.)', test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\/\\;']/.test(pw) },
  { key: 'length', label: 'Minimum 8 characters', test: (pw) => pw.length >= 8 },
];

export function getPasswordChecklist(password) {
  return PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    satisfied: rule.test(password || ''),
  }));
}

export function isPasswordStrong(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password || ''));
}

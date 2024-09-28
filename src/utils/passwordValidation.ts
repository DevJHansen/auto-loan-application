export function getPasswordStrength(password: string): string {
  let strength = 0;

  if (password.length < 6) {
    return 'Too Short';
  }

  if (password.length >= 8) {
    strength += 1;
  }
  if (password.length >= 12) {
    strength += 1;
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasLowerCase) strength += 1;
  if (hasUpperCase) strength += 1;
  if (hasNumbers) strength += 1;
  if (hasSpecialChars) strength += 1;

  if (strength <= 2) {
    return 'Weak';
  } else if (strength <= 4) {
    return 'Moderate';
  } else {
    return 'Strong';
  }
}

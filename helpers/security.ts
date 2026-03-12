export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0] || ''}***@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
};

export const hasStrongPassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

// Admin configuration for Qureon
// These emails have access to the Alert Center tab

export const ADMIN_EMAILS: string[] = [
  'qureonadmin@gmail.com',
];

export const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export type StudioUser = {
  id: string;
  email: string | null;
};

export function isStudioOwner(user: StudioUser | null): boolean {
  if (!user) return false;
  const ownerUserId = process.env.STUDIO_OWNER_USER_ID?.trim();
  if (ownerUserId && user.id === ownerUserId) return true;
  if (!user.email) return false;
  const ownerEmail = (process.env.STUDIO_OWNER_EMAIL || "emirsemenov@yahoo.com").trim().toLocaleLowerCase();
  return user.email.toLocaleLowerCase() === ownerEmail;
}

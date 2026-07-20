const USER_EMAIL_DOMAIN = "users.travel-edu.invalid";

export function normalizeLogin(login: string) {
  return login.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export async function loginToFirebaseEmail(login: string) {
  const normalizedLogin = normalizeLogin(login);

  if (normalizedLogin.includes("@")) {
    return normalizedLogin;
  }

  const bytes = new TextEncoder().encode(normalizedLogin);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `login-${hash}@${USER_EMAIL_DOMAIN}`;
}

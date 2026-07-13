export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "That email and password combination doesn't match our records. Please try again.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "An account with that email already exists. Try logging in instead.";
  }
  if (lower.includes("password should be at least") || lower.includes("password") && lower.includes("least")) {
    return "Please choose a password with at least 6 characters.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email address before logging in — check your inbox for a confirmation link.";
  }
  if (lower.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return "Something went wrong. Please try again in a moment.";
}

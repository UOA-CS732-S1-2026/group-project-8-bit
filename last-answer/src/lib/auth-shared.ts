export const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;
export const MIN_PASSWORD_LENGTH = 8;

export type AuthUser = {
  id: string;
  username: string;
};

export function validateUsername(username: string) {
  if (!username.trim()) {
    return "Username is required.";
  }

  if (!USERNAME_PATTERN.test(username)) {
    return "Username must be 3-20 characters using letters, numbers, or underscores.";
  }

  return null;
}

export function validatePassword(password: string) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }

  return null;
}


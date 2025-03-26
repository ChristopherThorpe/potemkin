import crypto from 'crypto';
import { passwordSettings } from '@/config/auth';

// Generate a random salt
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Hash a password with the given salt
export function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
}

// Verify a password against a stored hash and salt
export function verifyPassword(
  inputPassword: string,
  storedHash: string,
  salt: string
): boolean {
  const inputHash = hashPassword(inputPassword, salt);
  return inputHash === storedHash;
}

// Validate password complexity based on settings
export function validatePasswordComplexity(password: string): { valid: boolean; message?: string } {
  if (password.length < passwordSettings.minLength) {
    return { 
      valid: false, 
      message: `Password must be at least ${passwordSettings.minLength} characters long`
    };
  }

  if (passwordSettings.requireUppercase && !/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (passwordSettings.requireNumber && !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number'
    };
  }

  if (passwordSettings.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character'
    };
  }

  return { valid: true };
}

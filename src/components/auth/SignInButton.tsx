'use client';

import { signIn } from 'next-auth/react';
import { useCallback } from 'react';

interface SignInButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function SignInButton({ className, children }: SignInButtonProps) {
  const handleSignIn = useCallback(() => {
    // Use the current URL for proper port handling
    const callbackUrl = window.location.origin + '/dashboard';
    signIn('google', { callbackUrl });
  }, []);

  return (
    <button 
      onClick={handleSignIn}
      className={className}
    >
      {children}
    </button>
  );
}

'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function SignOutButton({ className, children }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <button 
      onClick={handleSignOut}
      className={className}
    >
      {children}
    </button>
  );
}

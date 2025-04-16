'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectCountdownProps {
  seconds: number;
  redirectUrl: string;
}

const RedirectCountdown: React.FC<RedirectCountdownProps> = ({
  seconds,
  redirectUrl,
}) => {
  const [countdown, setCountdown] = useState(seconds);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) {
      router.push(redirectUrl);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectUrl, router]);

  return (
    <p className="text-sm text-gray-500">
      Redirecting to home page in {countdown} second{countdown !== 1 ? 's' : ''}
      ...
    </p>
  );
};

export default RedirectCountdown;

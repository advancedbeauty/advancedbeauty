'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { addToWishlist, removeFromWishlist } from '@/actions/wishlist.action';

interface HeartbuttonProps {
  listingId: string;
}

const Heartbutton: React.FC<HeartbuttonProps> = ({ listingId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const user = session?.user;

  // Initialize state based on whether listing is in wishlist
  const [hasWishlisted, setHasWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial wishlist state when component mounts or session changes
  useEffect(() => {
    if (user?.wishlistIds) {
      setHasWishlisted(user.wishlistIds.includes(listingId));
    }
  }, [user, listingId]);

  const toggleWishlist = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!user) {
        return router.push(`/auth?callbackUrl=${callbackUrl}`);
      }

      try {
        setIsLoading(true);

        if (hasWishlisted) {
          // Remove from wishlist
          const result = await removeFromWishlist(listingId, user.id);
          if (result.success) {
            setHasWishlisted(false);
          }
        } else {
          // Add to wishlist
          const result = await addToWishlist(listingId, user.id);
          if (result.success) {
            setHasWishlisted(true);
          }
        }
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasWishlisted, listingId, user, router, callbackUrl],
  );

  return (
    <button
      onClick={toggleWishlist}
      className="relative hover:opacity-80 transition cursor-pointer"
      role="button"
      aria-label={hasWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      disabled={isLoading}
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={hasWishlisted ? 'fill-red-500' : 'fill-neutral-500/70'}
      />
    </button>
  );
};

export default Heartbutton;

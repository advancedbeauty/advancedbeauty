'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addToWishlist(serviceId: string, userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlistIds: {
          push: serviceId,
        },
      },
    });
    revalidatePath('/wishlist');
    return { success: true, data: user.wishlistIds };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function removeFromWishlist(serviceId: string, userId: string) {
  try {
    const getUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlistIds: {
          set: getUser?.wishlistIds.filter((id) => id !== serviceId),
        },
      },
    });
    revalidatePath('/wishlist');
    return { success: true, data: user.wishlistIds };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getWishlistItems(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        wishlistIds: true,
      },
    });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    revalidatePath('/wishlist');
    return { success: true, data: user.wishlistIds };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

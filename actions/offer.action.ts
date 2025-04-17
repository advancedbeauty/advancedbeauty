'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOffer(formData: FormData) {
  try {
    const image = formData.get('image') as string;
    const offerCode = formData.get('offerCode') as string;
    const discountPercentage = formData.get('discountPercentage') as string;
    const maxAmount = formData.get('maxAmount') as string;
    const isPublished = formData.get('isPublished') === 'true';

    const offer = await prisma.offer.create({
      data: {
        image,
        offerCode,
        discountPercentage: parseFloat(discountPercentage),
        maxAmount: parseInt(maxAmount),
        isPublished,
      },
    });

    revalidatePath('/admin/create/offers');
    return { success: true, data: offer };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function updateOffer(id: string, formData: FormData) {
  try {
    const image = formData.get('image') as string;
    const offerCode = formData.get('offerCode') as string;
    const discountPercentage = formData.get('discountPercentage') as string;
    const maxAmount = formData.get('maxAmount') as string;
    const isPublished = formData.get('isPublished') === 'true';

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        image,
        offerCode,
        discountPercentage: parseFloat(discountPercentage),
        maxAmount: parseInt(maxAmount),
        isPublished,
      },
    });

    revalidatePath('/admin/create/offers');
    return { success: true, data: offer };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function deleteOffer(id: string) {
  try {
    await prisma.offer.delete({
      where: { id },
    });
    revalidatePath('/admin/create/offers');
    return { success: true };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getOffer(id: string) {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id, isPublished: true },
    });
    return { success: true, data: offer };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getAllOffers() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: offers };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

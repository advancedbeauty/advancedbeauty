'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createHeroBanner(formData: FormData) {
  try {
    const image = formData.get('image') as string;
    const mdImage = formData.get('mdImage') as string;
    const link = formData.get('link') as string;
    const isPublished = formData.get('isPublished') === 'true';

    const banner = await prisma.heroBanner.create({
      data: {
        image,
        mdImage,
        link,
        isPublished,
      },
    });

    revalidatePath('/admin/create/hero-banner');
    revalidatePath('/');
    return { success: true, data: banner };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function updateHeroBanner(id: string, formData: FormData) {
  try {
    const image = formData.get('image') as string;
    const mdImage = formData.get('mdImage') as string;
    const link = formData.get('link') as string;
    const isPublished = formData.get('isPublished') === 'true';

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: { image, mdImage, link, isPublished },
    });

    revalidatePath('/admin/create/hero-banner');
    revalidatePath('/');
    return { success: true, data: banner };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    await prisma.heroBanner.delete({
      where: { id },
    });
    revalidatePath('/admin/create/hero-banner');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getHeroBanners() {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: banners };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

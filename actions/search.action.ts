'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function searchServices(query: string) {
  try {
    const services = await prisma.service.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    revalidatePath('/search');
    return { data: services, error: null };
  } catch (error) {
    return {
      data: null,
      error: 'Failed to fetch services',
    };
  }
}

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createService(data: FormData) {
  try {
    const service = await prisma.service.create({
      data: {
        name: data.get('name') as string,
        slug: (data.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
        category: data.get('category') as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        listPrice: parseFloat(data.get('listPrice') as string),
        images: (data.get('images') as string).split(',').filter(Boolean),
        tags: (data.get('tags') as string).split(',').map((tag) => tag.trim()),
        isPublished: data.get('isPublished') === 'true',
      },
    });

    revalidatePath('/admin/services');
    return { success: true, data: service };
  } catch (error) {
    console.error('Create service error:', error);
    return { success: false, error: 'Failed to create service' };
  }
}

export async function updateService(id: string, data: FormData) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: data.get('name') as string,
        slug: (data.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
        category: data.get('category') as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        listPrice: parseFloat(data.get('listPrice') as string),
        images: (data.get('images') as string).split(',').filter(Boolean),
        tags: (data.get('tags') as string).split(',').map((tag) => tag.trim()),
        isPublished: data.get('isPublished') === 'true',
      },
    });

    revalidatePath('/admin/services');
    return { success: true, data: service };
  } catch (error) {
    console.error('Update service error:', error);
    return { success: false, error: 'Failed to update service' };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });

    revalidatePath('/admin/services');
    return { success: true };
  } catch (error) {
    console.error('Delete service error:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error('Get services error:', error);
    return { success: false, error: 'Failed to fetch services' };
  }
}

export async function getTrendingServices() {
  try {
    const services = await prisma.service.findMany({
      where: {
        tags: {
          has: 'trending',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error('Get trending services error:', error);
    return { success: false, error: 'Failed to fetch trending services' };
  }
}

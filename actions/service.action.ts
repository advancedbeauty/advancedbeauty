'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type Service = {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  description: string | null;
  price: number;
  listPrice: number;
  tags: string[];
  avgRating?: number;
};

type ServiceResponse = {
  success: boolean;
  services?: Service[];
  error?: string;
};

export async function createService(data: FormData) {
  try {
    const detailsRaw = data.get('details');
    const details = detailsRaw
      ? JSON.parse(detailsRaw as string)
      : [{ heading: '', lines: [''] }];
    const service = await prisma.service.create({
      data: {
        name: (data.get('name') as string).trim(),
        slug: (data.get('name') as string).trim().toLowerCase().replace(/\s+/g, '-').replace("&","and"),
        category: data.get('category')?.toString().replace("&","and").trim() as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        listPrice: parseFloat(data.get('listPrice') as string),
        images: (data.get('images') as string).split(',').filter(Boolean),
        tags: (data.get('tags') as string).split(',').map((tag) => tag.trim()),
        isPublished: data.get('isPublished') === 'true',
        details,
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
    const detailsRaw = data.get('details');
    const details = detailsRaw
      ? JSON.parse(detailsRaw as string)
      : [{ heading: '', lines: [''] }];
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: (data.get('name') as string).trim(),
        slug: (data.get('name') as string).trim().toLowerCase().replace(/\s+/g, '-').replace("&","and"),
        category: data.get('category')?.toString().replace("&","and").trim() as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        listPrice: parseFloat(data.get('listPrice') as string),
        images: (data.get('images') as string).split(',').filter(Boolean),
        tags: (data.get('tags') as string).split(',').map((tag) => tag.trim()),
        isPublished: data.get('isPublished') === 'true',
        details,
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

export async function getServices(category?: string) {
  try {

    const whereClause: Prisma.ServiceWhereInput = {
      isPublished: true,
      ...(category && {
        category: {
          contains: category.toLowerCase() == "mani and pedi" ? "Mani & Pedi" : category ,
          mode: Prisma.QueryMode.insensitive, // ✅ use enum here
        },
      }),
    };

    const services = await prisma.service.findMany({
      where: whereClause,
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
          hasSome: ['trending', 'Trending'],
        },
        isPublished: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error('Get trending services error:', error);
    return { success: false, error: 'Failed to fetch trending services' };
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      throw new Error('Service not found');
    }

    return service;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    throw error;
  }
}

export async function checkServiceExists(name: string) {
  try {
    const existingService = await prisma.service.findFirst({
      where: {
        slug: {
          equals: name.toLowerCase().replace(/\s+/g, '-'),
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });

    return {
      success: true,
      exists: !!existingService,
    };
  } catch (error) {
    console.error('Error checking service name:', error);
    return {
      success: false,
      exists: false,
      error: 'Failed to check service name',
    };
  }
}

export async function getWishlistServices(
  serviceIds: string[],
): Promise<ServiceResponse> {
  try {
    if (serviceIds.length === 0) {
      return { success: true, services: [] };
    }
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        images: true,
        description: true,
        price: true,
        listPrice: true,
        tags: true,
        avgRating: true,
      },
    });
    revalidatePath('/service');
    return { success: true, services };
  } catch (error) {
    console.error('Error fetching wishlist services:', error);
    return { success: false, error: 'Failed to fetch wishlist services' };
  }
}

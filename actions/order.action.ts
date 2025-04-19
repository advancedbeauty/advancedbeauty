'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface OrderData {
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    listPrice: number;
    date: string | Date;
    time: string;
    image: string;
  }>;
  name: string;
  phone: string;
  email: string;
  address: string;
  address2?: string;
  city: string;
  country: string;
  postalCode: string;
  offerCode?: string;
  offerDiscount?: number;
  totalPrice: number;
  paymentMethod?: string;
  isPaid?: boolean;
  startDate?: Date;
  endDate?: Date;
  isCompleted?: boolean;
  isCancelled?: boolean;
  isRefunded?: boolean;
}

export async function createOrder(orderData: OrderData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error('Unauthorized');
    }
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        items: orderData.items,
        name: orderData.name,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        address2: orderData.address2,
        city: orderData.city,
        country: orderData.country,
        postalCode: orderData.postalCode,
        offerCode: orderData.offerCode,
        offerDiscount: orderData.offerDiscount,
        totalPrice: orderData.totalPrice,
        paymentMethod: orderData.paymentMethod || 'pending',
        isPaid: orderData.isPaid || false,
        startDate: orderData.startDate || new Date(),
        endDate: orderData.endDate,
        isCompleted: orderData.isCompleted || false,
        isCancelled: orderData.isCancelled || false,
        isRefunded: orderData.isRefunded || false,
      },
    });
    revalidatePath('/profile/orders');
    return { success: true, data: order };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error creating order:', error);
    return { success: false, error: errorMessage };
  }
}

export async function updateOrderAdmin(
  id: string,
  updateData: Partial<OrderData>,
) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error('Unauthorized');
    }
    if (session.user.role !== 'A') {
      throw new Error('Unauthorized');
    }
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { success: true, data: order };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error updating order:', error);
    return { success: false, error: errorMessage };
  }
}

export async function getOrder(id: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error('Unauthorized');
    }
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true, data: order };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error fetching order:', error);
    return { success: false, error: errorMessage };
  }
}

export async function getOrders() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error('Unauthorized');
    }
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
    });
    return { success: true, data: orders };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error fetching orders:', error);
    return { success: false, error: errorMessage };
  }
}

export async function getOrdersAdmin() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error('Unauthorized');
    }
    if (session.user.role !== 'A') {
      throw new Error('Unauthorized');
    }
    const orders = await prisma.order.findMany({});
    return { success: true, data: orders };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error fetching orders:', error);
    return { success: false, error: errorMessage };
  }
}

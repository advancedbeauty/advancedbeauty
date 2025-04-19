'use client';

import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import Heading from '@/components/ui/features/Heading';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getOrders } from '@/actions/order.action';
import { useSession } from 'next-auth/react';
import { toSlug } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IoLogOutOutline } from 'react-icons/io5';

// Define proper types based on your Prisma model
interface OrderItem {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  date: string | Date;
  time: string;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
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
  paymentMethod?: string;
  totalPrice: number;
  isPaid: boolean;
  startDate: string | Date;
  endDate?: string | Date;
  isCompleted: boolean;
  isCancelled: boolean;
  isRefunded: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const Profilepage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = session?.user?.name;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders();

        if (response.success && response.data) {
          setOrders(response.data as unknown as Order[]);
        } else {
          setError(response.error || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // Helper function to determine order status based on boolean fields
  const getOrderStatus = (order: Order) => {
    if (order.isRefunded)
      return { status: 'REFUNDED', className: 'bg-blue-100 text-blue-800' };
    if (order.isCancelled)
      return { status: 'CANCELLED', className: 'bg-red-100 text-red-800' };
    if (order.isCompleted)
      return { status: 'COMPLETED', className: 'bg-green-100 text-green-800' };
    return { status: 'PROCESSING', className: 'bg-yellow-100 text-yellow-800' };
  };

  // Flatten all order items into a single array with order metadata
  const allOrderItems = orders.flatMap((order) => {
    const { status, className } = getOrderStatus(order);
    return (order.items as OrderItem[]).map((item) => ({
      ...item,
      orderId: order.id,
      orderDate: order.createdAt,
      orderStatus: status,
      statusClassName: className,
      isPaid: order.isPaid,
      listPrice: order.totalPrice,
      isCancelled: order.isCancelled,
      isCompleted: order.isCompleted,
    }));
  });

  return (
    <Section className="py-10 lg:py-14 bg-gray-50">
      <Container className="w-full min-h-[70vh]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex justify-center items-center gap-5 mb-4 md:mb-0">
            <Heading text="Your" />
            <Heading text="Orders" />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 flex items-center gap-2 cursor-pointer rounded text-sm">
                <IoLogOutOutline size={20} />
                <span className="font-medium">Logout</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to log out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your current session. You can always
                  log back in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="mr-2">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex justify-center items-center">
            <p className="text-lg">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="min-h-[30vh] flex justify-center items-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : allOrderItems.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col justify-center items-center gap-7">
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-8 h-8" />
              <span className="text-xl font-medium">
                You haven't placed any orders yet
              </span>
            </div>
            <Link
              href="/services"
              className="mt-4 bg-[#D9C1A3] text-black py-2 px-4 rounded-md hover:bg-[#D9C1A3]/80 transition duration-300 ease-in-out"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {allOrderItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-sm rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                >
                  <Link
                    href={`/services/${toSlug(item.category)}/${toSlug(
                      item.name,
                    )}`}
                    className="relative w-[100px] h-[100px] overflow-hidden rounded-md"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.statusClassName}`}
                      >
                        {item.orderStatus}
                      </span>
                      {!item.isPaid && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          PAYMENT PENDING
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/services/${toSlug(item.category)}/${toSlug(
                        item.name,
                      )}`}
                      className="text-lg font-semibold text-gray-800 mt-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Order Date:</span>{' '}
                        {format(new Date(item.orderDate), 'MMMM d, yyyy')}
                      </p>
                      <p>
                        <span className="font-medium">Service Date:</span>{' '}
                        {format(new Date(item.date), 'MMMM d, yyyy')}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex flex-col items-end">
                    <div className="text-xl font-bold text-green-600">
                      ₹{item.listPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Profilepage;

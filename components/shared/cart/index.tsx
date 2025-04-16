'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format, addHours, isBefore, isToday, set } from 'date-fns';
import Heading from '@/components/ui/features/Heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toSlug } from '@/lib/utils';

const CART_KEY = 'ab_service__cart__';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number; // Original price
  listPrice: number; // Discounted price
  date: string | Date; // Booking date
  time: string; // Booking time in 12‑hour format (e.g. "05:00 PM")
  image: string;
  quantity?: number;
}

// Helper function: returns available time slots similar to the service item page
const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];
  if (!selectedDate || !isToday(selectedDate)) return timeSlots;
  const currentTime = new Date();
  const cutoffTime = addHours(currentTime, 6);
  return timeSlots.filter((slot) => {
    const match = slot.match(/(\d+):(\d+) (AM|PM)/);
    if (!match) return false;
    const [, hour, minute, period] = match;
    const slotHour =
      parseInt(hour) + (period === 'PM' && hour !== '12' ? 12 : 0);
    const slotDate = set(new Date(), {
      hours: slotHour,
      minutes: parseInt(minute),
      seconds: 0,
      milliseconds: 0,
    });
    return isBefore(cutoffTime, slotDate);
  });
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart) as CartItem[];
        setCartItems(items);
      } catch (error) {
        console.error('Error parsing cart items:', error);
      }
    }
  }, []);

  // Update localStorage whenever the cart changes
  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  };

  // Remove a cart item
  const handleRemove = useCallback(
    (id: string) => {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      updateCart(updatedCart);
      toast.success('Item removed from cart.');
    },
    [cartItems],
  );

  // Handle change for date field
  const handleChangeDate = (id: string, newDate: string) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, date: newDate };
      }
      return item;
    });
    updateCart(updatedCart);
    toast.success('Date updated.');
  };

  // Handle change for time using the select option
  const handleChangeTime = (id: string, newTime: string) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, time: newTime };
      }
      return item;
    });
    updateCart(updatedCart);
    toast.success('Time updated.');
  };

  // Compute price details from cart items
  const computePriceDetails = (items: CartItem[]) => {
    let subtotal = 0;
    let totalDiscount = 0;
    items.forEach((item) => {
      const qty = item.quantity || 1;
      subtotal += item.price * qty;
      totalDiscount += (item.price - item.listPrice) * qty;
    });
    // Shipping is free if subtotal is ₹1000 or more; otherwise, ₹50.
    const shippingFee = subtotal >= 1000 ? 0 : 50;
    const total = subtotal - totalDiscount + shippingFee;
    return { subtotal, totalDiscount, shippingFee, total };
  };

  const priceDetails = computePriceDetails(cartItems);
  const isEmpty = cartItems.length === 0;

  return (
    <Section className="py-10 lg:py-14 bg-gray-50">
      <Container className="w-full">
        {isEmpty ? (
          <div className="min-h-[30vh] flex flex-col justify-center items-center gap-7">
            <div className="flex items-center gap-4 flex-row-reverse">
              <ShoppingCart className="w-8 h-8" />
              <span className="text-xl font-medium">Your Cart is Empty</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="mt-4 bg-[#D9C1A3] text-black py-2 px-4 rounded-md hover:bg-[#D9C1A3]/80 transition duration-300 ease-in-out"
              >
                Continue Shopping
              </Link>
              <Link
                href="/profile/orders"
                className="mt-4 bg-[#D9C1A3] text-black py-2 px-4 rounded-md hover:bg-[#D9C1A3]/80 transition duration-300 ease-in-out"
              >
                Go to Orders
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex justify-center items-center gap-5">
              <Heading text="Your" />
              <Heading text="Cart" />
            </div>
            <div className="w-full flex items-center justify-end mt-10">
              <Link
                href="/profile/orders"
                className="text-sm bg-[#D9C1A3] hover:bg-[#c4ac8e] px-4 py-2 rounded-md text-neutral-950 font-medium flex items-center gap-1"
              >
                Your Orders
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full mt-10">
              {/* Cart Items List */}
              <div className="w-full space-y-4">
                {cartItems.map((item) => {
                  // Compute available time slots based on the current date of each cart item
                  const availableTimeSlots = getAvailableTimeSlots(
                    new Date(item.date),
                  );
                  return (
                    <div
                      key={item.id}
                      className="bg-white shadow-sm rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8"
                    >
                      {/* Image */}
                      <Link
                        href={`/services/${toSlug(item.category)}/${toSlug(
                          item.name,
                        )}`}
                        className="w-full sm:w-auto"
                      >
                        <div className="relative w-[100px] h-[100px] overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <Link
                          href={`/services/${toSlug(item.category)}/${toSlug(
                            item.name,
                          )}`}
                          className="text-lg font-semibold text-gray-800 mt-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Date:</span>{' '}
                          {format(new Date(item.date), 'MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Time:</span> {item.time}
                        </p>
                        {/* Date & Time Editing */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">
                              Change Date:
                            </label>
                            <input
                              type="date"
                              value={format(new Date(item.date), 'yyyy-MM-dd')}
                              onChange={(e) =>
                                handleChangeDate(item.id, e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-auto"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">
                              Change Time:
                            </label>
                            <Select
                              value={item.time}
                              onValueChange={(value) =>
                                handleChangeTime(item.id, value)
                              }
                            >
                              <SelectTrigger className="w-full sm:w-auto border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary focus:outline-none">
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTimeSlots.length === 0 ? (
                                  <SelectItem value="no-slots" disabled>
                                    No available slots
                                  </SelectItem>
                                ) : (
                                  availableTimeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-xl font-bold text-green-600">
                          ₹{item.listPrice.toLocaleString()}
                          {item.price > item.listPrice && (
                            <span className="ml-2 text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                              {Math.round(
                                ((item.price - item.listPrice) / item.price) *
                                  100,
                              )}
                              % OFF
                            </span>
                          )}
                        </div>
                        {item.price > item.listPrice && (
                          <div className="text-sm line-through text-gray-400">
                            ₹{item.price.toLocaleString()}
                          </div>
                        )}
                        <Button
                          onClick={() => handleRemove(item.id)}
                          className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Details */}
              <div className="w-full lg:w-1/3 max-w-[350px]">
                <div className="sticky top-8 bg-white shadow-sm rounded-md p-4">
                  <h3 className="text-gray-600 uppercase text-lg font-semibold mb-4">
                    Price Details
                  </h3>
                  <div className="border-t border-b py-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>
                        -₹{priceDetails.totalDiscount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {priceDetails.shippingFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₹${priceDetails.shippingFee}`
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="py-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Payable</span>
                      <span>₹{priceDetails.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link href="/checkout?type=cart">
                    <Button className="cursor-pointer w-full bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 py-2 px-4 rounded font-medium mb-3">
                      Proceed to checkout
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button
                      variant="outline"
                      className="cursor-pointer w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded font-medium flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                  {priceDetails.totalDiscount > 0 && (
                    <div className="text-green-700 font-medium mt-4">
                      You will save ₹
                      {priceDetails.totalDiscount.toLocaleString()} on this
                      order
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default CartPage;

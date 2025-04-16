'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/button';
import { format } from 'date-fns';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  listPrice: number;
  date: string | Date;
  time: string;
  image: string;
  quantity?: number;
}

const CART_KEY = 'ab_service__cart__';
const BUY_NOW_KEY = 'ab_service__buy_now__';

const Checkout = () => {
  const searchParams = useSearchParams();
  const checkoutType = searchParams.get('type');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'India',
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Load cart items from localStorage based on checkout type
  useEffect(() => {
    const storageKey = checkoutType === 'cart' ? CART_KEY : BUY_NOW_KEY;

    const storedItems = localStorage.getItem(storageKey);
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems) as CartItem[];
        setCartItems(items);
      } catch (error) {
        console.error(`Error parsing ${storageKey} items:`, error);
      }
    }
  }, [checkoutType]);

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

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    // Process order
    // const orderPlaced = await processOrder(formData);

    // if (orderPlaced) {
    // Redirect to order confirmation page
    console.log('Order placed successfully!', formData);
    // router.push('/orders/order-confirmation');
    // }
  };

  const priceDetails = computePriceDetails(cartItems);

  return (
    <Section className="py-10 lg:py-14 bg-gray-50">
      <Container className="w-full">
        <div className="w-full flex flex-col lg:flex-row gap-7 items-start">
          <Card className="rounded p-0 w-full lg:w-2/3">
            <CardHeader className="!p-4 border-b">
              <CardTitle className="uppercase text-lg text-gray-600">
                Billing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !p-4 mb-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name and Phone Number */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit mobile number"
                      required
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Address Line 1 */}
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Street address or P.O. Box"
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                {/* Country, State, Postal Code */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      value="India"
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="postalCode">
                      Postal Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Enter postal code"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card className="rounded p-0 w-full lg:w-1/3">
            <CardHeader className="!p-4 border-b">
              <CardTitle className="uppercase text-lg text-gray-600">
                Order summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 italic">No items in cart</p>
              ) : (
                <>
                  {/* Items List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                          <div className="text-xs text-gray-600 mt-1">
                            {format(new Date(item.date), 'MMM d, yyyy')} at{' '}
                            {item.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            ₹{item.listPrice.toLocaleString()}
                          </div>
                          {item.price > item.listPrice && (
                            <div className="text-xs line-through text-gray-400">
                              ₹{item.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Details */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                    </div>
                    {priceDetails.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>
                          -₹{priceDetails.totalDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}
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

                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{priceDetails.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 py-2 px-4 rounded font-medium"
                    onClick={() =>
                      document.querySelector('form')?.requestSubmit()
                    }
                  >
                    Place Order
                  </Button>

                  {priceDetails.totalDiscount > 0 && (
                    <div className="text-sm text-green-700 font-medium mt-2">
                      You saved ₹{priceDetails.totalDiscount.toLocaleString()}{' '}
                      on this order
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export default Checkout;

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { getAllOffers } from '@/actions/offer.action';
import { createOrder } from '@/actions/order.action';
import { toast } from 'sonner';
import { getOrderConfirmationHtml } from '../mails/order-confirm';

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

interface Offer {
  id: string;
  offerCode: string;
  discountPercentage: number;
  maxAmount: number;
  image: string;
  isPublished: boolean;
}

const CART_KEY = 'ab_service__cart__';
const BUY_NOW_KEY = 'ab_service__buy_now__';

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutType = searchParams.get('type');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    type: 'success' | 'error' | '';
  }>({ text: '', type: '' });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handle coupon code input change
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value.toUpperCase());
    // Clear any previous message when user types
    if (couponMessage.text) {
      setCouponMessage({ text: '', type: '' });
    }
  };

  // Validate and apply coupon code using server action
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({
        text: 'Please enter a coupon code',
        type: 'error',
      });
      return;
    }

    try {
      setIsApplyingCoupon(true);

      // Find offers with matching code
      // Note: This approach works if you have an index to search by offerCode
      // If not, you'll need to adjust the API to support finding by code
      const offersResponse = await getAllOffers();

      if (offersResponse.success && offersResponse.data) {
        // Find the matching offer by code
        const matchingOffer = offersResponse.data.find(
          (offer) => offer.offerCode === couponCode && offer.isPublished,
        );

        if (matchingOffer) {
          setAppliedOffer(matchingOffer);
          setCouponMessage({
            text: `${matchingOffer.discountPercentage}% discount applied successfully!`,
            type: 'success',
          });
        } else {
          setCouponMessage({
            text: 'Invalid or expired coupon code',
            type: 'error',
          });
          setAppliedOffer(null);
        }
      } else {
        setCouponMessage({
          text: offersResponse.error || 'Error validating coupon',
          type: 'error',
        });
        setAppliedOffer(null);
      }
    } catch (error) {
      setCouponMessage({
        text: 'Error validating coupon',
        type: 'error',
      });
      setAppliedOffer(null);
      console.error('Error applying coupon:', error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedOffer(null);
    setCouponCode('');
    setCouponMessage({ text: 'Coupon removed', type: 'success' });
    setTimeout(() => {
      setCouponMessage({ text: '', type: '' });
    }, 3000);
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

    // Calculate the net amount after item discounts
    const netAmount = subtotal - totalDiscount;

    // Calculate coupon discount if any
    let couponDiscount = 0;
    if (appliedOffer) {
      // Calculate discount based on percentage of net amount
      const calculatedDiscount =
        netAmount * (appliedOffer.discountPercentage / 100);

      // Cap the discount at maxAmount from the offer
      couponDiscount = Math.min(calculatedDiscount, appliedOffer.maxAmount);

      // Also ensure the discount doesn't exceed the net amount
      couponDiscount = Math.min(couponDiscount, netAmount);
    }

    // Shipping is free if subtotal is ₹1000 or more; otherwise, ₹50.
    const shippingFee = netAmount >= 1500 ? 0 : netAmount >= 1000 ? 49 : 99;
    const total = netAmount - couponDiscount + shippingFee;

    return {
      subtotal,
      totalDiscount,
      couponDiscount,
      shippingFee,
      total,
      // Include additional information for display
      discountPercent: appliedOffer?.discountPercentage || 0,
      maxDiscountAmount: appliedOffer?.maxAmount || 0,
    };
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

    setIsSubmitting(true);
    try {
      const orderData = {
        items: cartItems,
        name: formData.fullName,
        phone: formData.phoneNumber,
        email: formData.email,
        address: formData.addressLine1,
        address2: formData.addressLine2 || undefined,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        offerCode: appliedOffer?.offerCode || undefined,
        offerDiscount: appliedOffer ? priceDetails.couponDiscount : undefined,
        totalPrice: priceDetails.total,
        paymentMethod: 'pending', // You can update this based on payment selection
        isPaid: false,
        startDate: new Date(),
        isCompleted: false,
        isCancelled: false,
        isRefunded: false,
      };
      const response = await createOrder(orderData);

      if (response.success) {

        const emailHtml = getOrderConfirmationHtml({
          fullName: formData.fullName,
          cartItems,
          priceDetails,
        });

        try {
          const resp = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email,
              subject: 'Booking Confirmation – Your Booking Has Been Received',
              html: emailHtml,
            }),
          });
          const data = await resp.json();
          if (!data.success) {
            console.warn('Email send failed:', data.error);
          }
        } catch (err) {
          console.error('Network error sending email:', err);
        }

        // Order was created successfully
        toast.success('Order placed successfully!');

        // Clear cart based on checkout type
        const storageKey = checkoutType === 'cart' ? CART_KEY : BUY_NOW_KEY;
        localStorage.removeItem(storageKey);

        // Redirect to order confirmation or orders page
        router.push('/order-confirmation');
      } else {
        // Handle error
        toast.error(response.error || 'Error placing order');
        router.push('/auth?callbackUrl=/checkout');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error placing order');
    } finally {
      setIsSubmitting(false);
    }
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
              <form onSubmit={handleSubmit} className="space-y-4" aria-disabled={isSubmitting}>
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

                  {/* Coupon Code Section */}
                  <div className="mt-4 border-t pt-4">
                    <Label htmlFor="couponCode" className="text-sm font-medium">
                      Apply Coupon Code
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="text"
                        id="couponCode"
                        placeholder="Enter coupon code"
                        className="flex-1"
                        value={couponCode}
                        onChange={handleCouponChange}
                        disabled={!!appliedOffer}
                      />
                      {!appliedOffer ? (
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 cursor-pointer"
                        >
                          {isApplyingCoupon ? 'Applying...' : 'Apply'}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRemoveCoupon}
                          className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md cursor-pointer"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {couponMessage.text && (
                      <p
                        className={`text-sm mt-1 ${
                          couponMessage.type === 'success'
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {couponMessage.text}
                      </p>
                    )}
                    {appliedOffer && (
                      <p className="text-xs text-gray-500 mt-1">
                        {appliedOffer.discountPercentage}% off up to ₹
                        {appliedOffer.maxAmount}
                      </p>
                    )}
                  </div>

                  {/* Price Details */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                    </div>
                    {priceDetails.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Item Discount</span>
                        <span>
                          -₹{priceDetails.totalDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {priceDetails.couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Coupon Discount ({appliedOffer?.offerCode})</span>
                        <span>
                          -₹{priceDetails.couponDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Convenience charges</span>
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
                    className="w-full bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 py-2 px-4 rounded font-medium cursor-pointer"
                    onClick={() =>
                      document.querySelector('form')?.requestSubmit()
                    }
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  {(priceDetails.totalDiscount > 0 ||
                    priceDetails.couponDiscount > 0) && (
                    <div className="text-sm text-green-700 font-medium mt-2">
                      You saved ₹
                      {(
                        priceDetails.totalDiscount + priceDetails.couponDiscount
                      ).toLocaleString()}{' '}
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

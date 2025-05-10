'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Clock, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(7);

  useEffect(() => {
    const orderData = localStorage.getItem('currentOrder');

    // Optional: redirect if no order exists (disabled in demo)
    if (!orderData && false) {
      router.push('/profile/orders');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      router.push('/profile/orders');
    }, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="mr-3 h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Order Confirmed</CardTitle>
                <CardDescription className="mt-1">
                  Thank you for your booking!
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Package className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Order Processing</AlertTitle>
            <AlertDescription className="text-blue-700">
              Your booking is being processed. You'll receive a confirmation email
              shortly.
            </AlertDescription>
          </Alert>

          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <p>
              Redirecting to your orders in {timeLeft} second
              {timeLeft !== 1 ? 's' : ''}...
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 border-t pt-6 mt-4">
          <Link href="/profile/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              View Orders
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full group">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;

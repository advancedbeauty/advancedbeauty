'use client';

import React, { useState, useEffect } from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import { format, isBefore, isToday, addHours, set } from 'date-fns';
import Heading from '../ui/features/Heading';
import { getServiceBySlug } from '@/actions/service.action';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Link from 'next/link';
import { toast } from 'sonner';
import parseDetails, { ServiceDetails } from '@/helper/servicedeatils'; // adjust path as needed

const CART_KEY = 'ab_service__cart__';
const BUY_NOW_KEY = 'ab_service__buy_now__';

const isDateDisabled = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isBefore(date, today)) return true;
  if (isToday(date)) {
    const currentTime = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(currentTime.getHours() + 6, 0, 0, 0);
    const lastSlot = new Date();
    lastSlot.setHours(17, 0, 0, 0);
    if (cutoffTime > lastSlot) return true;
  }
  return false;
};

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
    const [hour, minute, period] =
      slot.match(/(\d+):(\d+) (AM|PM)/)?.slice(1) || [];
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

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  listPrice: number;
  discount: number;
  images: string[];
  details?: ServiceDetails; // Optional extra service details
}

export interface LocalCartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  listPrice: number;
  date: string; // ISO string for date
  time: string;
  image: string;
}

const Serviceitempage: React.FC = () => {
  const pathname = usePathname();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const slug = pathname ? pathname.split('/').pop() || '' : '';
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    if (service) {
      const existingCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      const found = existingCart.some(
        (item: LocalCartItem) => item.id === service.id,
      );
      setInCart(found);
    }
  }, [service]);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) {
        setLoading(false);
        setError('Invalid service slug');
        return;
      }
      try {
        const result = await getServiceBySlug(slug);
        console.log('Service result:', result);
        if (!result) {
          setError('Service not found');
        } else {
          const discount = Math.round(
            ((result.price - result.listPrice) / result.price) * 100,
          );
          setService({
            ...result,
            discount,
            description: result.description || '',
            details: result.details ? parseDetails(result.details) : undefined,
          });
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const hasDiscount = service
    ? Math.round(((service.price - service.listPrice) / service.price) * 100)
    : 0;
  const discountAmount = service ? service.price - service.listPrice : 0;
  const availableTimeSlots = getAvailableTimeSlots(selectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setCalendarOpen(false);
  };

  const handleAddToCart = () => {
    if (!service || !selectedDate || !selectedTime) {
      toast.error('Please select a date and time before adding to the cart.');
      return;
    }
    const newCartItem = {
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      listPrice: service.listPrice,
      date: selectedDate,
      time: selectedTime,
      image: service.images[0] || '/logo/logo.png',
    };
    const existingCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const isAlreadyInCart = existingCart.some(
      (item: LocalCartItem) => item.id === service.id,
    );
    if (!isAlreadyInCart) {
      const updatedCart = [...existingCart, newCartItem];
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      setInCart(true);
      toast.success('Service added to cart successfully!');
    } else {
      toast.error('This service is already in your cart.');
    }
  };

  const handleRemoveFromCart = () => {
    if (!service) return;
    const existingCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const updatedCart = existingCart.filter(
      (item: LocalCartItem) => item.id !== service.id,
    );
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    setInCart(false);
    toast.success('Service removed from cart.');
  };

  // Parse service details and cast to ServiceDetails
  // const detailsParsed =
  //   service && service.details
  //     ? (parseDetails(service.details) as ServiceDetails)
  //     : null;

  const checkoutHref = `/checkout?type=booknow`;

  const handleBookNow = () => {
    if (!service || !selectedDate || !selectedTime) {
      toast.error(
        'Please select a date and time before proceeding to checkout.',
      );
      return;
    }
    const newCartItem = {
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      listPrice: service.listPrice,
      date: selectedDate,
      time: selectedTime,
      image: service.images[0] || '/logo/logo.png',
    };
    localStorage.removeItem(BUY_NOW_KEY);
    localStorage.setItem(BUY_NOW_KEY, JSON.stringify([newCartItem]));
    toast.success('Proceeding to checkout!');
  };

  if (loading) {
    return (
      <Section className="py-10 lg:py-14 min-h-[70vh]">
        <Container className="w-full text-center">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !service) {
    return (
      <Section className="py-10 lg:py-14 min-h-[70vh]">
        <Container className="w-full text-center">
          <Heading text={error || 'Service not found'} />
          <p className="mt-4 text-gray-600">
            The service you are looking for does not exist or could not be
            loaded.
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-10 lg:py-20 bg-gray-50">
      <Container className="w-full flex flex-col lg:flex-row gap-12">
        <div className="relative w-full lg:max-w-5/12">
          <div className="relative aspect-[4/3] rounded overflow-hidden shadow-md">
            <Image
              src={service.images[0] || '/logo/logo.png'}
              alt={service.name || 'Service image'}
              width={1000}
              height={1000}
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 select-none"
            />
          </div>
        </div>

        <div className="w-full lg:w-7/12">
          <CardHeader className="px-0">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="text-primary text-sm px-3 py-1 rounded-full"
              >
                {service.category}
              </Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-semibold text-gray-800 capitalize">
              {service.name}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-4 text-base leading-relaxed">
              {service.description}
            </CardDescription>

            {service.details && (
              <div className="mt-10">
                {typeof service.details === 'string' ? (
                  <p className="text-gray-700">{service.details}</p>
                ) : (
                  <div className="w-full">
                    {service.details.map((detail, idx) => (
                      <div key={idx} className="mb-4 border-b pb-4">
                        <div className="font-semibold text-gray-800 mb-1">{detail.heading}</div>
                        <ul className="list-disc list-inside text-gray-700">
                          {detail.lines.map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="px-0 mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded mb-8">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    ₹{service.listPrice.toLocaleString()}
                  </span>
                  {hasDiscount > 0 && (
                    <>
                      <span className="text-gray-400 line-through text-xl">
                        ₹{service.price.toLocaleString()}
                      </span>
                      <Badge
                        variant="destructive"
                        className="ml-2 text-sm px-2 py-1 rounded-full"
                      >
                        {service.discount}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                {hasDiscount > 0 && (
                  <div className="mt-4 space-y-2">
                    <Badge
                      variant="secondary"
                      className="text-sm px-3 py-1 rounded-full"
                    >
                      Save ₹{discountAmount.toLocaleString()}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      Limited time offer - Book now to avail the discount
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Preferred Date
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {selectedDate ? (
                      format(selectedDate, 'PPP')
                    ) : (
                      <span className="text-gray-500">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && isToday(selectedDate) && (
                <p className="text-sm text-amber-600">
                  * Only showing times available with 6-hour notice
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <Select
                value={selectedTime}
                onValueChange={setSelectedTime}
                disabled={!selectedDate}
              >
                <SelectTrigger className="w-full border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary focus:outline-none">
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
              {selectedDate && availableTimeSlots.length === 0 && (
                <p className="text-sm text-red-500">
                  No available time slots for this date
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleBookNow}
                className="p-0 m-0 flex-1 bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                disabled={!selectedDate || !selectedTime}
              >
                <Link
                  href={checkoutHref}
                  className="w-full h-full flex items-center justify-center rounded-sm"
                >
                  Book Now
                </Link>
              </Button>
              {inCart ? (
                <Button
                  className="transition flex-1 bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:outline-none cursor-pointer"
                  onClick={handleRemoveFromCart}
                >
                  Remove from Cart
                </Button>
              ) : (
                <Button
                  className="transition flex-1 bg-gray-200 text-black hover:bg-primary-dark focus:ring-2 focus:outline-none cursor-pointer"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Container>
    </Section>
  );
};

export default Serviceitempage;

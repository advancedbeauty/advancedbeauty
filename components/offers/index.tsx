'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getAllOffers } from '@/actions/offer.action';
import Heading from '../ui/features/Heading';

interface Offer {
  id: string;
  image: string;
  offerCode: string;
  discountPercentage: number;
  maxAmount: number;
  isPublished: boolean;
}

const OfferCard = ({ offer }: { offer: Offer }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        toast.success('Offer code copied to clipboard!');

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error('Failed to copy code');
      });
  };

  return (
    <Card className="border rounded border-gray-200 overflow-hidden relative p-0 gap-0">
      <div className="w-full h-48 flex items-center justify-center text-white overflow-hidden relative">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={`${offer.offerCode} offer`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gray-200 transform rotate-45 absolute" />
            <div className="w-64 h-64 bg-gray-200 transform -rotate-45 absolute" />
            <div className="relative z-10 p-6 text-center">
              <h3 className="font-serif text-3xl font-bold mb-2">Special</h3>
              <h3 className="font-serif text-3xl font-bold mb-2">Package</h3>
              <h3 className="font-serif text-3xl font-bold">Deals</h3>
            </div>
          </div>
        )}
      </div>

      <CardContent className="px-0 py-2 flex items-center justify-around">
        <div className="font-mono font-semibold text-lg tracking-wider">
          {offer.offerCode}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-gray-200 cursor-pointer"
          onClick={() => copyToClipboard(offer.offerCode)}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const result = await getAllOffers();
      if (result.success && result.data) {
        // Only show published offers
        const publishedOffers = result.data.filter(
          (offer: Offer) => offer.isPublished,
        );
        setOffers(publishedOffers);
      }
    } catch (error) {
      toast.error('Failed to load offers');
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">No Offers Available</h2>
        <p className="text-gray-500">Check back later for exciting deals!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-center items-center gap-5">
        <Heading text="Special" />
        <Heading text="Offers" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default Offers;

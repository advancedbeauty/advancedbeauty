import React from 'react';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Heading from '@/components/ui/features/Heading';

const Cartpage = () => {
  const cartItem = true;
  return (
    <Section className="py-10 lg:py-14">
      <Container>
        {!cartItem ? (
          <div className="min-h-[30vh] flex justify-center items-center flex-col gap-7">
            <div className="flex items-center gap-4 flex-row-reverse">
              <ShoppingCart />
              <span>Your Cart is Empty</span>
            </div>
            <div className="flex items-center gap-4 flex-row-reverse">
              <Link
                href={'/services'}
                className="mt-4 bg-[#D9C1A3] text-black py-2 px-4 rounded-md hover:bg-[#D9C1A3]/80 transition duration-300 ease-in-out"
              >
                Continue Shopping
              </Link>
              <Link
                href={'/profile/orders'}
                className="mt-4 bg-[#D9C1A3] text-black py-2 px-4 rounded-md hover:bg-[#D9C1A3]/80 transition duration-300 ease-in-out"
              >
                Go to Orders
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center items-center gap-5">
              <Heading text="Your" />
              <Heading text="cart" />
            </div>
            
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Cartpage;

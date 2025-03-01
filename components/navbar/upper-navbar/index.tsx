import React from 'react';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';

interface UpperNavbarProps {
  className?: string;
}

const UpperNavbar: React.FC<UpperNavbarProps> = ({ className }) => {
  return (
    <Section className={`${className} bg-[#FBF1EA] text-black py-1 relative`}>
      <Container className="w-full flex items-center justify-center">
        <span className="font-medium text-sm uppercase text-center">
          10% off on all orders
        </span>
      </Container>
    </Section>
  );
};

export default UpperNavbar;

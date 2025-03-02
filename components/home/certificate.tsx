import React from 'react';
import Image from 'next/image';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';

const Certificatesection = () => {
  return (
    <Section
      className="py-8 sm:py-16 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('/images/certificatesection/parallax_certificate.jpg')",
      }}
    >
      <Container className="w-full">
        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
          <Image
            src="/images/certificatesection/pankhri.jpg"
            alt="Certificate 1"
            width={1000}
            height={1000}
            className="object-contain w-full h-[250px] sm:h-[300px] md:h-auto md:max-h-[500px]"
          />
        </div>
      </Container>
    </Section>
  );
};

export default Certificatesection;

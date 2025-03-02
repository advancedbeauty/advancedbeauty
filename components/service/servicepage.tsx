import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import Heading from '../ui/features/Heading';
import ServiceCard from './servicecard';
import data from '@/lib/data';

const ServicePage = () => {
  return (
    <Section className="py-10 lg:py-20">
      <Container className="w-full">
        <div className="flex justify-center items-center gap-5">
          <Heading text="All" />
          <Heading text="Service" />
          <Heading text="categories" />
        </div>
        <div className="mt-10 grid px-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {data.ServiceCategoryData.map((category) => (
            <div className="flex justify-center" key={category.id}>
              <ServiceCard
                src={category.image}
                alt={category.title}
                title={category.title}
                href={category.url}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ServicePage;

import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import data from '@/lib/data';
import CategoriesCard from './categoriescard';
import Heading from '../ui/features/Heading';

const ServiceCategory = () => {
  return (
    <Section className="py-10 lg:py-14 bg-[#FBF1EA]">
      <Container className="w-full">
        <div className="flex gap-5 justify-center items-center">
          <Heading text="service" />
          <Heading text="categories" />
        </div>
        <div className="mt-10 lg:mt-14 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 justify-items-center">
          {data.ServiceCategoryData.map((category) => (
            <div key={category.id}>
              <CategoriesCard
                title={category.title}
                src={category.image}
                alt={category.title}
                href={category.url}
                isLoading={false}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ServiceCategory;

import React from 'react';
import Section from '../ui/features/Section';
import Heading from '../ui/features/Heading';
import Container from '../ui/features/Container';
import data from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Faqsection = () => {
  return (
    <Section className="py-10 md:py-20">
      <Container className="w-full">
        <Heading text="FAQ" isS />
        <div className="mt-10">
          <Accordion type="single" collapsible>
            {data.FaqData.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className="hover:no-underline text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-neutral-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
};

export default Faqsection;

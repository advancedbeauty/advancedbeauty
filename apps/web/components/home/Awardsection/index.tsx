
import React from 'react';
import { HomeAwardsData } from '@/data/homeAwards';
import AwardsCard from './awards-card';
import Section from '@workspace/ui/components/shared/Section';
import Container from '@workspace/ui/components/shared/Container';
import Carousel from '@/components/ui/Carousel';

const Awardsection = () => {
    const carouselItems = HomeAwardsData.map((card, index) => <AwardsCard key={index} src={card.src} />);

    return (
        <Section className="py-16 md:py-20">
            <Container className="w-full">
                <Carousel
                    items={carouselItems}
                    slidesPerView={5}
                    spaceBetween={0}
                    loop={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        200: { slidesPerView: 2 },
                        370: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 },
                    }}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                        stopOnLastSlide: false,
                    }}
                    speed={1000}
                />
            </Container>
        </Section>
    );
};

export default Awardsection;

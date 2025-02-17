import Container from '@workspace/ui/components/shared/Container';
import Section from '@workspace/ui/components/shared/Section';
import Image from 'next/image';
import React from 'react';

const Certificatesection = () => {
    return (
        <Section
            className="py-8 sm:py-16 bg-fixed bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/section-images/certificateSection/parallax_certificate.jpg')" }}
        >
            <Container className="w-full">
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                    {/* <div className="w-full md:w-1/2"> */}
                        <Image
                            src="/section-images/certificateSection/pankhri.jpg"
                            alt="Certificate 1"
                            width={1000}
                            height={1000}
                            className="object-contain w-full h-[250px] sm:h-[300px] md:h-auto md:max-h-[500px]"
                        />
                    {/* </div> */}
                    {/* <div className="w-full md:w-1/2">
                        <Image
                            src="/certificates/pankhri.jpg"
                            alt="Certificate 2"
                            width={1000}
                            height={1000}
                            className="object-contain w-full h-[250px] sm:h-[300px] md:h-auto md:max-h-[500px]"
                        />
                    </div> */}
                </div>
            </Container>
        </Section>
    );
};

export default Certificatesection;
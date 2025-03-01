import React from 'react';
import Link from 'next/link';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';

const PrivacyPolicy = () => {
    return (
        <Section className='py-5 md:py-10 lg:py-16'>
            <Container className='w-full flex flex-col gap-10 mb-10'>
                <div>
                    <span className='text-3xl font-bold'>Privacy Policy:</span>
                    <p className='mt-5 font-medium'>
                        At Advanced Beauty, accessible from{` `}
                        <Link href='https://www.advancedbeauty.in' className='text-blue-600 underline font-semibold'>www.advancedbeauty.in</Link>, 
                        we prioritize the privacy of our clients. This Privacy Policy outlines the types of personal information we collect, how we use it, and the measures we take to protect your information. By using our website and services, you consent to the data practices described in this policy.
                    </p>
                </div>
                <ul className='pl-7 md:pl-10 lg:pl-16 list-decimal flex flex-col gap-7'>
                    <li className='font-bold text-xl'>
                        <span>Information We Collect</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li><strong>Contact Information:</strong> Name, email address, phone number, and address.</li>
                            <li><strong>Payment Information:</strong> Credit card details and billing address (processed through secure third-party payment gateways).</li>
                            <li><strong>Appointment Details:</strong> Preferences, service selections, and any other relevant information related to your service.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>How We Use Your Information</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li><strong>To Provide Services:</strong> To process your appointments, manage your bookings, and deliver our beauty services.</li>
                            <li><strong>To Communicate:</strong> To send you confirmations, reminders, and updates related to your appointments.</li>
                            <li><strong>To Improve Our Services:</strong> To analyze user behavior and preferences to enhance our offerings.</li>
                            <li><strong>For Marketing:</strong> With your consent, to send you promotional materials and newsletters about our services and offers.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Data Protection and Security</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>We are committed to ensuring that your information is secure. We implement a variety of security measures, including encryption and secure servers, to protect your personal data from unauthorized access, alteration, disclosure, or destruction.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Sharing Your Information</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li><strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist us in operating our website and providing our services, subject to confidentiality agreements.</li>
                            <li><strong>Legal Compliance:</strong> We may disclose your information to comply with applicable laws, regulations, or legal requests.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Your Rights</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>Access the personal information we hold about you.</li>
                            <li>Request correction or deletion of your personal information.</li>
                            <li>Withdraw consent for marketing communications at any time.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Cookies</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>Our website uses cookies to enhance user experience. Cookies are small files stored on your device that help us analyze web traffic and improve our site. You can choose to accept or decline cookies, but this may prevent you from taking full advantage of our website.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Changes to This Privacy Policy</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Contact Information</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>For any queries or concerns, please contact us at support@advancedbeauty.in or call us at 8826207080.</li>
                            <li>We are here to assist you and ensure your experience is satisfactory.</li>
                        </ul>
                    </li>
                </ul>
            </Container>
        </Section>
    );
};

export default PrivacyPolicy;

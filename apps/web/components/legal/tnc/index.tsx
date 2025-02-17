import Section from "@workspace/ui/components/shared/Section";
import Container from "@workspace/ui/components/shared/Container";


const TermsAndConditions = () => {
    return (
        <Section className='py-5 md:py-10 lg:py-16'>
            <Container className='w-full flex flex-col gap-10 mb-10'>
                <span className='text-3xl font-bold'>Terms & Conditions:</span>
                <ul className='pl-7 md:pl-10 lg:pl-16 list-decimal flex flex-col gap-7'>
                    <li className='font-bold text-xl'>
                        <span>Service Area</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>We provide at-home beauty services in Noida, Greater Noida, Gurgaon, and Delhi (NCR).</li>
                            <li>Services are available for a wide range of beauty treatments, ensuring convenience and quality.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Service Charges</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>A service charge of ₹100 will apply for each visit.</li>
                            <li>A 10% prepayment is required at the time of booking to secure your appointment.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Service Delivery</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>Our team will arrive within a maximum of 2 hours from the scheduled appointment time.</li>
                            <li>We aim for punctuality to ensure a smooth and efficient experience.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Reporting Issues</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>If you encounter any issues during the service, please report them immediately to our technician.</li>
                            <li>Complaints reported after the service will require a new booking, and applicable charges will apply.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Cancellation Policy</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>Cancellations made within 2 hours of the scheduled appointment will incur a charge.</li>
                            <li>We recommend giving sufficient notice to avoid any cancellation fees.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Payment Terms</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>Payments can be made through various methods, including cash, credit/debit cards, and digital wallets.</li>
                            <li>Full payment is expected upon completion of the service unless a prepayment has been made.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Liability</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>While we strive to provide high-quality services, we are not liable for any allergies, skin reactions, or injuries that may occur during or after the service.</li>
                            <li>Clients are encouraged to consult with a healthcare professional regarding any concerns prior to service.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Client Responsibility</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>Clients must inform our technicians of any medical conditions, allergies, or sensitivities before the service begins.</li>
                            <li>It is the client&apos;s responsibility to ensure that the service area is safe and suitable for the treatments.</li>
                        </ul>
                    </li>
                    <li className='font-bold text-xl'>
                        <span>Modifications</span>
                        <ul className='list-disc pl-4 font-normal text-base gap-1 flex flex-col mt-1'>
                            <li>We reserve the right to modify these terms and conditions at any time without prior notice.</li>
                            <li>Clients will be notified of any significant changes via email or through our website.</li>
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

export default TermsAndConditions;

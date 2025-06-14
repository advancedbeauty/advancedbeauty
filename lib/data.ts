import { toSlug } from './utils';

export type ServiceCategory = {
  id: number;
  title: string;
  url: string;
  image: string;
};

const data = {
  HomeAwardsData: [
    {
      src: '/images/awardsection/awards1.png',
    },
    {
      src: '/images/awardsection/awards2.png',
    },
    {
      src: '/images/awardsection/awards3.png',
    },
    {
      src: '/images/awardsection/awards4.png',
    },
    {
      src: '/images/awardsection/awards5.png',
    },
    {
      src: '/images/awardsection/awards6.png',
    },
  ],
  TestimonialData: [
    {
      id: 1,
      name: 'Kaushiki Kashyap',
      review:
        'Amazing service and so satisfactory, Mrs Kiran is so humble while each and every service highly recommended to each one of you. Good number of experience she is holding which is clearly noticeable in her service. Thanks a lot will surely book again.',
      rating: 5,
      image: '/images/testimonials/testimonial1.png',
      reviewDate: '01/01/2023',
    },
    {
      id: 2,
      name: 'Rakhi Sharma',
      review:
        'I got nail extensions done for my engagement which worked really well and lasted a long time. I also got them done for my bridal ,I have great experience with Advanced Beauty.',
      rating: 5,
      image: '/images/testimonials/testimonial2.png',
      reviewDate: '01/02/2023',
    },
    {
      id: 3,
      name: 'Reetika Malik',
      review:
        'The extensions are beautifully done—natural-looking and sturdy. The nail paint is vibrant and flawless, really enhancing the overall look. The service was professional and friendly, making the experience even better.',
      rating: 5,
      image: '/images/testimonials/testimonial3.png',
      reviewDate: '01/03/2023',
    },
    {
      id: 4,
      name: 'Geetanjali Dayal',
      review:
        'Amazing work !! kiran is really calm while doing the extensions and ensures that you are comfortable.She is very good at her work.I would recommend her as her prices are very reasonable and best.',
      rating: 5,
      image: '/images/testimonials/testimonial4.png',
      reviewDate: '01/04/2023',
    },
    {
      id: 5,
      name: 'Khushi Yadav',
      review:
        'I recently had the pleasure of getting services from Kiran. She did pedicure, manicure, and cleanup for me and I couldn’t be happier with the results. From the moment she walked in, she made me feel comfortable and pampered. The attention to detail was exceptional, and it was clear that she takes great pride in her work.',
      rating: 5,
      image: '/images/testimonials/testimonial5.png',
      reviewDate: '01/05/2023',
    },
  ],
  FaqData: [
    {
      id: 1,
      question: 'What is salon at home?',
      answer:
        'Salon at Home is a beauty service provider that offers nail and spa services at your home within your own comfort. You just have to contact the advanced beauty which is the best salon at home in Noida and Delhi NCR, choose the service, like nail extensions, facial, waxing, eyelashes extensions, and makeup artist, and select your preferred time and date. Rest will be handled by the salon and the beautician and artist will be sent to your home.',
    },
    {
      id: 2,
      question: 'What are the benefits of salon at home?',
      answer:
        'The benefits of salon at home are numerous. The first and foremost benefit is that you get the services at your home, which means you don’t have to travel to the salon. You can get the services at your own comfort. The second benefit is that you can get the services at your preferred time and date. The third benefit is that you can get the services at a reasonable price. The fourth benefit is that you can get the services from the best beauticians and artists.',
    },
  ],
  InstagramData: [
    {
      id: 1,
      url: 'https://www.instagram.com/reel/C3xLL_HNXg2/',
    },
    {
      id: 2,
      url: 'https://www.instagram.com/reel/DDcjZCVz2Iw/',
    },
    {
      id: 3,
      url: 'https://www.instagram.com/reel/DDmZRzpzdCD/',
    },
    {
      id: 4,
      url: 'https://www.instagram.com/reel/C_-czqJvUAq/',
    },
  ],
  ServiceCategoryData: [
    
    {
      id: 1,
      title: 'Special Deals',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/specialdeals.png',
    },
    {
      id: 2,
      title: 'Threading',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/threading.webp',
    },
    {
      id: 3,
      title: 'Pre Bridal',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/prebridal.webp',
    },
    {
      id: 4,
      title: 'nail extension and art',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/nailextensionandart.jpg',
    },
    {
      id: 5,
      title: 'Makeup',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/Makeup.webp',
    },
    {
      id: 6,
      title: 'Hair care',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/haircare.webp',
    },
    {
      id: 7,
      title: 'Mani and pedi',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/manipedi.webp',
    },
    {
      id: 8,
      title: 'waxing',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/waxing.webp',
    },
    {
      id: 9,
      title: 'Detan',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/detan.webp',
    },
    {
      id:10,
      title: 'Bleach',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/bleack.webp',
    },
    {
      id: 11,
      title: 'Cleanup',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/cleanup.webp',
    },
    {
      id: 12,
      title: 'Facial',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/facial.webp',
    },
    {
      id: 13,
      title: 'Eyelashes Extension',
      get url() {
        return `/services/${toSlug(this.title)}`;
      },
      image: '/images/servicecategory/eyelashes.webp',
    },
  ] as ServiceCategory[],
  ServiceTagsData: [
    { id: '1', name: 'Premium' },
    { id: '2', name: 'Budget' },
    { id: '3', name: 'Popular' },
    { id: '4', name: 'New' },
    { id: '5', name: 'Trending' },
    { id: '6', name: 'Limited' },
    { id: '7', name: 'Essential' },
    { id: '8', name: 'Luxury' },
    { id: '9', name: 'Best Seller' },
    { id: '10', name: 'Featured' },
  ],
};

export const { ServiceCategoryData } = data;
export default data;

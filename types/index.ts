import { z } from 'zod';
import { ServiceInputSchema, ProductInputSchema } from '@/lib/validator';

export type IServiceInput = z.infer<typeof ServiceInputSchema>;
export type IProductInput = z.infer<typeof ProductInputSchema>;

export type ServiceData = {
  services: IServiceInput[];
  headerMenus: {
    name: string;
    href: string;
  }[];
  carousels: {
    url: string;
    image: string;
    isPublished: boolean;
  }[];
};

import ActiveLink from '@/components/ui/features/ActiveLink';

const Navlinks = () => {
  return (
    <div className="flex gap-10 font-medium text-sm uppercase">
      <ActiveLink href="/" text="Home" />
      <ActiveLink href="/services" text="Services" />
      <ActiveLink href="/offers" text="Offers" />
      <ActiveLink href="/wishlist" text="Wishlist" />
      <ActiveLink href="/admin/dashboard" text="Dashboard" />
    </div>
  );
};

export default Navlinks;
